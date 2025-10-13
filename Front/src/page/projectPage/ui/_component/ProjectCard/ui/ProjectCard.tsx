"use client";

import { SavedProject } from "@/shared/lib/indexedDB";
import { Calendar, Video } from "lucide-react";
import { useLoadProject } from "@/page/projectPage/ui/_component/ProjectCard/model/hooks/useLoadProject";

interface ProjectCardProps {
  project: SavedProject;
  selectMode?: boolean;
  isSelected?: boolean;
  onSelect?: (projectId: string, selected: boolean) => void;
}

export default function ProjectCard({ project, selectMode = false, isSelected = false, onSelect }: ProjectCardProps) {
  const { handleLoadProject } = useLoadProject();

  const handleClick = () => {
    if (selectMode) {
      onSelect?.(project.id, !isSelected);
    } else {
      handleLoadProject(project.id);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`hover:bg-zinc-800 cursor-pointer rounded-lg p-4 h-full transition-all ${
        selectMode && isSelected 
          ? 'border-2 border-blue-500 bg-blue-500/10' 
          : 'border-2 border-transparent'
      }`}
    >
      <div className="bg-zinc-900/50 flex items-center justify-center">
        <Video className="h-40 w-12 text-muted-foreground" />
      </div>
      <div className="flex flex-col gap-2 pt-4">
        <h1 className="text-base font-semibold">{project.name}</h1>
        <div className="flex items-center gap-2">
          <Calendar size={14} />
          <h1 className="text-sm text-zinc-400">
            Created {project.createdAt.toLocaleDateString()}
          </h1>
        </div>
      </div>
    </div>
  );
}
