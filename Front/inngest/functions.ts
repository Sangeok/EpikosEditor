import { VideoStyleOptionsType } from "@/entities/mediaAsset/types";
import { inngest } from "./client";
import { convertToSRT } from "@/features/createMediaAsset/D_Caption/lib/convertToSRT";
import { processSRT, translateCaption } from "@/features/createMediaAsset/D_Caption/model/utils";
import type { AutoGeneratePayload } from "@/server/autoGenerateStore";

type AutoGenerateEvent = {
  data: {
    projectId: string;
    title: string;
    topic: string;
    topicDetail?: string;
    language: "English" | "Korean";
    videoStyle: VideoStyleOptionsType | string;
    voice: string;
    scriptIndex?: number;
    jobId?: string;
    requestedAt?: number;
  };
};

const AUTO_GENERATE_RESULT_ENDPOINT =
  process.env.AUTO_GENERATE_RESULT_ENDPOINT ?? "http://localhost:3000/api/auto-generate/result";

async function reportAutoGenerateResult(
  jobId: string | undefined,
  payload: AutoGeneratePayload | null,
  error?: unknown
) {
  if (!jobId) return;

  const body = payload
    ? { jobId, payload }
    : {
        jobId,
        error: error instanceof Error ? error.message : String(error),
      };

  try {
    await fetch(AUTO_GENERATE_RESULT_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch (storeError) {
    console.error("Failed to report auto-generate result", storeError);
  }
}

export const generateMediaAsset = inngest.createFunction(
  { id: "generate-media-asset" },
  { event: "generate-media-asset-events", retries: 1 },
  async ({ event, step }) => {
    const payload = event as AutoGenerateEvent;
    const { language, videoStyle, voice, topic, topicDetail, jobId } = payload.data;
    console.log("payload", payload);

    try {
      const videoScript = await step.run("generate-video-script", async () => {
        const result = await fetch("http://localhost:3000/api/generate-youtubeScript", {
          method: "POST",
          body: JSON.stringify({ topic, language, topicDetail }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await result.json();
        return data.scripts;
      });

      const videoTTs = await step.run("generate-video-tts", async () => {
        const result = await fetch("http://localhost:3000/api/generate-voice", {
          method: "POST",
          body: JSON.stringify({ text: videoScript[0].content, voice }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        const arrayBuffer = await result.arrayBuffer();
        return {
          buffer: Buffer.from(arrayBuffer),
          mimeType: result.headers.get("content-type") ?? "audio/mpeg",
        };
      });

      const captions = await step.run("generate-captions", async () => {
        const formData = new FormData();

        const audioBytes =
          videoTTs.buffer instanceof Uint8Array
            ? new Uint8Array(videoTTs.buffer)
            : Uint8Array.from((videoTTs.buffer as any).data ?? []);

        const audioBlob = new Blob([audioBytes], { type: videoTTs.mimeType });
        formData.append("audio", audioBlob, "tts.wav");
        formData.append("language", language);

        const response = await fetch("http://localhost:3000/api/generate-captions", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Caption request failed: ${response.status}`);
        }
        return response.json();
      });

      const generatedSRT = convertToSRT(captions, language);

      let contentToProcess = generatedSRT;

      if (language === "Korean") {
        // 한국어면 번역 필요
        contentToProcess = await translateCaption(generatedSRT, "English");
      }

      const { scenes } = processSRT(contentToProcess);

      const imageScript = await step.run("generate-image-script", async () => {
        const result = await fetch("http://localhost:3000/api/generate-imageScriptUsingCaption", {
          method: "POST",
          body: JSON.stringify({ style: videoStyle, script: videoScript, language, topic, topicDetail, scenes }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await result.json();
        return data;
      });

      const hasImageScript = imageScript?.length > 0;
      let imageUrls: string[] = [];

      if (hasImageScript) {
        for (let i = 0; i < imageScript.length; i++) {
          const imageUrl = await step.run(`generate-image-${i}`, async () => {
            const result = await fetch("http://localhost:3000/api/generate-image", {
              method: "POST",
              body: JSON.stringify({ imagePrompt: imageScript[i].imagePrompt }),
              headers: {
                "Content-Type": "application/json",
              },
            });
            const data = await result.json();
            return data.data.imageUrl;
          });
          imageUrls.push(imageUrl);
        }
      }

      const explanation = await step.run("generate-explanation", async () => {
        const result = await fetch("http://localhost:3000/api/generate-explanation", {
          method: "POST",
          body: JSON.stringify({ topic, topicDetail, language }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await result.json();
        return data.explanation;
      });

      const normalizedVideoTTs: AutoGeneratePayload["videoTTs"] = {
        buffer: Buffer.isBuffer(videoTTs.buffer)
          ? videoTTs.buffer
          : videoTTs.buffer instanceof Uint8Array
          ? Buffer.from(videoTTs.buffer)
          : Buffer.from((videoTTs.buffer as { data?: number[] })?.data ?? []),
        mimeType: videoTTs.mimeType,
      };

      const resultPayload: AutoGeneratePayload = {
        message: "generate-media-asset-events",
        data: payload.data,
        videoScript,
        videoTTs: normalizedVideoTTs,
        captions: generatedSRT,
        imageScript,
        imageUrls,
        explanation,
      };

      await reportAutoGenerateResult(jobId, resultPayload);

      return resultPayload;
    } catch (error) {
      console.error(error);
      await reportAutoGenerateResult(payload.data.jobId, null, error);
    }
  }
);
