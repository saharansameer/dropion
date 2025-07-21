import { db } from "@/lib/db";
import { and, eq, sum } from "drizzle-orm";
import { files } from "@/lib/db/schema";

export async function getAvailableSpace(userId: string): Promise<number> {
  // Max Space a user can have (bytes)
  const maxSpace = 500000000

  // Calculate Used Space
  const [result] = await db
    .select({ totalSize: sum(files.size) })
    .from(files)
    .where(and(eq(files.owner, userId), eq(files.isFolder, false)));

  const usedSpace = parseInt(result.totalSize || "0");

  const availableSpace = maxSpace - usedSpace;

  return availableSpace;
}

