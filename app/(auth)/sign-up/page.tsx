import { SignupForm } from "@/components/Auth/SignupForm";

export default function Page() {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-bold mb-5">Sign up</h1>
        <SignupForm />
      </div>
    </div>
  );
}
