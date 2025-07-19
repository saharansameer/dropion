import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { withAuth } from "@/lib/api/wrapper";
import { BaseResponse } from "@/types";
import { deleteByPrefix } from "@/lib/redis/redis-utils";

export const DELETE = withAuth(async (request: NextRequest, { userId }) => {
  try {
    // Extract File Id form query params
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json<BaseResponse>(
        { success: false, message: "Invalid File Id" },
        { status: 404 }
      );
    }

    // Perform Delete
    const [deleted] = await db
      .delete(files)
      .where(and(eq(files.id, id), eq(files.owner, userId)))
      .returning();

    if (!deleted) {
      return NextResponse.json<BaseResponse>(
        { success: false, message: "Not Authorized" },
        { status: 401 }
      );
    }

    // If the deleted item was a folder, also delete all of its child files
    if (deleted.isFolder) {
      await db
        .delete(files)
        .where(and(eq(files.parentId, deleted.id), eq(files.owner, userId)))
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
