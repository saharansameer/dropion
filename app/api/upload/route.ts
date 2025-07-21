import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/api/wrapper";
import { db } from "@/lib/db";
import { files, NewFile } from "@/lib/db/schema";
import {
  allowedMimeTypes,
  getFolderName,
  getUploadFileType,
} from "@/lib/db/db-utils";
import { BaseResponse, FilesResponse, MimeType } from "@/types";
import imagekit from "@/lib/imagekit";
import { deleteByPrefix } from "@/lib/redis/redis-utils";
import { getAvailableSpace } from "@/lib/space";

export const POST = withAuth(async (request: NextRequest, { userId }) => {
  try {
    // Extract Form Data
    const formData = await request.formData();

    // Parse Form Data
    const file = formData.get("file") as File;
    const parentId = (formData.get("parentId") as string) || null;

    // Make sure form data and file both exist
    if (!formData || !file) {
      return NextResponse.json<BaseResponse>(
        { success: false, message: "File is missing" },
        { status: 400 }
      );
    }

    // Check File Type
    if (!allowedMimeTypes.includes(file.type as MimeType)) {
      return NextResponse.json<BaseResponse>(
        { success: false, message: "Unsupported File Type" },
        { status: 400 }
      );
    }

    // Check if User has sufficient free space
    const availableSpace = await getAvailableSpace(userId);
    if (file.size > availableSpace) {
      return NextResponse.json<BaseResponse>(
        { success: false, message: "Insufficient Space" },
        { status: 400 }
      );
    }

    // File Buffer
    const buffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(buffer);
    const folderPath = `${userId}/${getFolderName(file.type)}`; // Imagekit Folder

    // Imagekit Upload
    const imagekitResponse = await imagekit.upload({
      file: fileBuffer,
      fileName: file.name,
      folder: folderPath,
      useUniqueFileName: true,
    });

    // File Info (to be stored in database)
    const fileInfo: NewFile = {
      name: file.name || "untitled",
      path: imagekitResponse.filePath,
      size: file.size,
      type: getUploadFileType(file.type),
      mimeType: file.type as MimeType,
      fileUrl: imagekitResponse.url,
      thumbnailUrl: imagekitResponse.thumbnailUrl,
      owner: userId,
      parentId: parentId,
      imagekitId: imagekitResponse.fileId,
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
    return NextResponse.json<BaseResponse>(
      { success: false, message: "Failed to save file upload info" },
      { status: 500 }
    );
  }
});
