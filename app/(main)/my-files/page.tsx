import type { Metadata } from "next";
import { headers } from "next/headers";
import { FileGrid } from "@/components/Files/FileGrid";

export const metadata: Metadata = {
  title: "My Files",
  description: "My Files Root Folder",
};

interface PageProps {
  searchParams: Promise<{ filter?: string; sort?: string }>;
}

async function RootFolder({ searchParams }: PageProps) {
  const { filter, sort } = await searchParams;

  const headersList = await headers();

  const { success, message, data } = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/files?filter=${filter}&sort=${sort}`,
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

  return <FileGrid files={data} isRoot={true} />;
}

export default function Page(props: PageProps) {
  return (
    <div>
      <RootFolder {...props} />
    </div>
  );
}
