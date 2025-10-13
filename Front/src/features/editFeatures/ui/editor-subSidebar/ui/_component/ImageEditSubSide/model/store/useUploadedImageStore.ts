import { create } from "zustand";

interface UploadedImageStore {
  images: string[];
  addImage: (url: string) => void;
  removeImage: (index: number) => void;
  clear: () => void;
}

export const useUploadedImageStore = create<UploadedImageStore>((set) => ({
  images: [],
  addImage: (url) => set((s) => ({ images: [...s.images, url] })),
  removeImage: (index) => set((s) => ({ images: s.images.filter((_, i) => i !== index) })),
  clear: () => set({ images: [] }),
}));
