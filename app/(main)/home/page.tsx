import type { Metadata } from "next";
import { FileUpload } from "@/components/Forms/FileUpload";
import { FileGrid } from "@/components/Files/FileGrid";
import { headers } from "next/headers";
import { ClockFading } from "lucide-react";
import { Suspense } from "react";
import { FileGridSkeleton } from "@/components/skeleton/file-grid-skeleton";

export const metadata: Metadata = {
  title: "Home | Dropion",
};

async function RecentFiles() {
  const headersList = await headers();

  const { success, message, data } = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/files/recent`,
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

  return <FileGrid files={data} isRoot={true} hideOptions={true} />;
}

export default function Page() {
  return (
    <div className="w-full mx-auto flex justify-center py-10 gap-y-40">
      <div className="w-full flex flex-col gap-y-40 items-center">
        <div className="w-full max-w-4xl">
          <FileUpload variant="dropzone" />
        </div>

        <div className="w-full">
          <h2 className="flex gap-x-2 font-semibold mb-2 font-sans text-foreground/80">
            <ClockFading />
            Most Recent Files
          </h2>
          <Suspense fallback={<FileGridSkeleton />}>
            <RecentFiles />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
