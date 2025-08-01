import { headers } from "next/headers";
import { FileGrid } from "@/components/Files/FileGrid";
import type { Metadata } from "next";
import { Suspense } from "react";
import { FileGridSkeleton } from "@/components/skeleton/file-grid-skeleton";

export const metadata: Metadata = {
  title: "Folder | Dropion",
};

interface PageProps {
  params: Promise<{ folderId?: string }>;
  searchParams: Promise<{ filter?: string; sort?: string }>;
}

async function FolderData({ params, searchParams }: PageProps) {
  const { folderId } = await params;
  const { filter, sort } = await searchParams;

  const headersList = await headers();

  const { success, message, data } = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/files?parentId=${folderId}&filter=${filter}&sort=${sort}`,
    {
      method: "GET",
      next: { revalidate: 0 },
      headers: {
        cookie: headersList.get("cookie") || "",
        authorization: headersList.get("authorization") || "",
      },
    }
  ).then((res) => res.json());

  if (!success) {
    return <div>{message}</div>;
  }

  return <FileGrid files={data} isRoot={false} />;
}

export default function Page(props: PageProps) {
  return (
    <Suspense fallback={<FileGridSkeleton />}>
      <FolderData {...props} />
    </Suspense>
  );
}
