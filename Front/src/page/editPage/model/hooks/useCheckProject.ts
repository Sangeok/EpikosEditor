"use client";

import { ProjectPersistenceService } from "@/shared/lib/projectPersistence";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const useCheckProject = ({ projectId }: { projectId: string }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [projectExists, setProjectExists] = useState<boolean>(false);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const success = await ProjectPersistenceService.loadProject(projectId);
        if (success) {
          setProjectExists(true);
        } else {
          // if project not exists, redirect to project selection page
          router.replace("/projects");
          return;
        }
      } catch (error) {
        console.error("Failed to load project:", error);
        router.replace("/projects");
        return;
      }
      setIsLoading(false);
    };

    if (projectId) {
      loadProject();
    }
  }, [projectId, router]);

  return { isLoading, projectExists };
};
