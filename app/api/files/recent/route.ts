import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { withAuth } from "@/lib/api/wrapper";
import { BaseResponse, FilesResponse, FilesCache } from "@/types";
import redis from "@/lib/redis";

export const GET = withAuth(async (request: NextRequest, { userId }) => {
  try {
    // Check cached storage
    const cache: FilesCache | null = await redis.get(`${userId}:home`);
    if (cache) {
      return NextResponse.json<FilesResponse>(
        {
          success: true,
          message: "Fetched Recent Files (from cache)",
          data: cache,
        },
        { status: 200 }
      );
    }

    // Fetch Files from Database
    const userFiles = await db
      .select()
      .from(files)
      .where(and(eq(files.owner, userId), eq(files.isTrash, false)))
      .orderBy(desc(files.createdAt))
      .limit(10);

    if (!userFiles) {
      return NextResponse.json<BaseResponse>(
        { success: false, message: "Empty, No Files Exist" },
        { status: 404 }
      );
    }

    // Cache Files
    await redis.setex(`${userId}:home`, 60, JSON.stringify(userFiles));

    // Final Response
    return NextResponse.json<FilesResponse>(
      { success: true, message: "Fetched Recent Files", data: userFiles },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json<BaseResponse>(
      { success: false, message: "Failed to GET recent files" },
      { status: 500 }
    );
  }
});
