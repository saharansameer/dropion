import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { withAuth } from "@/lib/api/wrapper";
import { BaseResponse, FilesResponse, FilesCache } from "@/types";
import redis from "@/lib/redis";

export const GET = withAuth(async (request: NextRequest, { userId }) => {
  try {
    const searchParams = request.nextUrl.searchParams;
    const parentId = searchParams.get("parentId");
    const filter = searchParams.get("filter") || undefined;
    const sort = searchParams.get("sort") || "date-latest";

    // Check cached storage
    const redisKey = parentId ? `${userId}:${parentId}:${filter}:${sort}` : `${userId}:root:${filter}:${sort}`;
    const cache: FilesCache | null = await redis.get(redisKey);
    if (cache) {
      return NextResponse.json<FilesResponse>(
        {
          success: true,
          message: "Files Fetched (from cache)",
          data: cache,
        },
        { status: 200 }
      );
    }

    // Fetch Files from Database
    let userFiles;
    if (parentId) {
      userFiles = await db
        .select()
        .from(files)
        .where(and(eq(files.parentId, parentId), eq(files.owner, userId)));
    } else {
      userFiles = await db
        .select()
        .from(files)
        .where(and(eq(files.owner, userId), isNull(files.parentId)));
    }

    if (!userFiles) {
      return NextResponse.json<BaseResponse>(
        { success: false, message: "Empty, No Files Exist" },
        { status: 404 }
      );
    }

    // Cache Files
    await redis.setex(redisKey, 60, JSON.stringify(userFiles));

    // Final Response
    return NextResponse.json<FilesResponse>(
      { success: true, message: "Files Fetched", data: userFiles },
      { status: 200 }
    );
  } catch {
    return NextResponse.json<BaseResponse>(
      { success: false, message: "Failed to GET files" },
      { status: 500 }
    );
  }
});
