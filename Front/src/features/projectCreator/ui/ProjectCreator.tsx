"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import Button from "@/shared/ui/atoms/Button/ui/Button";
import Input from "@/shared/ui/atoms/Input/ui/Input";
import { ProjectPersistenceService } from "@/shared/lib/projectPersistence";
import { useRouter } from "next/navigation";

interface ProjectCreatorProps {
  onClose: () => void;
}

export default function ProjectCreator({ onClose }: ProjectCreatorProps) {
  const [saveProjectName, setSaveProjectName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleNewProject = async () => {
    const newProjectId = await ProjectPersistenceService.createNewProject(saveProjectName);
    setLoading(true);
    try {
      router.push(`/workflowSelector`);
      onClose();
    } catch (error) {
      console.error("Failed to create new project:", error);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <Input
        value={saveProjectName}
        onChange={(e) => setSaveProjectName(e.target.value)}
        placeholder="Enter project name"
      />

      <div className="flex gap-3 justify-end">
        <Button onClick={handleNewProject} className="flex items-center gap-2" disabled={loading}>
          <Plus size={16} />
          Create New Project
        </Button>
      </div>
    </div>
  );
}
