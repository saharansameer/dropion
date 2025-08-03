import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/api/wrapper";
import { db } from "@/lib/db";
import { files, NewFile } from "@/lib/db/schema";
import { getUploadFileType } from "@/lib/db/db-utils";
import { BaseResponse, FilesResponse, MimeType } from "@/types";
import { deleteByPrefix } from "@/lib/redis/redis-utils";
import imagekit from "@/lib/imagekit";

export const POST = withAuth(async (request: NextRequest, { userId }) => {
  try {
    // parse request body
    const { file, parentId, fileType } = await request.json();

    if (!file || !fileType) {
      await imagekit.deleteFile(file.fileId);
      return NextResponse.json<BaseResponse>(
        { success: false, message: "Invalid File Upload Data" },
        { status: 400 }
      );
    }

    // File Info (to be stored in database)
    const fileInfo: NewFile = {
      name: file.name || "untitled",
      path: file.filePath,
      size: file.size,
      type: getUploadFileType(fileType),
      mimeType: fileType as MimeType,
      fileUrl: file.url,
      thumbnailUrl: file.thumbnailUrl,
      imagekitId: file.fileId,
      owner: userId,
      parentId: parentId || null,
    };

    // Save File Info in Database
    const [newFile] = await db.insert(files).values(fileInfo).returning();

    // Clear cache
    await deleteByPrefix(userId);

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
    const { file } = await request.json();
    await imagekit.deleteFile(file.fileId);

    return NextResponse.json<BaseResponse>(
      { success: false, message: "Failed to save file upload info" },
      { status: 500 }
    );
  }
});
