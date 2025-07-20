import { SigninForm } from "@/components/Auth/SigninForm";
import Link from "next/link";
import type { Metadata } from "next";
import { DropionBrandingWithButton } from "@/components/server";

export const metadata: Metadata = {
  title: "Sign in | Dropion",
};

export default function Page() {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center px-4">
      <DropionBrandingWithButton />
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-bold mb-5">Sign in</h1>
        <SigninForm />
      </div>
      <div className="flex text-sm gap-x-2 mt-4 font-semibold">
        <p>Don&apos;t have an account?</p>
        <Link href={"/sign-up"} className="hover:underline text-primary">
          Sign up
        </Link>
      </div>
    </div>
  );
}
