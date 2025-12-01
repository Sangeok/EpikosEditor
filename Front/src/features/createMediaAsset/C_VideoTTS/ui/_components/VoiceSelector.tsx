"use client";

import { useMemo, useState } from "react";
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
import {
  TTS_VOICE_KO_EXPLAIN,
  TTS_VOICE_EN_EXPLAIN,
  TTS_VOICE_LIST_KO,
  TTS_VOICE_LIST_EN,
} from "../../constants/constants";
import {
  FloatingPortal,
  FloatingFocusManager,
  useFloating,
  offset,
  flip,
  shift,
  size,
  autoUpdate,
  useInteractions,
  useClick,
  useDismiss,
  useRole,
} from "@floating-ui/react";
import { voiceType } from "../../model/type";

interface VoiceSelectorProps {
  voice: voiceType;
  setVoice: (voice: voiceType) => void;
  language: "English" | "Korean";
}

export default function VoiceSelector({ voice, setVoice, language = "English" }: VoiceSelectorProps) {
  const [infoOpen, setInfoOpen] = useState(false);
  const voiceExplains = useMemo(
    () => (language === "Korean" ? TTS_VOICE_KO_EXPLAIN : TTS_VOICE_EN_EXPLAIN),
    [language]
  );

  const { refs, floatingStyles, context } = useFloating({
    open: infoOpen,
    onOpenChange: setInfoOpen,
    placement: "right-start",
    middleware: [
      offset(12),
      flip({ fallbackAxisSideDirection: "end" }),
      shift({ padding: 12 }),
      size({
        apply({ availableHeight, elements }) {
          Object.assign(elements.floating.style, {
            maxHeight: `${Math.min(availableHeight, 440)}px`,
          });
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "dialog" });
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-1.5 items-center mt-2">
        <h2>Select the Voice</h2>
        <button
          type="button"
          className="cursor-help rounded-full border border-transparent p-1 text-slate-500 transition hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          ref={refs.setReference}
          {...getReferenceProps()}
        >
          <Info size={20} aria-hidden="true" />
        </button>
        {infoOpen && (
          <FloatingPortal>
            <FloatingFocusManager context={context} modal={false}>
              <div
                ref={refs.setFloating}
                style={floatingStyles}
                {...getFloatingProps()}
                className="z-50 flex w-[min(480px,90vw)] max-h-[70vh] flex-col gap-3 overflow-hidden rounded-lg border border-slate-200 bg-white/95 p-4 text-sm text-black shadow-xl backdrop-blur supports-[backdrop-filter]:bg-white/80 md:max-h-[440px] dark:border-slate-800 dark:bg-slate-900/95 dark:text-white"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <p className="font-semibold text-base leading-none">Voice details ({language})</p>
                  <button
                    type="button"
                    className="text-xs font-medium text-primary hover:underline"
                    onClick={() => setInfoOpen(false)}
                  >
                    Close
                  </button>
                </div>
                <div className="flex-1 space-y-2 overflow-y-auto pr-2">
                  {voiceExplains.map((item) => (
                    <p key={item.name} className="leading-relaxed">
                      <strong>{item.name}:</strong> {item.explain}
                    </p>
                  ))}
                </div>
              </div>
            </FloatingFocusManager>
          </FloatingPortal>
        )}
      </div>

      <Select
        value={voice.model}
        onValueChange={(selectedModel) => {
          const voiceList = language === "Korean" ? TTS_VOICE_LIST_KO : TTS_VOICE_LIST_EN;
          const selectedVoice = voiceList.find((item) => item.model === selectedModel);
          setVoice({ model: selectedModel, name: selectedVoice?.name ?? voice.name });
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a voice" />
        </SelectTrigger>
        <SelectContent className="bg-white text-black">
          <SelectGroup>
            <SelectLabel>Voices</SelectLabel>
            {language === "Korean" &&
              TTS_VOICE_LIST_KO.map((voiceOption) => (
                <SelectItem key={voiceOption.model} value={voiceOption.model}>
                  {voiceOption.name}
                </SelectItem>
              ))}
            {language === "English" &&
              TTS_VOICE_LIST_EN.map((voiceOption) => (
                <SelectItem key={voiceOption.model} value={voiceOption.model}>
                  {voiceOption.name}
                </SelectItem>
              ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
