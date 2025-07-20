import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui";
import { MoreVertical } from "lucide-react";
import { type File } from "@/lib/db/schema";
import {
  StarredToggle,
  TrashToggle,
  RenameForm,
  ShareButton,
} from "@/components/client";

export function FileActions({ file }: { file: File }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 data-[state=open]:bg-muted"
          aria-label={`Actions for ${file.name}`}
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <StarredToggle
          fileId={file.id}
          isStarred={file.isStarred}
          trigger="dropdown"
        />

        {!file.isFolder && (
          <ShareButton url={file.fileUrl} trigger="dropdown" />
        )}

        <RenameForm fileId={file.id} currName={file.name} trigger={"dropdown"} />

        <TrashToggle
          fileId={file.id}
          isTrash={file.isTrash}
          trigger="dropdown"
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
