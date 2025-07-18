import { z } from "zod/v4";
import { allowedFilesTypes } from "@/lib/db/db-utils";
import { FilesType } from "@/types";

export const uploadSchema = z.object({
  file: z
    .instanceof(File, { error: "No File Selected" })
    .refine((file) => allowedFilesTypes.includes(file.type as FilesType), {
      message: "Unsupported File Type",
    })
    .refine((file) => file.size <= 100 * 1024 * 1024, {
      message: "File size too large. Please select a smaller file.",
    }),
});

export type UploadSchemaInputs = z.input<typeof uploadSchema>;
