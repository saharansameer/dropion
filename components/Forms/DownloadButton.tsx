"use client";

import { CloudDownload } from "lucide-react";
import { ContextMenuItem } from "@/components/ui/context-menu";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { TriggerType } from "@/types";
import { toast } from "sonner";

interface DownloadButtonProps {
  fileUrl: string;
  fileName: string;
  trigger: TriggerType;
}

export function DownloadButton({
  fileUrl,
  fileName,
  trigger,
}: DownloadButtonProps) {
  const Trigger =
    trigger === "context-menu" ? ContextMenuItem : DropdownMenuItem;

  const handleDownload = async () => {
    const toastId = toast.loading("Preparing File for download...");
    try {
      const res = await fetch(fileUrl);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast.info("File Ready for Download", { id: toastId });
    } catch {
      toast.error("Unable to Download", { id: toastId });
    }
  };

  return (
    <Trigger onClick={handleDownload}>
      <CloudDownload className="w-5 h-5" /> Download
    </Trigger>
  );
}
