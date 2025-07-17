import { BaseResponse } from "./server";
import { NewFile, File } from "@/lib/db/schema";

export interface FilesResponse extends BaseResponse {
  data: NewFile | File[];
}

export type FilesCache = File[];

export type FilterType = "video" | "image" | "document" | "folder";

export type SortOption = "date-latest" | "date-oldest" | "name-az" | "name-za";
