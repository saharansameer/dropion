"use client";

import { type ReactNode, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { folderSchema, FolderSchemaInputs } from "@/zod/schema/folderSchema";
import {
  Form,
  FormControl,
  FormLabel,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input, Button } from "@/components/ui";
import { LoaderSpin } from "@/components/server";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface FolderFormProps {
  mode: "post" | "patch";
  folderName?: string;
  trigger: ReactNode;
}

export function FolderForm({ mode, folderName, trigger }: FolderFormProps) {
  const [sheetOpen, setSheetOpen] = useState<boolean>(false);
  const { folderId } = useParams();
  const isPostMode = mode === "post";
  const router = useRouter();

  const form = useForm<FolderSchemaInputs>({
    resolver: zodResolver(folderSchema),
    defaultValues: { name: isPostMode ? "" : folderName },
    mode: "onSubmit",
  });

  const onSubmitHandler: SubmitHandler<FolderSchemaInputs> = async (
    formData
  ) => {
    try {
      const { name } = formData;

      const { success, message } = await fetch("/api/folders/create", {
        method: isPostMode ? "POST" : "PATCH",
        body: JSON.stringify({ folderName: name, parentId: folderId }),
      }).then((res) => res.json());

      if (!success) {
        form.setError("name", { type: "validate", message });
        return;
      }

      toast.success(isPostMode ? "Folder Created" : "Folder Updated");
      setSheetOpen(false);
      router.refresh();
      form.reset();
    } catch {
      toast.error("Someting went wrong with Folder");
      setSheetOpen(false);
      form.reset();
    }
  };

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            {isPostMode ? "Create New Folder" : "Rename Folder"}
          </SheetTitle>
          <SheetDescription>
            Click {isPostMode ? "Create" : "Save Changes"} when you&apos;re
            done.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmitHandler)}
            className="grid flex-1 auto-rows-min gap-6 px-2"
          >
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="New Folder" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              variant={"default"}
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <LoaderSpin />
              ) : isPostMode ? (
                "Create"
              ) : (
                "Save"
              )}
            </Button>
          </form>
        </Form>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
