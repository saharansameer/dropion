import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { files, NewFile } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { withAuth } from "@/lib/api/wrapper";
import { trimAndClean } from "@/lib/utils";
import { BaseResponse, FilesResponse } from "@/types";
import { v4 as uuidv4 } from "uuid";

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

    // Validate Parent Folder
    if (parentId) {
      const [parentFolder] = await db
        .select()
        .from(files)
        .where(
          and(
            eq(files.id, parentId),
            eq(files.owner, userId),
            eq(files.isFolder, true)
          )
        );

      if (!parentFolder) {
        return NextResponse.json<BaseResponse>(
          { success: false, message: "Parent Folder Not Found" },
          { status: 404 }
        );
      }
    }

    // Extract Folder Data
    const folderData: NewFile = {
      id: uuidv4(),
      name: trimmedFolderName,
      path: `folders/${userId}/uuidv4`,
      size: 0,
      type: "folder",
      fileUrl: "",
      thumbnailUrl: "",
      owner: userId,
      parentId,
      isFolder: true

    };

    // Save Folder Data in Database
    const [newFolder] = await db.insert(files).values(folderData).returning();

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
