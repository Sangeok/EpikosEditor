"use client";

import { ImageDataType, ImageScriptType, videoScriptType } from "@/entities/mediaAsset/types";
import useMediaAssetStore from "@/entities/mediaAsset/useMediaAssetStore";
import { LanguageSelector } from "@/features/createMediaAsset/B_Topic/ui/_components/LanguageSelector";
import { ScriptDisplay } from "@/features/createMediaAsset/B_Topic/ui/_components/ScriptDisplay";
import { TopicTabs } from "@/features/createMediaAsset/B_Topic/ui/_components/TopicTabs/ui";
import { voiceType } from "@/features/createMediaAsset/C_VideoTTS/model/type";
import VoiceSelector from "@/features/createMediaAsset/C_VideoTTS/ui/_components/VoiceSelector";
import VideoStyleOptionItem from "@/features/createMediaAsset/E_VIdeoStyle/ui/_component/VideoStyleOptionItem";
import { AutoGeneratePayload } from "@/server/autoGenerateStore";
import Button from "@/shared/ui/atoms/Button/ui/Button";
import Dialog from "@/shared/ui/atoms/Dialog/ui/Dialog";
import axios from "axios";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type AutoGenerateResultResponse = {
  jobId: string;
  status: "pending" | "completed" | "failed";
  payload?: AutoGeneratePayload;
  error?: string;
};

interface AutoGenerateMediaAssetProps {
  openDialog: boolean;
  setOpenDialog: (open: boolean) => void;
}

export default function AutoGenerateMediaAsset({ openDialog, setOpenDialog }: AutoGenerateMediaAssetProps) {
  const [autoJobId, setAutoJobId] = useState<string | null>(null);
  const [autoJobStatus, setAutoJobStatus] = useState<"idle" | "pending" | "completed" | "failed">("idle");
  const [autoJobError, setAutoJobError] = useState<string | null>(null);
  const pathname = usePathname();
  const videoFormType = pathname.split("/")[1];

  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const language = useMediaAssetStore((state) => state.initialCreateVideoData.language);

  const [voice, setVoice] = useState<voiceType>({ model: "aura-2-draco-en", name: "Draco" });

  const videoScript = useMediaAssetStore((state) => state.initialCreateVideoData.videoScript);
  const setCreateVideoField = useMediaAssetStore((state) => state.setCreateVideoDataByField);

  const hasVideoScript = videoScript?.length > 0;

  const videoStyle = useMediaAssetStore((state) => state.initialCreateVideoData.generateImage.generateImageStyle);
  const setGenerateImageField = useMediaAssetStore((state) => state.setGenerateImageDataByFied);
  const setTts = useMediaAssetStore((state) => state.setTts);

  const applyAutoGeneratePayload = useCallback(
    (payload: AutoGeneratePayload) => {
      if (!payload) return;

      if (payload.videoScript) {
        console.log("payload.videoScript", payload.videoScript);
        setCreateVideoField("videoScript", payload.videoScript);
        setGenerateImageField("selectedVideoScript", payload.videoScript[0] as unknown as videoScriptType);
      }

      const imageScript = (payload.imageScript ?? []) as ImageScriptType[];
      if (imageScript.length) {
        setCreateVideoField("imageScript", imageScript);
      }

      if (payload.imageUrls?.length) {
        const normalizedImages: ImageDataType[] = payload.imageUrls.map((url, index) => ({
          imageId: index,
          url,
          startTime: imageScript[index]?.startTime ?? 0,
          endTime: imageScript[index]?.endTime ?? 0,
          duration: imageScript[index]?.duration ?? 0,
          type: imageScript[index]?.type ?? "image",
          isCreated: true,
        }));
        setCreateVideoField("imageData", normalizedImages);
      }

      if (payload.explanation) {
        setCreateVideoField("videoExplanation", payload.explanation);
      }

      if (payload.videoTTs?.buffer) {
        const { buffer, mimeType } = payload.videoTTs;
        const rawBuffer = buffer as unknown;
        let audioBytes: Uint8Array | null = null;

        if (rawBuffer instanceof Uint8Array) {
          audioBytes = rawBuffer;
        } else if (rawBuffer instanceof ArrayBuffer) {
          audioBytes = new Uint8Array(rawBuffer);
        } else if (Array.isArray((rawBuffer as { data?: number[] })?.data)) {
          audioBytes = Uint8Array.from((rawBuffer as { data: number[] }).data);
        }

        if (audioBytes?.length) {
          const blobPart = audioBytes as unknown as BlobPart;
          const audioBlob = new Blob([blobPart], { type: mimeType ?? "audio/mpeg" });
          const ttsUrl = URL.createObjectURL(audioBlob);
          setTts(ttsUrl);
        }
      }

      if (payload.captions) {
        setCreateVideoField("captions", payload.captions);
      }
    },
    [setCreateVideoField, setGenerateImageField, setTts]
  );

  const handleAutoGenerate = async () => {
    setIsGenerating(true);
    setAutoJobError(null);
    setAutoJobStatus("idle");

    try {
      const data = useMediaAssetStore.getState().initialCreateVideoData;
      const payload = {
        projectId: "123",
        topic: data.topic,
        topicDetail: data.topicDetail,
        language: data.language,
        videoStyle: data.generateImage.generateImageStyle,
        voice: voice.model,
        videoFormType,
      };

      const res = await axios.post("/api/auto-generate", payload);
      const newJobId = res.data?.jobId as string | undefined;

      if (!newJobId) {
        throw new Error("jobId가 반환되지 않았습니다.");
      }

      setAutoJobId(newJobId);
      setAutoJobStatus("pending");
    } catch (err) {
      console.error(err);
      setAutoJobError(err instanceof Error ? err.message : "자동 생성 요청에 실패했습니다.");
      setAutoJobStatus("failed");
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (!autoJobId || autoJobStatus !== "pending") return;

    let isActive = true;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const pollResult = async () => {
      if (!isActive) return;
      try {
        const response = await fetch(`/api/auto-generate/result?jobId=${autoJobId}`);

        if (!response.ok) {
          throw new Error(`상태 조회 실패 (status: ${response.status})`);
        }

        const data: AutoGenerateResultResponse = await response.json();

        console.log("data", data);

        if (data.status === "completed" && data.payload) {
          applyAutoGeneratePayload(data.payload);
          setAutoJobStatus("completed");
          setIsGenerating(false);
          if (intervalId) clearInterval(intervalId);
        } else if (data.status === "failed") {
          setAutoJobStatus("failed");
          setAutoJobError(data.error ?? "자동 생성이 실패했습니다.");
          setIsGenerating(false);
          if (intervalId) clearInterval(intervalId);
        }
      } catch (error) {
        console.error("자동 생성 결과 폴링 실패", error);
        setAutoJobError(error instanceof Error ? error.message : "결과 조회 중 오류가 발생했습니다.");
      }
    };

    pollResult();
    intervalId = setInterval(pollResult, 3000);

    return () => {
      isActive = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, [autoJobId, autoJobStatus, applyAutoGeneratePayload]);

  return (
    <Dialog open={openDialog} onClose={() => setOpenDialog(false)} title="Auto Generate" size="3xl">
      <div className="space-y-4">
        <p className="text-gray-400 border-b border-zinc-700/70 p-4">Select minimal options to generate media asset</p>

        {/* Video Topic */}
        <div className="border border-zinc-700/70 bg-zinc-900/40 p-4 rounded-lg">
          <p className="text-gray-400">Video Topic</p>
          <TopicTabs />

          <div className="mt-4 flex gap-8">
            <LanguageSelector />
          </div>

          {hasVideoScript && <ScriptDisplay />}
        </div>

        {/* Video TTS */}
        <div className="border border-zinc-700/70 bg-zinc-900/40 p-4 rounded-lg">
          <p className="text-gray-400">Video TTS</p>
          <VoiceSelector voice={voice} setVoice={setVoice} language={language} />
        </div>

        {/* Video Styles */}
        <div className="border border-zinc-700/70 bg-zinc-900/40 p-4 rounded-lg">
          <p className="text-gray-400">Video Styles</p>
          <VideoStyleOptionItem videoStyle={videoStyle} setVideoStyle={setGenerateImageField} />
        </div>

        {/* Generate Button */}
        <div className="flex">
          <Button size="md" className="w-full" onClick={handleAutoGenerate} disabled={isGenerating}>
            {isGenerating ? "Generating..." : "Generate"}
          </Button>
        </div>

        {autoJobStatus === "pending" && (
          <p className="text-sm text-amber-400">자동 생성 중입니다. 잠시만 기다려 주세요...</p>
        )}

        {autoJobStatus === "completed" && (
          <p className="text-sm text-emerald-400">자동 생성이 완료되었습니다. 결과가 적용되었습니다.</p>
        )}

        {autoJobStatus === "failed" && autoJobError && (
          <p className="text-sm text-red-400">자동 생성 실패: {autoJobError}</p>
        )}
      </div>
    </Dialog>
  );
}
