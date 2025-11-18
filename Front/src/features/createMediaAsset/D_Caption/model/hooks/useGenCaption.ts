"use client";

import { CreateVideoField } from "@/entities/mediaAsset/types";
import useCaptionStore from "@/entities/mediaAsset/useCaptionStore";
import { useState } from "react";
import { convertToSRT } from "../../lib/convertToSRT";
import { ERROR_MESSAGES } from "../../constants";
import { fetchAudioFile, generateCaptionsAPI, translateCaption, processSRT } from "../utils";

export const useGenCaption = ({
  ttsUrl,
  language,
  setCaptions,
}: {
  ttsUrl: string;
  language: "English" | "Korean";
  setCaptions: (fieldName: CreateVideoField, captions: string) => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [srtContent, setSrtContent] = useState("");

  const setScenes = useCaptionStore((state) => state.setScenes);

  const generateCaptions = async () => {
    // 유효성 검사
    if (!ttsUrl) {
      alert(ERROR_MESSAGES.NO_TTS);
      return;
    }

    setLoading(true);

    try {
      // 1. 오디오 파일 가져오기
      const audioFile = await fetchAudioFile(ttsUrl);

      // 2. 자막 생성
      const result = await generateCaptionsAPI(audioFile, language);
      const generatedSRT = convertToSRT(result, language);

      // 3. 즉시 상태 업데이트 (빠른 UI 피드백)
      setSrtContent(generatedSRT);

      // 4. 언어별 처리
      let contentToProcess = generatedSRT;

      if (language === "Korean") {
        // 한국어면 번역 필요
        contentToProcess = await translateCaption(generatedSRT, "English");
      }

      // 5. SRT 파싱 및 씬 생성
      const { scenes } = processSRT(contentToProcess);

      // 6. 나머지 상태 업데이트
      setScenes(scenes);
      setCaptions("captions", generatedSRT);
    } catch (error) {
      console.error("Error generating captions:", error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, srtContent, generateCaptions };
};
