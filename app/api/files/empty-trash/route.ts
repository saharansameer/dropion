import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { and, eq, inArray } from "drizzle-orm";
import { withAuth } from "@/lib/api/wrapper";
import { BaseResponse } from "@/types";
import { deleteByPrefix } from "@/lib/redis/redis-utils";
import imagekit from "@/lib/imagekit";

export const DELETE = withAuth(async (request: NextRequest, { userId }) => {
  try {
    // Array to store imagekit id
    const imagekitFileIds = [];

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

    // Get imagekitId of deleted files
    const ids = deleted
      .filter((item) => !item.isFolder)
      .map((item) => item.imagekitId);
    imagekitFileIds.push(...ids);

    // Extract parent id
    const parentIds = deleted
      .filter((item) => item.isFolder)
      .map((item) => item.id);

    // Delete Folder Content
    if (parentIds.length > 0) {
      const children = await db
        .delete(files)
        .where(and(inArray(files.parentId, parentIds), eq(files.owner, userId)))
        .returning();

      // Get imagekitId of deleted children
      const ids = children.map((item) => item.imagekitId);
      imagekitFileIds.push(...ids);
    }

    // Delete From Imagekit
    if (imagekitFileIds.length !== 0) {
      await imagekit.bulkDeleteFiles(imagekitFileIds as string[]);
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
