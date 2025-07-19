import { BaseResponse } from "./server";
import { NewFile, File } from "@/lib/db/schema";
import { allowedMimeTypes } from "@/lib/db/db-utils";

export interface FilesResponse extends BaseResponse {
  data: NewFile | File[];
}

export type FilesCache = File[];

export type SortOption = "date-latest" | "date-oldest" | "name-az" | "name-za";

export type FilesType = "video" | "image" | "document" | "folder";

export type MimeType = (typeof allowedMimeTypes)[number];
