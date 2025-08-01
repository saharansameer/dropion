"use client";

import { useState } from "react";
import { Button, Separator } from "@/components/ui";
import { Skeleton } from "@/components/ui/skeleton";
import { Grid3X3, List } from "lucide-react";

interface FileGridSkeletonProps {
  itemCount?: number;
  hideOptions?: boolean;
}

export function FileGridSkeleton({
  itemCount = 12,
  hideOptions = false,
}: FileGridSkeletonProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

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

        {/* Filter & Sort Skeleton */}
        <div className={hideOptions ? "hidden" : "flex gap-x-2"}>
          <Button size="sm" variant="outline" disabled>
            <Skeleton className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" disabled>
            <Skeleton className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="p-1 sm:p-6">
        {viewMode === "grid" ? (
          // Grid View Skeleton
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
            {Array.from({ length: itemCount }).map((_, index) => (
              <div
                key={index}
                className="group relative bg-card border rounded-xl p-3"
              >
                <Skeleton className="aspect-square rounded-lg mb-3" />
                <div className="space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <Skeleton className="h-4 flex-1" />
                    <Skeleton className="h-3 w-3 flex-shrink-0" />
                  </div>
                  <Skeleton className="h-3 w-12" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          // List View Skeleton
          <div className="space-y-1">
            {Array.from({ length: itemCount }).map((_, index) => (
              <div key={index} className="flex flex-col">
                <Separator orientation="horizontal" />
                <div className="flex items-center gap-4 p-3 rounded-lg">
                  <Skeleton className="h-8 w-8 rounded-lg flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 flex-1 max-w-48" />
                      <Skeleton className="h-3 w-3 flex-shrink-0" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-16 flex-shrink-0" />
                  <Skeleton className="h-8 w-8 flex-shrink-0" />
                </div>
              </div>
            ))}
            <Separator orientation="horizontal" />
          </div>
        )}
      </div>
    </div>
  );
}
