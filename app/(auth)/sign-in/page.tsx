import { SigninForm } from "@/components/Auth/SigninForm";

export default function Page() {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-bold mb-5">Sign in</h1>
        <SigninForm />
      </div>
    </div>
  );
}
