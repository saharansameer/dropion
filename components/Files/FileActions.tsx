import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui";
import {
  MoreVertical,
  Info,
  SquarePen,
  ExternalLink,
  Trash2,
} from "lucide-react";
import { type File } from "@/lib/db/schema";

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
        <DropdownMenuItem>
          <Info className="mr-2" /> Details
        </DropdownMenuItem>

        <DropdownMenuItem>
          <ExternalLink className="mr-2" />
          Share
        </DropdownMenuItem>

        <DropdownMenuItem>
          <SquarePen className="mr-2" />
          Rename
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:text-destructive">
          <Trash2 className="mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
