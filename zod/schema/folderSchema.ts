import { z } from "zod/v4";

export const folderSchema = z.object({
  name: z
    .string()
    .min(1, { error: "Folder Name is required" })
    .max(100, { error: "Folder Name must not exceed 100 characters" }),
});

export type FolderSchemaInputs = z.input<typeof folderSchema>;
