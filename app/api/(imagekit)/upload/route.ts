import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/api/wrapper";
import { db } from "@/lib/db";
import { files, NewFile } from "@/lib/db/schema";
import { BaseResponse, FilesResponse } from "@/types";

export const POST = withAuth(async (request: NextRequest, { userId }) => {
  try {
    // parse request body
    const { imagekit } = await request.json();
    console.log("ImageKit Upload:", imagekit);

    if (!imagekit || !imagekit.url) {
      return NextResponse.json<BaseResponse>(
        { success: false, message: "Invalid File Upload Data" },
        { status: 400 }
      );
    }

    // Extract File Data
    const fileData: NewFile = {
      name: imagekit.name || "untitled",
      path: imagekit.filePath,
      size: imagekit.size,
      type: imagekit.fileType,
      fileUrl: imagekit.url,
      thumbnailUrl: imagekit.thumbnailUrl,
      owner: userId,
    };

    // Save File Data in Database
    const [newFile] = await db.insert(files).values(fileData).returning();

    // Final Response
    return NextResponse.json<FilesResponse>(
      {
        success: true,
        message: "File Data Saved",
        data: newFile,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json<BaseResponse>(
      { success: false, message: "Failed to save file upload info" },
      { status: 500 }
    );
  }
});
