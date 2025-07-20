"use client";

import { ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { ContextMenuItem } from "@/components/ui/context-menu";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { TriggerType } from "@/types";

interface ShareButtonProps {
  url: string;
  trigger: TriggerType;
}

export function ShareButton({ url, trigger }: ShareButtonProps) {
  const Trigger =
    trigger === "context-menu" ? ContextMenuItem : DropdownMenuItem;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.info("Link Copied");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  return (
    <Trigger onClick={copyToClipboard}>
      <ExternalLink className="w-5 h-5" />
      Share
    </Trigger>
  );
}
