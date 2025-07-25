"use client";

import { useState } from "react";
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
import { ContextMenuItem } from "@/components/ui/context-menu";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { TriggerType } from "@/types";
import { Input, Button } from "@/components/ui";
import { LoaderSpin } from "@/components/server";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { SquarePen } from "lucide-react";

interface RenameFormProps {
  fileId: string;
  currName: string;
  trigger: TriggerType;
}

export function RenameForm({ fileId, currName, trigger }: RenameFormProps) {
  const Trigger =
    trigger === "context-menu" ? ContextMenuItem : DropdownMenuItem;
  const [sheetOpen, setSheetOpen] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm<FolderSchemaInputs>({
    resolver: zodResolver(folderSchema),
    defaultValues: { name: currName },
    mode: "onSubmit",
  });

  const onSubmitHandler: SubmitHandler<FolderSchemaInputs> = async (
    formData
  ) => {
    try {
      const { name } = formData;

      const { success, message } = await fetch(
        `/api/files/rename?id=${fileId}`,
        {
          method: "PATCH",
          body: JSON.stringify({ name: name }),
        }
      ).then((res) => res.json());

      if (!success) {
        form.setError("name", { type: "validate", message });
        return;
      }

      toast.success("Rename Success");
      setSheetOpen(false);
      router.refresh();
      form.reset();
    } catch {
      toast.error("Someting went wrong while renaming");
      setSheetOpen(false);
      form.reset();
    }
  };

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <Trigger onSelect={(e) => e.preventDefault()}>
          <SquarePen />
          Rename
        </Trigger>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Rename</SheetTitle>
          <SheetDescription>
            Click Save Changes when you&apos;re done.
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
                    <Input {...field} placeholder="New Name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              variant={"default"}
              disabled={form.formState.isSubmitting}
              className="cursor-pointer"
            >
              {form.formState.isSubmitting ? <LoaderSpin /> : "Save Changes"}
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
