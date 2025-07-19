import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { files, NewFile } from "@/lib/db/schema";
import { withAuth } from "@/lib/api/wrapper";
import { trimAndClean } from "@/lib/utils";
import { BaseResponse, FilesResponse } from "@/types";
import { deleteByPrefix } from "@/lib/redis/redis-utils";

export const POST = withAuth(async (request: NextRequest, { userId }) => {
  try {
    // parse request body
    const { folderName, parentId } = await request.json();

    // Validate Folder name
    const trimmedFolderName = trimAndClean(folderName || "");
    if (!trimmedFolderName) {
      return NextResponse.json<BaseResponse>(
        { success: false, message: "Invalid Folder Name" },
        { status: 400 }
      );
    }

    // Extract Folder Data
    const folderData: NewFile = {
      name: trimmedFolderName,
      size: 0,
      type: "folder",
      owner: userId,
      parentId: parentId,
      isFolder: true,
      path: "",
      fileUrl: "",
      thumbnailUrl: null,
    };

    // Save Folder Data in Database
    const [newFolder] = await db.insert(files).values(folderData).returning();

    // Clear Cache (if exist)
    await deleteByPrefix(userId);

    // Final Response
    return NextResponse.json<FilesResponse>(
      { success: true, message: "Folder Created", data: newFolder },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to create Folder" },
      { status: 500 }
    );
  }
});
