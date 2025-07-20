import type { Metadata } from "next";
import { headers } from "next/headers";
import { FileGrid } from "@/components/Files/FileGrid";
import { EmptyTrash } from "@/components/client";

export const metadata: Metadata = {
  title: "Trash | Dropion",
  description: "View your deleted files",
};

async function TrashData() {
  const headersList = await headers();

  const { success, message, data } = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/files/toggle/trash`,
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

  return <FileGrid files={data} isAnother={"trash"} />;
}

export default function Page() {
  return (
    <div>
      <EmptyTrash />
      <TrashData />
    </div>
  );
}
