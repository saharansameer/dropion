"use client";

import type { ReactNode } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Info, SquarePen, ExternalLink, Trash2 } from "lucide-react";
import { type File } from "@/lib/db/schema";

interface FileContextMenuProps {
  file: File;
  children: ReactNode;
}

const iconStyle = { width: "18px", height: "18px" };

export function FileContextMenu({ file, children }: FileContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>
          <Info className="mr-2" /> Details
        </ContextMenuItem>
        <ContextMenuItem>
          <ExternalLink className="mr-2" />
          Share
        </ContextMenuItem>
        <ContextMenuItem>
          <SquarePen className="mr-2" />
          Rename
        </ContextMenuItem>

        <ContextMenuItem>
          <Trash2 className="mr-2" />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
