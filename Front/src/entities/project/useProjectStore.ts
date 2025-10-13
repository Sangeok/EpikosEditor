import { create } from "zustand";
import { ProjectType } from "./types";

interface ProjectStore {
  project: ProjectType;
  setProject: (project: ProjectType) => void;
}

export const initialProject: ProjectType = {
  id: "",
  name: "Loading...",
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const useProjectStore = create<ProjectStore>((set) => ({
  project: initialProject,
  setProject: (project) => set({ project }),
}));
