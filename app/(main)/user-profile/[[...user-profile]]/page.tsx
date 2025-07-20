import type { Metadata } from "next";
import { UserProfile } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Account | Dropion",
};

export default function Page() {
  return (
    <div className="w-full mx-auto flex justify-center py-20">
      <UserProfile />
    </div>
  );
}
