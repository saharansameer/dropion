import { asc, desc, eq } from "drizzle-orm";
import { FilesTable } from "./schema";
import { SortOption, FilterType } from "@/types";

export function getFilterCondition(table: FilesTable, type?: FilterType) {
  if (!type || type === undefined) return undefined;

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
