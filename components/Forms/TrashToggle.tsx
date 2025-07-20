"use client";

import { Trash2, FolderSync } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ContextMenuItem } from "@/components/ui/context-menu";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { TriggerType } from "@/types";

interface TrashToggleProps {
  fileId: string;
  isTrash?: boolean;
  trigger: TriggerType;
}

export function TrashToggle({ fileId, isTrash, trigger }: TrashToggleProps) {
  const Trigger =
    trigger === "context-menu" ? ContextMenuItem : DropdownMenuItem;
  const router = useRouter();
  const TrashToggleHandler = async () => {
    try {
      const { success, message } = await fetch(
        `/api/files/toggle/trash?id=${fileId}`,
        {
          method: "PATCH",
          next: { revalidate: 0 },
        }
      ).then((res) => res.json());

      if (!success) {
        toast.error(message);
        return;
      }

      toast.success(message);
      router.refresh();
    } catch {
      toast.error("Star Toggle Failed");
    }
  };
  return (
    <Trigger onClick={TrashToggleHandler}>
      {isTrash ? (
        <>
          <FolderSync className="w-5 h-5" /> Restore
        </>
      ) : (
        <>
          <Trash2 className="w-5 h-5" /> Trash
        </>
      )}
    </Trigger>
  );
}
