"use client";

import { useState } from "react";
import { useGenTranslatedScript } from "../model/hooks/useGenTranslatedScript";
import { useGenTTs } from "../model/hooks/useGenTTs";
import TTSPlayer from "./_components/TTSPlayer";
import { TitleTextArea } from "@/shared/ui/molecule/TitleTextArea";
import VoiceSelector from "./_components/VoiceSelector";
import TranslateSection from "./_components/TranslateSection";
import useMediaAssetStore from "@/entities/mediaAsset/useMediaAssetStore";
import { LoadingButton } from "@/shared/ui/molecule/LoadingButton";

export default function GenVideoTTS() {
  const [loading, setLoading] = useState<boolean>(false);
  const [voice, setVoice] = useState<string>("alloy");
  const [translateLanguage, setTranslateLanguage] = useState<string>("Korean");

  const language = useMediaAssetStore((state) => state.initialCreateVideoData.language);
  const selectedVideoScript = useMediaAssetStore(
    (state) => state.initialCreateVideoData.generateImage.selectedVideoScript
  );
  const ttsUrls = useMediaAssetStore((state) => state.initialCreateVideoData.ttsUrls);

  const setTts = useMediaAssetStore((state) => state.setTts);

  const { translatedVideoScript, TranslateScript } = useGenTranslatedScript({
    selectedVideoScript,
    translateLanguage,
    setLoading,
  });

  const { GenerateTTS } = useGenTTs({
    language,
    selectedVideoScript,
    voice,
    setTts,
    setLoading,
  });

  const ttsScript =
    (language === "English" ? selectedVideoScript?.content : selectedVideoScript?.translatedContent) || "";

  return (
    <div className="mt-5 border-b border-gray-200 pb-5">
      <h2 className="text-xl">Generate TTS</h2>
      <p className="text-sm text-gray-400">
        If you fine with the video style and script, click the button below to generate TTS.
      </p>

      <TitleTextArea
        title="Check the TTS Script"
        value={ttsScript}
        placeholder="Check the TTS Script..."
        disabled={true}
      />

      <VoiceSelector voice={voice} setVoice={setVoice} />

      <LoadingButton loading={loading} onClick={GenerateTTS} Content="Generate TTS" className="mt-8" />

      <TTSPlayer ttsUrls={ttsUrls} />

      <TranslateSection
        loading={loading}
        translatedVideoScript={translatedVideoScript}
        translateLanguage={translateLanguage}
        setTranslateLanguage={setTranslateLanguage}
        TranslateScript={TranslateScript}
      />
    </div>
  );
}
