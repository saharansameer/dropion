"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { uploadSchema, UploadSchemaInputs } from "@/zod/schema/uploadSchema";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { FileInput } from "@/components/ui/file-input";
import { toast } from "sonner";
import { useParams } from "next/navigation";

interface FileUploadProps {
  variant: "dropzone" | "button";
}

export function FileUpload({ variant }: FileUploadProps) {
  const { folderId } = useParams();

  // File Upload Form
  const form = useForm<UploadSchemaInputs>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      file: undefined,
    },
    mode: "onChange",
    reValidateMode: "onSubmit",
  });

  // File Upload Handler
  const handleFileUpload: SubmitHandler<UploadSchemaInputs> = async (
    fileData
  ) => {
    const toastId = toast.loading("Uploading File...");
    try {
      const formData = new FormData();
      formData.append("file", fileData.file);
      if (folderId) {
        formData.append("parentId", folderId as string);
      }

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const { success, message } = await response.json();

      if (!success) {
        toast.error(message, { id: toastId });
        form.setError("file", { type: "validate", message });
        return;
      }

      toast.success("File Uploaded Successfully", { id: toastId });
    } catch {
      toast.error("Unkown Error occured while uploading", { id: toastId });
      form.setError("file", {
        type: "validate",
        message: "Unkown Error occured while uploading",
      });
    } finally {
      form.reset();
    }
  };

  return (
    <Form {...form}>
      <form encType="multipart/form-data">
        <FormField
          name="file"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <FileInput
                  disabled={form.formState.isSubmitting}
                  id="file-input"
                  variant={variant}
                  value={field.value as File}
                  onChange={async (file: File | null) => {
                    field.onChange(file);

                    const isValid = await form.trigger("file");
                    if (isValid && file) {
                      handleFileUpload({ file });
                    } else {
                      toast.error(
                        form.formState.errors.file
                          ? form.formState.errors.file.message
                          : "Failed to Upload"
                      );
                    }
                  }}
                  errorMessage={
                    form.formState.errors.file &&
                    form.formState.errors.file.message
                  }
                />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
