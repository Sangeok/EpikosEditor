"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/atoms/Select/select";
import { Info } from "lucide-react";
import { TTS_VOICE_EXPLAIN, TTS_VOICE_LIST } from "../../constants/constants";
import Tooltip from "@/shared/ui/atoms/Tooltip/ui/Tooltip";

interface VoiceSelectorProps {
  voice: string;
  setVoice: (voice: string) => void;
}

export default function VoiceSelector({ voice, setVoice }: VoiceSelectorProps) {
  return (
    <div className="mt-5">
      <div className="flex gap-2 items-center mb-2">
        <h2>Select the Voice</h2>
        <Tooltip
          position="right"
          theme="light"
          className="bg-white text-black max-w-sm"
          content={
            <div className="space-y-2 p-1">
              {TTS_VOICE_EXPLAIN.map((voice) => (
                <p key={voice.name}>
                  <strong>{voice.name}:</strong> {voice.explain}
                </p>
              ))}
            </div>
          }
        >
          <Info size={20} className="cursor-help" />
        </Tooltip>
      </div>

      <Select value={voice} onValueChange={(value) => setVoice(value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a voice" />
        </SelectTrigger>
        <SelectContent className="bg-white text-black">
          <SelectGroup>
            <SelectLabel>Voices</SelectLabel>
            {TTS_VOICE_LIST.map((voice) => (
              <SelectItem key={voice.value} value={voice.value}>
                {voice.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
