import { asc, desc, eq } from "drizzle-orm";
import { FilesTable } from "@/lib/db/schema";
import { FilesType, SortOption } from "@/types";

export function getFilterCondition(table: FilesTable, type?: FilesType) {
  if (!type || type.trim() === "") return undefined;

  return eq(table.type, type);
}

export function getSortOrder(table: FilesTable, option: SortOption) {
  switch (option) {
    case "date-latest":
      return desc(table.createdAt);
    case "date-oldest":
      return asc(table.createdAt);
    case "name-az":
      return asc(table.name);
    case "name-za":
      return desc(table.name);
    default:
      return desc(table.createdAt);
  }
}

export const allowedMimeTypes = [
  "video/mp4",
  "video/quicktime",
  "video/webm",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "application/pdf",
  "text/plain",
] as const;

export function getFolderName(fileType: string) {
  if (fileType.startsWith("video")) {
    return "videos";
  }

  if (fileType.startsWith("image")) {
    return "images";
  }

  return "documents";
}

export const getUploadFileType = (type: string) => {
  if (type.startsWith("image")) {
    return "image";
  }

  if (type.startsWith("video")) {
    return "video";
  }

  return "document";
};
