import { headers } from "next/headers";
import { FileGrid } from "@/components/Files/FileGrid";

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
    <div>
      <FolderData {...props} />
    </div>
  );
}
