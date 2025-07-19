import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { withAuth } from "@/lib/api/wrapper";
import { BaseResponse } from "@/types";
import { deleteByPrefix } from "@/lib/redis/redis-utils";

export const PATCH = withAuth(async (request: NextRequest, { userId }) => {
  try {
    // Extract File or Folder Id form query params
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json<BaseResponse>(
        { success: false, message: "Invalid File Id" },
        { status: 404 }
      );
    }

    // Perform Star Toggle
    const toggled = await db
      .update(files)
      .set({ isStarred: sql`not ${files.isStarred}` })
      .where(and(eq(files.id, id), eq(files.owner, userId)))
      .returning();

    if (!toggled) {
      return NextResponse.json<BaseResponse>(
        { success: false, message: "Not Authorized" },
        { status: 401 }
      );
    }

    // Clear Cache
    await deleteByPrefix(userId);

    // Final Response
    return NextResponse.json(
      { success: true, message: "Star Toggled" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json<BaseResponse>(
      { success: false, message: "Uknown Issue While Star Toggle" },
      { status: 500 }
    );
  }
});
