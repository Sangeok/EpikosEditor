"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
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

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set) => ({
      project: initialProject,
      setProject: (project) => set({ project }),
    }),
    {
      name: "project-store",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<ProjectStore>;
        if (persisted?.project) {
          const p = persisted.project as any;
          if (p?.createdAt) p.createdAt = new Date(p.createdAt);
          if (p?.updatedAt) p.updatedAt = new Date(p.updatedAt);
        }
        return { ...currentState, ...persisted };
      },
      partialize: (state) => ({ project: state.project }),
    }
  )
);
