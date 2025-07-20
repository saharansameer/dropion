import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { and, eq, sql, desc } from "drizzle-orm";
import { withAuth } from "@/lib/api/wrapper";
import { BaseResponse, FilesResponse, FilesCache } from "@/types";
import { deleteByPrefix } from "@/lib/redis/redis-utils";
import redis from "@/lib/redis";

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

export const GET = withAuth(async (request: NextRequest, { userId }) => {
  try {
    // Check cache
    const cache: FilesCache | null = await redis.get(`${userId}:starred`);
    if (cache) {
      return NextResponse.json<FilesResponse>(
        {
          success: true,
          message: "Starred Files Fetched (from cache)",
          data: cache,
        },
        { status: 200 }
      );
    }

    // Get Starred Files
    const starredFiles = await db
      .select()
      .from(files)
      .where(and(eq(files.owner, userId), eq(files.isStarred, true), eq(files.isTrash, false)))
      .orderBy(desc(files.updatedAt));

    if (!starredFiles) {
      return NextResponse.json<BaseResponse>(
        { success: false, message: "Not Authorized" },
        { status: 401 }
      );
    }

    // Cache Files
    await redis.setex(`${userId}:starred`, 60, JSON.stringify(starredFiles))

    // Final Response
    return NextResponse.json<FilesResponse>(
      { success: true, message: "Starred Files Fetched", data: starredFiles },
      { status: 200 }
    );
  } catch {
    return NextResponse.json<BaseResponse>(
      { success: false, message: "Uknown Issue While Fetching Starred" },
      { status: 500 }
    );
  }
});
