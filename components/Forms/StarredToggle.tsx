"use client";

import { Star, StarOff } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ContextMenuItem } from "@/components/ui/context-menu";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { TriggerType } from "@/types";

interface StarredToggleProps {
  fileId: string;
  isStarred?: boolean;
  trigger: TriggerType;
}

export function StarredToggle({
  fileId,
  isStarred,
  trigger,
}: StarredToggleProps) {
  const Trigger =
    trigger === "context-menu" ? ContextMenuItem : DropdownMenuItem;
  const router = useRouter();
  const starredToggleHandler = async () => {
    try {
      const { success, message } = await fetch(
        `/api/files/toggle/star?id=${fileId}`,
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
    <Trigger onClick={starredToggleHandler}>
      {isStarred ? (
        <>
          <StarOff className="w-5 h-5" /> Remove Star
        </>
      ) : (
        <>
          <Star className="w-5 h-5" /> Star
        </>
      )}
    </Trigger>
  );
}
