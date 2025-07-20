"use client";

import { type ReactNode } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

import { type File } from "@/lib/db/schema";
import {
  StarredToggle,
  TrashToggle,
  RenameForm,
  ShareButton,
  DownloadButton,
} from "@/components/client";

interface FileContextMenuProps {
  file: File;
  children: ReactNode;
}

export function FileContextMenu({ file, children }: FileContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-52">
        {!file.isTrash && (
          <StarredToggle
            fileId={file.id}
            isStarred={file.isStarred}
            trigger="context-menu"
          />
        )}

        {!file.isFolder && (
          <>
            <ShareButton url={file.fileUrl} trigger="context-menu" />
            <DownloadButton
              fileUrl={file.fileUrl}
              fileName={file.name}
              trigger="context-menu"
            />
          </>
        )}

        <RenameForm
          fileId={file.id}
          currName={file.name}
          trigger="context-menu"
        />

        <TrashToggle
          fileId={file.id}
          isTrash={file.isTrash}
          trigger="context-menu"
        />
      </ContextMenuContent>
    </ContextMenu>
  );
}
