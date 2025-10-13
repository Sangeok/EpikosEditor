"use client";

import IconButton from "@/shared/ui/atoms/Button/ui/IconButton";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ProjectCard from "./_component/ProjectCard/ui/ProjectCard";
import Dialog from "@/shared/ui/atoms/Dialog/ui/Dialog";
import ProjectCreator from "@/features/projectCreator/ui/ProjectCreator";
import { useLoadAllProject } from "@/page/projectPage/model/hooks/useLoadAllProject";
import NotSelectModeButtons from "./_component/NotSelectModeButtons/ui";
import SelectModeButtons from "./_component/SelectModeButtons/ui";

export default function Project() {
  const [showProjectManager, setShowProjectManager] = useState(false);
  const [showSelectMode, setShowSelectMode] = useState(false);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);

  const { projects, loading, refetch } = useLoadAllProject();
  const router = useRouter();

  const handleProjectSelect = (projectId: string, selected: boolean) => {
    if (selected) {
      setSelectedProjects((prev) => [...prev, projectId]);
    } else {
      setSelectedProjects((prev) => prev.filter((id) => id !== projectId));
    }
  };

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="flex flex-col text-white w-full h-full p-4">
      <div className="flex w-full mt-4 justify-between">
        <div className="flex gap-4 ">
          <IconButton onClick={() => router.back()}>
            <ArrowLeft />
          </IconButton>
          <div className="flex h-full items-end gap-4 pl-4">
            <h1 className="text-3xl font-bold">My Projects</h1>
            <h1 className="text-base text-zinc-400">{projects.length} projects</h1>
          </div>
        </div>
        {!showSelectMode && (
          <NotSelectModeButtons setShowSelectMode={setShowSelectMode} setShowProjectManager={setShowProjectManager} />
        )}
        {showSelectMode && (
          <SelectModeButtons
            selectedProjects={selectedProjects}
            setSelectedProjects={setSelectedProjects}
            setShowSelectMode={setShowSelectMode}
            refetch={refetch}
            projects={projects}
          />
        )}
      </div>
      <div className="mt-4 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            selectMode={showSelectMode}
            isSelected={selectedProjects.includes(project.id)}
            onSelect={handleProjectSelect}
          />
        ))}
      </div>

      <Dialog open={showProjectManager} onClose={() => setShowProjectManager(false)} title="New Project">
        <ProjectCreator onClose={() => setShowProjectManager(false)} />
      </Dialog>
    </div>
  );
}
