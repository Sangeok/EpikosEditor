import useMediaAssetStore from "@/entities/mediaAsset/useMediaAssetStore";
import Button from "@/shared/ui/atoms/Button/ui/Button";
import Dialog from "@/shared/ui/atoms/Dialog/ui/Dialog";
import Input from "@/shared/ui/atoms/Input/ui/Input";
import { useState } from "react";
import { LanguageSelector } from "../../B_Topic/ui/_components/LanguageSelector";
import { TopicTabs } from "../../B_Topic/ui/_components/TopicTabs/ui";
import { ScriptDisplay } from "../../B_Topic/ui/_components/ScriptDisplay";
import VoiceSelector from "../../C_VideoTTS/ui/_components/VoiceSelector";
import VideoStyleOptionItem from "../../E_VIdeoStyle/ui/_component/VideoStyleOptionItem";
import axios from "axios";

export default function ProjectTitle() {
  const title = useMediaAssetStore((state) => state.initialCreateVideoData.title);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const [voice, setVoice] = useState<string>("alloy");

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    useMediaAssetStore.getState().setCreateVideoDataByField("title", event.target.value);
  };

  const videoScript = useMediaAssetStore((state) => state.initialCreateVideoData.videoScript);

  const hasVideoScript = videoScript?.length > 0;

  const videoStyle = useMediaAssetStore((state) => state.initialCreateVideoData.generateImage.generateImageStyle);
  const setVideoStyle = useMediaAssetStore((state) => state.setGenerateImageDataByFied);

  const handleAutoGenerate = async () => {
    setIsGenerating(true);
    try {
      const data = useMediaAssetStore.getState().initialCreateVideoData;
      const payload = {
        projectId: "123",
        topic: data.topic,
        topicDetail: data.topicDetail,
        language: data.language,
        videoStyle: data.generateImage.generateImageStyle,
        voice,
      };

      console.log(payload);
      const res = await axios.post("/api/auto-generate", payload);
      // setJobId(res.data.jobId);
      setIsGenerating(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="border-b border-gray-200 pb-5 space-y-4">
      <div className="flex justify-between">
        <h2 className="text-xl">Project Title</h2>
        <Button size="sm" onClick={() => setOpenDialog(true)}>
          Auto Generate
        </Button>
      </div>
      <Input placeholder="Enter Proejct Title..." value={title} onChange={(e) => handleTitleChange(e)} />
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} title="Auto Generate" size="3xl">
        <div className="space-y-4">
          <p className="text-gray-400 border-b border-zinc-700/70 p-4">
            Select minimal options to generate media asset
          </p>

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
            <VoiceSelector voice={voice} setVoice={setVoice} />
          </div>

          {/* Video Styles */}
          <div className="border border-zinc-700/70 bg-zinc-900/40 p-4 rounded-lg">
            <p className="text-gray-400">Video Styles</p>
            <VideoStyleOptionItem videoStyle={videoStyle} setVideoStyle={setVideoStyle} />
          </div>

          {/* Generate Button */}
          <div className="flex">
            <Button size="md" className="w-full" onClick={handleAutoGenerate}>
              Generate
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
