import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/api/wrapper";
import { getAvailableSpace } from "@/lib/space";
import { BaseResponse, SpaceResponse, SpaceCache } from "@/types";
import redis from "@/lib/redis";

export const GET = withAuth(async (request: NextRequest, { userId }) => {
  try {
    // Check Cache
    const cache: SpaceCache | null = await redis.get(`${userId}:space`);
    if (cache) {
      return NextResponse.json<SpaceResponse>(
        { success: true, message: "Space Fetched (from cache)", data: cache },
        { status: 200 }
      );
    }

    const totalSpace = 500000000;
    const availableSpace = await getAvailableSpace(userId);

    const spaceDetails = {
      availableSpace,
      totalSpace,
      usedSpace: totalSpace - availableSpace,
    };

    // Cache Space Details
    await redis.setex(`${userId}:space`, 3600, JSON.stringify(spaceDetails));

    // Final Response
    return NextResponse.json<SpaceResponse>(
      { success: true, message: "Space Fetched", data: spaceDetails },
      { status: 200 }
    );
  } catch {
    return NextResponse.json<BaseResponse>(
      { success: false, message: "Faile to GET Space" },
      { status: 500 }
    );
  }
});
