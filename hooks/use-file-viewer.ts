import { create, StateCreator } from "zustand";
import { type File } from "@/lib/db/schema";

type FileViewerStore = {
  isOpen: boolean;
  file: File | null;
  onOpen: (file: File) => void;
  onClose: () => void;
};

export const fileViewerStore: StateCreator<FileViewerStore> = (set) => ({
  isOpen: false,
  file: null,
  onOpen: (file) => set({ isOpen: true, file }),
  onClose: () => set({ isOpen: false, file: null }),
});

export const useFileViewer = create<FileViewerStore>(fileViewerStore);
