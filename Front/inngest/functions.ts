import { VideoStyleOptionsType } from "@/entities/mediaAsset/types";
import { inngest } from "./client";
import { convertToSRT } from "@/features/createMediaAsset/D_Caption/lib/convertToSRT";
import { processSRT, translateCaption } from "@/features/createMediaAsset/D_Caption/model/utils";
import { splitText } from "@/features/createMediaAsset/C_VideoTTS/lib/splitText";
import type { AutoGeneratePayload } from "@/server/autoGenerateStore";
import { writeFileSync, readFileSync, unlinkSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

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
    videoFormType: "longForm" | "shortForm";
  };
};

const AUTO_GENERATE_RESULT_ENDPOINT =
  process.env.AUTO_GENERATE_RESULT_ENDPOINT ?? "http://localhost:3000/api/auto-generate/result";

// ============================================
// Helper Functions: 임시 파일 관리
// ============================================

function getTempFilePath(jobId: string, suffix: string): string {
  return join(tmpdir(), `inngest-${jobId}-${suffix}`);
}

function saveToTemp(jobId: string, suffix: string, data: any): string {
  const filePath = getTempFilePath(jobId, suffix);
  try {
    if (typeof data === "undefined") {
      throw new Error("Data is undefined");
    }

    if (Buffer.isBuffer(data)) {
      writeFileSync(filePath, data);
    } else {
      writeFileSync(filePath, JSON.stringify(data), "utf-8");
    }
    return filePath;
  } catch (error) {
    throw new Error(`임시 파일 저장 실패 [${suffix}]: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function loadFromTemp(filePath: string, isBuffer = false): any {
  try {
    if (isBuffer) {
      return readFileSync(filePath);
    }
    return JSON.parse(readFileSync(filePath, "utf-8"));
  } catch (error) {
    throw new Error(`임시 파일 로드 실패 [${filePath}]: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function cleanupTempFiles(jobId: string): void {
  const patterns = ["script.json", "tts.bin", "captions.json", "imageScript.json", "explanation.txt"];
  patterns.forEach((pattern) => {
    try {
      unlinkSync(getTempFilePath(jobId, pattern));
    } catch (error) {
      // 파일이 없으면 무시
    }
  });
  console.log(`[Cleanup] 임시 파일 정리 완료: ${jobId}`);
}

// ============================================
// Result Reporting
// ============================================

async function reportAutoGenerateResult(
  jobId: string | undefined,
  payload: AutoGeneratePayload | null,
  error?: unknown,
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

// ============================================
// Inngest Function: 6개 Step으로 분리
// ============================================

export const generateMediaAsset = inngest.createFunction(
  { id: "generate-media-asset" },
  { event: "generate-media-asset-events", retries: 1 },
  async ({ event, step }) => {
    const payload = event as AutoGenerateEvent;
    const { language, videoStyle, voice, topic, topicDetail, jobId, videoFormType } = payload.data;

    if (!jobId) {
      throw new Error("jobId is required");
    }

    console.log(`[Inngest] 작업 시작: ${jobId}`);

    try {
      // ============================================
      // Step 1: 스크립트 생성
      // ============================================
      const scriptMeta = await step.run("generate-video-script", async () => {
        console.log("[Step 1/6] 스크립트 생성 시작...");

        const scriptResult = await fetch("http://localhost:3000/api/generate-youtubeScript", {
          method: "POST",
          body: JSON.stringify({ topic, language, topicDetail, videoFormType }),
          headers: { "Content-Type": "application/json" },
        });

        const scriptBody = await scriptResult.json().catch(() => null);

        if (!scriptResult.ok) {
          throw new Error(
            `Script request failed: ${scriptResult.status} ${scriptResult.statusText} | ${JSON.stringify(scriptBody)}`,
          );
        }

        const videoScript = scriptBody?.scripts;
        if (!Array.isArray(videoScript) || videoScript.length === 0) {
          throw new Error(`Invalid script response shape: ${JSON.stringify(scriptBody)}`);
        }

        // 임시 파일로 저장
        const filePath = saveToTemp(jobId, "script.json", videoScript);

        console.log("[Step 1/6] 스크립트 생성 완료", {
          length: videoScript[0]?.content?.length,
          count: videoScript.length,
        });

        // 메타데이터만 반환 (512KB 이하)
        return {
          filePath,
          length: videoScript[0]?.content?.length ?? 0,
          count: videoScript.length,
        };
      });

      // ============================================
      // Step 2: TTS 생성
      // ============================================
      const ttsMeta = await step.run("generate-video-tts", async () => {
        console.log("[Step 2/6] TTS 생성 시작...");

        // 이전 step 데이터 로드
        const videoScript = loadFromTemp(scriptMeta.filePath);

        const targetText = language === "Korean" ? videoScript[0]?.translatedContent : videoScript[0]?.content;

        if (!targetText) {
          throw new Error("No script text available for TTS generation.");
        }

        const textChunks = splitText(targetText);
        if (!textChunks.length) {
          throw new Error("Failed to split script text for TTS generation.");
        }

        const chunkBuffers: Buffer[] = [];
        let detectedMimeType = "audio/mpeg";
        const ttsAPIUrl =
          language === "English"
            ? "http://localhost:3000/api/generate-voice-en"
            : "http://localhost:3000/api/generate-voice";

        for (let i = 0; i < textChunks.length; i++) {
          console.log(`[Step 2/6] TTS chunk ${i + 1}/${textChunks.length} 생성 중...`);
          const ttsResult = await fetch(ttsAPIUrl, {
            method: "POST",
            body: JSON.stringify({ text: textChunks[i], voice }),
            headers: { "Content-Type": "application/json" },
          });

          detectedMimeType = ttsResult.headers.get("content-type") ?? detectedMimeType;
          const arrayBuffer = await ttsResult.arrayBuffer();
          chunkBuffers.push(Buffer.from(arrayBuffer));
        }

        const videoTTsBuffer = Buffer.concat(chunkBuffers);

        // 임시 파일로 저장 (binary)
        const filePath = saveToTemp(jobId, "tts.bin", videoTTsBuffer);

        console.log("[Step 2/6] TTS 생성 완료", {
          audioSize: videoTTsBuffer.length,
          mimeType: detectedMimeType,
          chunks: chunkBuffers.length,
        });

        // 메타데이터만 반환
        return {
          filePath,
          mimeType: detectedMimeType,
          audioSize: videoTTsBuffer.length,
        };
      });

      // ============================================
      // Step 3: 자막 생성
      // ============================================
      const captionMeta = await step.run("generate-captions", async () => {
        console.log("[Step 3/6] 자막 생성 시작...");

        // 이전 step 데이터 로드
        const videoTTsBuffer = loadFromTemp(ttsMeta.filePath, true);

        const formData = new FormData();
        const audioBytes = Uint8Array.from(videoTTsBuffer);
        const audioBlob = new Blob([audioBytes], { type: ttsMeta.mimeType });
        formData.append("audio", audioBlob, "tts.wav");
        formData.append("language", language);

        const captionResponse = await fetch("http://localhost:3000/api/generate-captions", {
          method: "POST",
          body: formData,
        });

        if (!captionResponse.ok) {
          throw new Error(`Caption request failed: ${captionResponse.status}`);
        }

        const captions = await captionResponse.json();
        const generatedSRT = convertToSRT(captions, language);

        let contentToProcess = generatedSRT;
        if (language === "Korean") {
          contentToProcess = await translateCaption(generatedSRT, "English");
        }

        const { scenes } = processSRT(contentToProcess, { videoFormType });

        // 임시 파일로 저장
        const filePath = saveToTemp(jobId, "captions.json", {
          generatedSRT,
          scenes,
        });

        console.log("[Step 3/6] 자막 생성 완료", {
          captionLines: generatedSRT.split("\n").length,
          sceneCount: scenes?.length,
        });

        // 메타데이터만 반환
        return {
          filePath,
          captionLines: generatedSRT.split("\n").length,
          sceneCount: scenes?.length,
        };
      });

      // ============================================
      // Step 4: 이미지 스크립트 생성
      // ============================================
      const imageScriptMeta = await step.run("generate-image-script", async () => {
        console.log("[Step 4/6] 이미지 스크립트 생성 시작...");

        // 이전 step 데이터 로드
        const videoScript = loadFromTemp(scriptMeta.filePath);
        const captionData = loadFromTemp(captionMeta.filePath);

        const imageScriptResult = await fetch("http://localhost:3000/api/generate-imageScriptUsingCaption", {
          method: "POST",
          body: JSON.stringify({
            style: videoStyle,
            script: videoScript,
            language,
            topic,
            topicDetail,
            scenes: captionData.scenes,
          }),
          headers: { "Content-Type": "application/json" },
        });

        const imageScript = await imageScriptResult.json();

        // 임시 파일로 저장
        const filePath = saveToTemp(jobId, "imageScript.json", imageScript);

        console.log("[Step 4/6] 이미지 스크립트 생성 완료", {
          scriptCount: imageScript?.length,
        });

        // 메타데이터만 반환
        return {
          filePath,
          scriptCount: imageScript?.length ?? 0,
        };
      });

      // ============================================
      // Step 5: 이미지 생성
      // ============================================
      const imageMeta = await step.run("generate-images", async () => {
        console.log("[Step 5/6] 이미지 생성 시작...");

        // 이전 step 데이터 로드
        const imageScript = loadFromTemp(imageScriptMeta.filePath);

        const imageUrls: string[] = [];

        if (imageScript?.length > 0) {
          for (let i = 0; i < imageScript.length; i++) {
            console.log(`[Step 5/6] 이미지 ${i + 1}/${imageScript.length} 생성 중...`);
            const imageResult = await fetch("http://localhost:3000/api/generate-image", {
              method: "POST",
              body: JSON.stringify({ imagePrompt: imageScript[i].imagePrompt }),
              headers: { "Content-Type": "application/json" },
            });

            const imageData = await imageResult.json();
            imageUrls.push(imageData.data.imageUrl);
          }
        }

        console.log("[Step 5/6] 이미지 생성 완료", {
          imageCount: imageUrls.length,
        });

        // 메타데이터만 반환 (URL은 작으므로 직접 반환)
        return {
          imageUrls,
          imageCount: imageUrls.length,
        };
      });

      // ============================================
      // Step 6: 설명 생성
      // ============================================
      const explanationMeta = await step.run("generate-explanation", async () => {
        console.log("[Step 6/6] 설명 생성 시작...");

        const explanationResult = await fetch("http://localhost:3000/api/generate-explanation", {
          method: "POST",
          body: JSON.stringify({ topic, topicDetail, language }),
          headers: { "Content-Type": "application/json" },
        });

        const explanationData = await explanationResult.json();
        const explanation = explanationData.explanation;

        // 임시 파일로 저장
        const filePath = saveToTemp(jobId, "explanation.txt", explanation);

        console.log("[Step 6/6] 설명 생성 완료", {
          explanationLength: explanation?.length,
        });

        // 메타데이터만 반환
        return {
          filePath,
          explanationLength: explanation?.length ?? 0,
        };
      });

      // ============================================
      // 최종: 모든 데이터 조합 및 저장
      // ============================================
      console.log("[Final] 최종 결과 조합 시작...");

      // 모든 임시 파일에서 데이터 로드
      const videoScript = loadFromTemp(scriptMeta.filePath);
      const videoTTsBuffer = loadFromTemp(ttsMeta.filePath, true);
      const captionData = loadFromTemp(captionMeta.filePath);
      const imageScript = loadFromTemp(imageScriptMeta.filePath);
      const explanation = loadFromTemp(explanationMeta.filePath);

      const resultPayload: AutoGeneratePayload = {
        message: "generate-media-asset-events",
        data: payload.data,
        videoScript,
        videoTTs: {
          buffer: videoTTsBuffer,
          mimeType: ttsMeta.mimeType,
        },
        captions: captionData.generatedSRT,
        imageScript,
        imageUrls: imageMeta.imageUrls,
        explanation,
      };

      // 결과를 autoGenerateStore에 저장
      await reportAutoGenerateResult(jobId, resultPayload);
      console.log("[Final] 결과 저장 완료");

      // ✅ 성공 시에만 임시 파일 정리
      cleanupTempFiles(jobId);

      // 함수 최종 return (메타데이터)
      return {
        success: true,
        jobId,
        metadata: {
          scriptLength: scriptMeta.length,
          audioSize: ttsMeta.audioSize,
          imageCount: imageMeta.imageCount,
          captionLines: captionMeta.captionLines,
        },
      };
    } catch (error) {
      console.error("[Inngest] 작업 실패:", error);
      await reportAutoGenerateResult(jobId, null, error);

      // ⚠️ 실패 시에는 임시 파일 유지 (재시도 대비)
      console.log("[Cleanup] 실패로 인해 임시 파일 유지 (재시도 대비)");

      return {
        success: false,
        jobId,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  },
);
