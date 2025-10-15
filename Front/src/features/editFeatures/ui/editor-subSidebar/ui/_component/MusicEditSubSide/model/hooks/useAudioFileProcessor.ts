import { useMediaStore } from "@/entities/media/useMediaStore";
import { createAudioElement } from "../../../../../../../../../shared/lib/audioElementFactory";
import { UploadedAudio } from "../types";
import { useTrackLaneStore } from "@/features/editFeatures/model/store/useTrackLaneStore";

export function useAudioFileProcessor() {
  const { media, addAudioElement } = useMediaStore();
  const activeLaneByType = useTrackLaneStore((s) => s.activeLaneByType);

  const processAudioFile = (
    file: File,
    onStart: () => void,
    onSuccess: (audio: UploadedAudio) => void,
    onError: () => void
  ) => {
    onStart();
    const reader = new FileReader();

    reader.onload = async (e) => {
      const audioUrl = e.target?.result as string;
      const audioName = file.name;

      const uploadedAudio: UploadedAudio = {
        url: audioUrl,
        name: audioName,
      };

      onSuccess(uploadedAudio);

      try {
        const laneId = activeLaneByType.Audio;
        const audioElement = await createAudioElement(audioUrl, laneId);
        addAudioElement(audioElement);
      } catch (error: unknown) {
        console.error("Error uploading audio element:", error);
        const fallbackAudioElement = {
          id: `audio-${Date.now()}-${Math.random()}`,
          type: "audio" as const,
          startTime: media.projectDuration,
          endTime: media.projectDuration + 30,
          duration: 30,
          laneId: activeLaneByType.Audio,
          url: audioUrl,
          volume: 100,
          speed: 1,
        };
        addAudioElement(fallbackAudioElement);
      }
    };

    reader.onerror = () => {
      alert("Failed to read audio file");
      onError();
    };

    reader.readAsDataURL(file);
  };

  return {
    processAudioFile,
  };
}
