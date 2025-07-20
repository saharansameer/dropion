import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { and, eq, inArray } from "drizzle-orm";
import { withAuth } from "@/lib/api/wrapper";
import { BaseResponse } from "@/types";
import { deleteByPrefix } from "@/lib/redis/redis-utils";

export const DELETE = withAuth(async (request: NextRequest, { userId }) => {
  try {
    // Perform Permanent Deletion
    const deleted = await db
      .delete(files)
      .where(and(eq(files.owner, userId), eq(files.isTrash, true)))
      .returning();

    if (!deleted) {
      return NextResponse.json<BaseResponse>(
        { success: false, message: "Not Authorized" },
        { status: 401 }
      );
    }

    // Extract parent id
    const parentIds = deleted
      .filter((item) => item.isFolder)
      .map((item) => item.id);

    // Delete Folder Content
    if (parentIds.length > 0) {
      await db
        .delete(files)
        .where(
          and(inArray(files.parentId, parentIds), eq(files.owner, userId))
        );
    }

    // Clear Cache
    await deleteByPrefix(userId);

    // Final Response
    return NextResponse.json<BaseResponse>(
      { success: true, message: "Deleted Successfully" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json<BaseResponse>(
      { success: false, message: "Uknown Issue While Deleting" },
      { status: 500 }
    );
  }
});
