"use client";

import ProjectTitle from "@/features/createMediaAsset/A_ProjectTitle/ui/ProjectTitle";
import Topic from "@/features/createMediaAsset/B_Topic/ui/Topic";
import GenVideoTTS from "@/features/createMediaAsset/C_VideoTTS/ui/GenVideoTTS";
import VideoCaption from "@/features/createMediaAsset/D_Caption/ui/VIdeoCaption";
import VideoStyle from "@/features/createMediaAsset/E_VIdeoStyle/ui/VideoStyle";
import GenVideoImage from "@/features/createMediaAsset/F_VideoImage/ui/GenVideoImage";
import VideoExplanation from "@/features/createMediaAsset/G_Explanation/ui/VideoExplanation";
import Button from "@/shared/ui/atoms/Button/ui/Button";
import { useVideoGenerator } from "../model/hooks/useVideoGenerator";

/**
 * 비디오 설정 양식 컴포넌트
 *
 * 책임:
 * - 비디오 생성에 필요한 모든 설정 단계 표시
 * - 생성 버튼 제공
 */
export function MediaAssetConfiguration() {
  const { isGenerating, generateVideo } = useVideoGenerator();

  return (
    <div className="col-span-2 p-6 border rounded-xl h-[72vh] overflow-y-auto">
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
      <Button className="w-full mt-4" onClick={generateVideo} disabled={isGenerating}>
        Generate Video
      </Button>
    </div>
  );
}
