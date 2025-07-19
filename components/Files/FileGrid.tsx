"use client";

import { useState } from "react";
import { FileContextMenu } from "./FileContextMenu";
import { FileActions } from "./FileActions";
import { getFileColor, getFileIcon, getFileSize } from "./file-utils";
import { FilterOptions } from "./FiterOptions";
import { SortOptions } from "./SortOptions";
import { cn } from "@/lib/utils";
import { Button, Separator } from "@/components/ui";
import { Star, Grid3X3, List } from "lucide-react";
import Image from "next/image";
import { type File } from "@/lib/db/schema";
import { useRouter } from "next/navigation";
import { useFileViewer } from "@/hooks/use-file-viewer";
import { FileUpload } from "./FileUpload";

function FilePreview({ file }: { file: File }) {
  const Icon = getFileIcon(file.type);

  if (file.thumbnailUrl) {
    return (
      <Image
        src={file.thumbnailUrl}
        alt={file.name}
        fill
        className="object-cover"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, (max-width: 1536px) 25vw, 16vw"
      />
    );
  }

  return (
    <div
      className={cn(
        "w-full h-full flex items-center justify-center",
        getFileColor(file.type)
      )}
    >
      <Icon className="h-12 w-12" />
    </div>
  );
}

interface FileGridProps {
  files?: File[];
  isRoot?: boolean;
}

export function FileGrid({ files, isRoot = false }: FileGridProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const router = useRouter();
  const { onOpen } = useFileViewer();

  const handleFileClick = (file: File) => {
    if (file.type === "folder") {
      router.push(`/my-files/${file.id}`);
      router.refresh();
    } else {
      onOpen(file);
    }
  };

  if (!files || files.length === 0) {
    return (
      <div className="w-full mx-auto flex justify-center py-10">
        <div className="w-full max-w-4xl">
          <h2 className="font-semibold mb-4 text-center">Folder is empty, Add files</h2>
          <FileUpload variant="dropzone" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="w-full flex items-center justify-between">
        {/* Toggle View Mode */}
        <div className="flex rounded-lg border p-1">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="h-7 px-2"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="h-7 px-2"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>

        {/* Filter & Sort */}
        <div className="flex gap-x-2">
          <FilterOptions isRoot={isRoot} />
          <SortOptions isRoot={isRoot} />
        </div>
      </div>
      <div className="p-1 sm:p-6">
        {viewMode === "grid" ? ( // Grid View Mode
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
            {files.map((file) => (
              <FileContextMenu key={file.id} file={file}>
                <div
                  onClick={() => handleFileClick(file)}
                  className="group relative bg-card border rounded-xl p-3 hover:shadow-md transition-all duration-200 hover:-translate-y-1 cursor-pointer"
                >
                  {/* File preview */}
                  <div className="aspect-square rounded-lg mb-3 relative overflow-hidden bg-muted/20">
                    <FilePreview file={file} />
                  </div>

                  {/* File info */}
                  <div className="space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3
                        className="text-sm font-medium truncate"
                        title={file.name}
                      >
                        {file.name}
                      </h3>
                      {file.isStarred && (
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground h-4">
                      <span>
                        {file.type === "folder"
                          ? "Folder"
                          : getFileSize(file.size)}
                      </span>
                    </div>
                  </div>
                </div>
              </FileContextMenu>
            ))}
          </div>
        ) : (
          // List View Mode
          <div className="space-y-1">
            {files.map((file) => {
              const Icon = getFileIcon(file.type);
              return (
                <FileContextMenu key={file.id} file={file}>
                  <div className="flex flex-col">
                    <Separator orientation="horizontal" />
                    <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                      <div
                        className={cn(
                          "p-2 rounded-lg flex-shrink-0",
                          getFileColor(file.type)
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium truncate">
                            {file.name}
                          </p>
                          {file.isStarred && (
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                          )}
                        </div>
                      </div>

                      <div className="text-sm text-muted-foreground flex-shrink-0">
                        {file.type === "folder"
                          ? "Folder"
                          : getFileSize(file.size)}
                      </div>

                      {/* Actions button */}
                      <div className={cn("flex-shrink-0")}>
                        <FileActions file={file} />
                      </div>
                    </div>
                  </div>
                </FileContextMenu>
              );
            })}
            <Separator orientation="horizontal" />
          </div>
        )}
      </div>
    </div>
  );
}
