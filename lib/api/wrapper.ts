import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { BaseResponse, RequestHandler } from "@/types";

export function withAuth(requestHandler: RequestHandler) {
  return async (request: NextRequest) => {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json<BaseResponse>(
        { success: false, message: "Please Sign-in and Try again" },
        { status: 401 }
      );
    }

    return requestHandler(request, { userId });
  };
}
