"use client";

import Dialog from "@/shared/ui/atoms/Dialog/ui/Dialog";
import { MonitorPlay, Smartphone } from "lucide-react";
import { useRouter } from "next/navigation";

interface VideoFormSelectDialogProps {
  open: boolean;
  onClose: () => void;
  projectId: string;
}

export default function VideoFormSelectDialog({ open, onClose, projectId }: VideoFormSelectDialogProps) {
  const router = useRouter();

  const handleFormTypeSelection = (formType: "shortForm" | "longForm") => {
    router.push(`/${formType}/create-media-asset/${projectId}`);
  };

  return (
    <Dialog open={open} onClose={onClose} title="Select Format" size="2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 pb-2">
        {/* Short Form Selection */}
        <div
          onClick={() => handleFormTypeSelection("shortForm")}
          className="
        group relative overflow-hidden
        bg-zinc-800/30 border border-zinc-700/50
        hover:border-pink-500/50 hover:bg-zinc-800/60
        rounded-xl p-8 cursor-pointer
        transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/10 hover:-translate-y-1
      "
        >
          <div
            className="
            absolute inset-0 opacity-0 group-hover:opacity-100
            bg-gradient-to-br from-pink-500/10 to-rose-500/10
            transition-opacity duration-500
          "
          />
          <div className="relative z-10 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-zinc-800 border border-zinc-700 group-hover:border-pink-500/50 flex items-center justify-center mb-2 transition-colors duration-300 shadow-lg">
              <Smartphone className="w-8 h-8 text-zinc-400 group-hover:text-pink-400 transition-colors" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-pink-200 transition-colors">
                Short Form
              </h3>
              <p className="text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors">
                9:16 Vertical Video
                <br />
                Best for Shorts, Reels, TikTok
              </p>
            </div>
          </div>
        </div>

        {/* Long Form Selection */}
        <div
          onClick={() => handleFormTypeSelection("longForm")}
          className="
        group relative overflow-hidden
        bg-zinc-800/30 border border-zinc-700/50
        hover:border-purple-500/50 hover:bg-zinc-800/60
        rounded-xl p-8 cursor-pointer
        transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-1
      "
        >
          <div
            className="
            absolute inset-0 opacity-0 group-hover:opacity-100
            bg-gradient-to-br from-purple-500/10 to-indigo-500/10
            transition-opacity duration-500
          "
          />
          <div className="relative z-10 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-zinc-800 border border-zinc-700 group-hover:border-purple-500/50 flex items-center justify-center mb-2 transition-colors duration-300 shadow-lg">
              <MonitorPlay className="w-8 h-8 text-zinc-400 group-hover:text-purple-400 transition-colors" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-200 transition-colors">
                Long Form
              </h3>
              <p className="text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors">
                16:9 Horizontal Video
                <br />
                Best for YouTube & Cinema
              </p>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
