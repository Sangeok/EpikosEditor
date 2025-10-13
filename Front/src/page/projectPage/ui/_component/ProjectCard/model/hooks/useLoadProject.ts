"use client";

import { ProjectPersistenceService } from "@/shared/lib/projectPersistence";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const useLoadProject = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleLoadProject = async (projectId: string) => {
    setLoading(true);
    try {
      const success = await ProjectPersistenceService.loadProject(projectId);
      if (success) {
        router.push(`/workflowSelector`);
      } else {
        alert("Failed to load project. The project may be corrupted or no longer exist.");
      }
    } catch (error) {
      console.error("Failed to load project:", error);
      alert("Failed to load project. Please try again.");
    }
    setLoading(false);
  };

  return { loading, handleLoadProject };
};
