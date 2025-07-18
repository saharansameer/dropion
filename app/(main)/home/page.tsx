import type { Metadata } from "next";
import { FileUpload } from "@/components/Files/FileUpload";

export const metadata: Metadata = {
  title: "Home",
  description: "Explore Dropion",
};

export default function Page() {
  return (
    <div className="w-full mx-auto flex justify-center py-10">
      <div className="w-full max-w-4xl">
        <FileUpload variant="dropzone" />
      </div>
    </div>
  );
}
