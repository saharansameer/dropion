import type { NextRequest, NextResponse } from "next/server";

export interface BaseResponse {
  success: boolean;
  message: string;
}

export type RequestHandler = (
  request: NextRequest,
  authData: { userId: string }
) => Promise<NextResponse>;

export type SpaceCache = {
  availableSpace: number;
  totalSpace: number;
  usedSpace: number;
};

export interface SpaceResponse extends BaseResponse {
  data: SpaceCache;
}
