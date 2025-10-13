"use client";

import { MediaElement } from "@/entities/media/types";
import useMediaAssetStore from "@/entities/mediaAsset/useMediaAssetStore";
import { useProjectStore } from "@/entities/project/useProjectStore";
import ProjectTitle from "@/features/createMediaAsset/A_ProjectTitle/ui/ProjectTitle";
import Topic from "@/features/createMediaAsset/B_Topic/ui/Topic";
import GenVideoTTS from "@/features/createMediaAsset/C_VideoTTS/ui/GenVideoTTS";
import VideoCaption from "@/features/createMediaAsset/D_Caption/ui/VIdeoCaption";
import VideoStyle from "@/features/createMediaAsset/E_VIdeoStyle/ui/VideoStyle";
import GenVideoImage from "@/features/createMediaAsset/F_VideoImage/ui/GenVideoImage";
import VideoExplanation from "@/features/createMediaAsset/G_Explanation/ui/VideoExplanation";
import Preview from "@/features/createMediaAsset/Preview/ui/Preview";
import { useTrackLaneStore } from "@/features/editFeatures/model/store/useTrackLaneStore";
import Button from "@/shared/ui/atoms/Button/ui/Button";
import IconButton from "@/shared/ui/atoms/Button/ui/IconButton";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { convertImageElement } from "../lib/convertImageElement";
import { ImageDataType } from "@/entities/mediaAsset/types";
import { useMediaStore } from "@/entities/media/useMediaStore";
import { createAudioElement } from "@/shared/lib/audioElementFactory";
import { convertSRTToTextElements } from "@/shared/lib/srtUtils";
import { parseSRTContent } from "@/shared/lib/srtUtils";
import { ProjectPersistenceService } from "@/shared/lib/projectPersistence";

export default function CreateMediaAssetPage() {
  const router = useRouter();
  const projectId = useProjectStore((state) => state.project.id);

  const activeLaneByType = useTrackLaneStore((s) => s.activeLaneByType);
  const imageData = useMediaAssetStore((state) => state.initialCreateVideoData.imageData);
  const ttsUrl = useMediaAssetStore((state) => state.initialCreateVideoData.ttsUrl);
  const captions = useMediaAssetStore((state) => state.initialCreateVideoData.captions);

  const addMediaElements = useMediaStore((s) => s.addMediaElements);
  const addAudioElement = useMediaStore((s) => s.addAudioElement);
  const addTextElement = useMediaStore((s) => s.addTextElement);

  const handleGenerateVideo = async () => {
    const mediaLaneId = activeLaneByType.Media;
    const audioLaneId = activeLaneByType.Audio;
    const textLaneId = activeLaneByType.Text;

    // 1) 이미지 요소 추가
    const convertedImageElements: MediaElement[] = [];
    imageData?.forEach((imageData: ImageDataType) => {
      const convertedImageElement = convertImageElement(imageData, mediaLaneId);
      convertedImageElements.push(convertedImageElement);
    });

    console.log("convertedImageElements", convertedImageElements);
    addMediaElements(convertedImageElements);

    // 2) 오디오 요소 추가 (오디오 레인)
    if (ttsUrl) {
      const audioElement = await createAudioElement(ttsUrl, audioLaneId);
      console.log("audioElement", audioElement);
      addAudioElement(audioElement);
    }

    // 3) 자막 요소 추가 (텍스트 레인)
    if (captions) {
      const parsedEntries = parseSRTContent(captions);
      const textElements = convertSRTToTextElements(parsedEntries).map((el) => ({
        ...el,
        laneId: textLaneId,
      }));

      console.log("textElements", textElements);

      textElements.forEach((element) => {
        addTextElement(element, true);
      });
    }

    // 4) 저장 후 에디터로 이동
    await ProjectPersistenceService.saveCurrentProject();
    router.push(`/edits/${projectId}`);
  };

  return (
    <div>
      <header className="flex w-full justify-between p-2">
        <h2 className="text-2xl font-bold mt-2 p-4">Create New Video</h2>
        <IconButton onClick={() => router.back()}>
          <ArrowLeft />
        </IconButton>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 p-4 gap-7">
        <div className="col-span-2 p-7 border rounded-xl h-[72vh] overflow-y-auto">
          {/* Project Title */}
          <ProjectTitle />

          {/* Topic */}
          <Topic />

          {/* Video TTS */}
          <GenVideoTTS />

          {/* Video Caption */}
          <VideoCaption />

          {/* Video Style */}
          <VideoStyle />

          {/* Video Image */}
          <GenVideoImage />

          {/* Video Explanation */}
          <VideoExplanation />

          {/* Generate Video */}
          <Button className="w-full mt-4" onClick={handleGenerateVideo}>
            Generate Video
          </Button>
        </div>
        <div>
          <Preview />
        </div>
      </div>
    </div>
  );
}
