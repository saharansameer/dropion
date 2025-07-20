import React from "react";
import { OtpForm } from "@/components/Auth/OtpForm";
import type { Metadata } from "next";
import { DropionBrandingWithButton } from "@/components/server";

export const metadata: Metadata = {
  title: "Verify Account | Dropion",
};

export default function Page() {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center px-4">
      <DropionBrandingWithButton />
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-bold mb-5">Verify Account</h1>
        <OtpForm />
      </div>
    </div>
  );
}
