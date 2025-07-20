"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BrushCleaning } from "lucide-react";

export function EmptyTrash({ isTrashEmpty }: { isTrashEmpty: boolean }) {
  const router = useRouter();
  const emptyTrashHandler = async () => {
    const toastId = toast.loading("Deleting Files...");
    try {
      const { success, message } = await fetch("/api/files/empty-trash", {
        method: "DELETE",
        next: { revalidate: 0 },
      }).then((res) => res.json());

      if (!success) {
        toast.error(message, { id: toastId });
        return;
      }

      toast.success(message, { id: toastId });
      router.refresh();
    } catch {
      toast.error("Star Toggle Failed", { id: toastId });
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button disabled={isTrashEmpty} variant={"outline"} size={"lg"} className="cursor-pointer my-2">
          <BrushCleaning />
          Empty Trash
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Empty Trash</AlertDialogTitle>
          <AlertDialogDescription>
            This will cleanup trash and permanently delete all trash files. This
            action can not be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={emptyTrashHandler}
            className="destructive-button cursor-pointer"
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
