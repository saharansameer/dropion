"use client";

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { HardDrive } from "lucide-react";
import { SpaceCache } from "@/types";
import { filesize } from "filesize";

export function UserSpace() {
  const [data, setData] = useState<SpaceCache | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await fetch("/api/space").then((res) => res.json());
        setData(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 p-2">
        <div className="flex items-center gap-2 text-sm font-medium">
          <HardDrive className="h-4 w-4" />
          <span>Storage</span>
        </div>
        <div className="h-2 w-full rounded-full bg-muted" />
      </div>
    );
  }

  const { totalSpace, usedSpace } = data!;
  const usagePercentage = (usedSpace / totalSpace) * 100;

  return (
    <div className="w-full flex flex-col gap-1 pb-1">
      <div className="flex justify-between">
        <div className="flex items-center gap-2 text-xs font-medium">
          <HardDrive className="h-4 w-4" />
          <span>Storage</span>
        </div>
        <div className="flex justify-end text-xs text-muted-foreground">
          {filesize(usedSpace, { standard: "jedec", round: 0 })}/
          {filesize(totalSpace, { standard: "jedec", round: 0 })}
        </div>
      </div>

      <Progress value={usagePercentage} className="h-2" />
    </div>
  );
}
