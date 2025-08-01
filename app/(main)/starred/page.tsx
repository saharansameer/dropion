import type { Metadata } from "next";
import { headers } from "next/headers";
import { FileGrid } from "@/components/Files/FileGrid";
import { Suspense } from "react";
import { FileGridSkeleton } from "@/components/skeleton/file-grid-skeleton";

export const metadata: Metadata = {
  title: "Starred | Dropion",
  description: "View your starred files",
};

async function StarredData() {
  const headersList = await headers();

  const { success, message, data } = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/files/toggle/star`,
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

  return <FileGrid files={data} isAnother={"starred"} hideOptions={true} />;
}

export default function Page() {
  return (
    <Suspense fallback={<FileGridSkeleton />}>
      <StarredData />
    </Suspense>
  );
}
