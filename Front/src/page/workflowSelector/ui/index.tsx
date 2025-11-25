"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Wand2, Film, Smartphone, MonitorPlay } from "lucide-react";
import { useProjectStore } from "@/entities/project/useProjectStore";
import VideoFormSelectDialog from "./_component/VideoFormSelectDialog";

interface WorkflowCard {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  route: string;
  gradient: string;
}

const workflowCards: WorkflowCard[] = [
  {
    id: "create-media-asset",
    title: "Create Media Asset",
    description: "Start with AI-powered media generation and creative tools",
    icon: Wand2,
    route: "create-media-asset",
    gradient: "from-purple-500/20 to-pink-500/20",
  },
  {
    id: "video-editor",
    title: "Video Editor",
    description: "Professional video editing workspace with timeline and effects",
    icon: Film,
    route: "edits",
    gradient: "from-blue-500/20 to-cyan-500/20",
  },
];

export default function WorkflowSelectorPage() {
  const router = useRouter();
  const projectId = useProjectStore((state) => state.project.id);
  const [isSelectionOpen, setIsSelectionOpen] = useState(false);

  const handleCardClick = (route: string) => {
    if (route === "create-media-asset") {
      setIsSelectionOpen(true);
    } else if (route === "edits") {
      router.push(`/edits/${projectId}`);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-8">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">Choose Your Workflow</h1>
          <p className="text-xl text-zinc-400">Select how you want to start creating</p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {workflowCards.map((card, index) => {
            const Icon = card.icon;
            const animationClass = index === 0 ? "animate-fade-up-1" : "animate-fade-up-2";

            return (
              <div
                key={card.id}
                onClick={() => handleCardClick(card.route)}
                className={`
                  group relative overflow-hidden
                  bg-zinc-900/50 backdrop-blur-xl
                  border-2 border-zinc-700/50
                  rounded-2xl p-10
                  cursor-pointer
                  transition-all duration-300 ease-out
                  hover:scale-[1.02] hover:border-blue-500/50
                  hover:shadow-2xl hover:shadow-blue-500/10
                  ${animationClass}
                `}
              >
                {/* Gradient Background on Hover */}
                <div
                  className={`
                    absolute inset-0 opacity-0 group-hover:opacity-100
                    bg-gradient-to-br ${card.gradient}
                    transition-opacity duration-500
                  `}
                />

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center text-center gap-6">
                  {/* Icon Container */}
                  <div
                    className="
                      w-24 h-24 flex items-center justify-center
                      bg-zinc-800/50 rounded-2xl
                      border border-zinc-700/50
                      group-hover:border-blue-500/50
                      group-hover:bg-zinc-800/80
                      transition-all duration-300
                      group-hover:scale-110
                    "
                  >
                    <Icon className="w-12 h-12 text-zinc-400 group-hover:text-blue-400 transition-colors duration-300" />
                  </div>

                  {/* Text Content */}
                  <div className="space-y-3">
                    <h2 className="text-3xl font-bold text-white group-hover:text-blue-100 transition-colors duration-300">
                      {card.title}
                    </h2>
                    <p className="text-base text-zinc-400 group-hover:text-zinc-300 transition-colors duration-300 leading-relaxed">
                      {card.description}
                    </p>
                  </div>

                  {/* CTA Indicator */}
                  <div className="mt-4 flex items-center gap-2 text-zinc-500 group-hover:text-blue-400 transition-colors duration-300">
                    <span className="text-sm font-medium">Get Started</span>
                    <svg
                      className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                {/* Shine Effect on Hover */}
                <div
                  className="
                    absolute inset-0 opacity-0 group-hover:opacity-100
                    bg-gradient-to-r from-transparent via-white/5 to-transparent
                    transform -translate-x-full group-hover:translate-x-full
                    transition-all duration-1000
                  "
                />
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="text-center mt-16 text-zinc-500 text-sm">You can always switch between workflows later</div>
      </div>

      <VideoFormSelectDialog open={isSelectionOpen} onClose={() => setIsSelectionOpen(false)} projectId={projectId} />
    </div>
  );
}
