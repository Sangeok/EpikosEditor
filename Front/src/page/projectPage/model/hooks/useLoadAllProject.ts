import { useEffect, useState } from "react";
import { SavedProject } from "@/shared/lib/indexedDB";
import { ProjectPersistenceService } from "@/shared/lib/projectPersistence";

export const useLoadAllProject = () => {
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const loadProjects = async () => {
    setLoading(true);
    const allProjects = await ProjectPersistenceService.getAllProjects();
    setProjects(allProjects);
    setLoading(false);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  return { projects, loading, refetch: loadProjects };
};
