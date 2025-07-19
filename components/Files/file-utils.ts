import { filesize } from "filesize";
import {
  FileText,
  ImageIcon,
  Video as VideoIcon,
  FolderClosed,
} from "lucide-react";

const getFileType = (type: string) => {
  if (type.startsWith("image")) {
    return "image";
  }

  if (type.startsWith("video")) {
    return "video";
  }

  if (type.startsWith("folder")) {
    return "folder";
  }

  return "document";
};

export const getFileIcon = (fileType: string) => {
  const type = getFileType(fileType);

  const icons = {
    image: ImageIcon,
    video: VideoIcon,
    folder: FolderClosed,
    document: FileText,
  } as const;

  return icons[type];
};

export const getFileColor = (fileType: string) => {
  const type = getFileType(fileType);

  const colors = {
    image: "text-green-600 bg-green-50 dark:bg-green-950/50",
    video: "text-blue-600 bg-blue-50 dark:bg-blue-950/50",
    folder: "text-gray-600 bg-gray-100 dark:bg-gray-950/50 dark:text-white",
    document: "text-red-600 bg-red-50 dark:bg-red-950/50",
  } as const;

  return colors[type];
};

export function getFileSize(size: number) {
  return filesize(size, { standard: "jedec" });
}
