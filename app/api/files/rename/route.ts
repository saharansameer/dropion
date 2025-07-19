import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { withAuth } from "@/lib/api/wrapper";
import { BaseResponse } from "@/types";
import { deleteByPrefix } from "@/lib/redis/redis-utils";
import { trimAndClean } from "@/lib/utils";

export const PATCH = withAuth(async (request: NextRequest, { userId }) => {
  try {
    // Extract File or Folder Id form query params
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    // Extract and Refine Folder Name
    const { name } = await request.json();
    const trimmedName = trimAndClean(name);

    if (!id || !trimmedName) {
      return NextResponse.json<BaseResponse>(
        { success: false, message: "Invalid Name or Id" },
        { status: 404 }
      );
    }

    // Perform Rename
    const renamed = await db
      .update(files)
      .set({ name: trimmedName })
      .where(and(eq(files.id, id), eq(files.owner, userId)))
      .returning();

    if (!renamed) {
      return NextResponse.json<BaseResponse>(
        { success: false, message: "Not Authorized" },
        { status: 401 }
      );
    }

    // Clear Cache
    await deleteByPrefix(userId);

    // Final Response
    return NextResponse.json(
      { success: true, message: "Renamed Successfully" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json<BaseResponse>(
      { success: false, message: "Uknown Issue While Renaming" },
      { status: 500 }
    );
  }
});
