"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { uploadSchema, UploadSchemaInputs } from "@/zod/schema/uploadSchema";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { FileInput } from "@/components/ui/file-input";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { upload } from "@imagekit/next";
import { getFolderName } from "@/lib/db/db-utils";
import { useUser } from "@clerk/nextjs";

interface FileUploadProps {
  variant: "dropzone" | "button";
}

export function FileUpload({ variant }: FileUploadProps) {
  const { folderId } = useParams();
  const router = useRouter();
  const { user } = useUser();

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
      // Imagekit Auth
      const { token, expire, signature, publicKey } = await fetch(
        "/api/imagekit-auth",
        {
          method: "GET",
        }
      ).then((res) => res.json());

      // Check Available Space
      const spaceResponse = await fetch("/api/space", {
        method: "GET",
      }).then((res) => res.json());

      if (!spaceResponse.success) {
        toast.error(spaceResponse.message);
        return;
      }

      if (fileData.file.size > spaceResponse.availableSpace) {
        toast.error("Not Enough Space");
        return;
      }

      // Upload File
      const uploadResponse = await upload({
        expire,
        token,
        signature,
        publicKey,
        file: fileData.file,
        fileName: fileData.file.name,
        folder: `${user?.id}/${getFolderName(fileData.file.type)}`,
        useUniqueFileName: true,
      });

      if (uploadResponse.message) {
        toast.error(uploadResponse.message);
        return;
      }

      // Save File Details in Database
      await fetch("/api/save-file-details", {
        method: "POST",
        body: JSON.stringify({
          file: uploadResponse,
          parentId: folderId || null,
          fileType: fileData.file.type,
        }),
      });

      toast.success("File Uploaded Successfully", { id: toastId });
    } catch {
      toast.error("Unkown Error occured while uploading", { id: toastId });
    } finally {
      form.reset();
      router.refresh();
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
