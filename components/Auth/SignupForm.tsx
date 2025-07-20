"use client";

import { useSignUp } from "@clerk/nextjs";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, SignupSchemaInputs } from "@/zod/schema/authSchema";
import { Input, Button } from "@/components/ui";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoaderSpin, ErrorMessage } from "@/components/server";
import { PasswordInput } from "@/components/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function SignupForm() {
  const router = useRouter();
  const { signUp, isLoaded } = useSignUp();

  // Signup Logic
  const form = useForm<SignupSchemaInputs>({
    resolver: zodResolver(signupSchema),
    defaultValues: { username: "", email: "", password: "" },
    mode: "onSubmit",
  });

  const onSignupHandler: SubmitHandler<SignupSchemaInputs> = async (
    formData
  ) => {
    if (!signUp) {
      toast.error("Undefined Clerk Signup");
      return;
    }

    const toastId = toast.loading("Checking Details...");

    try {
      const { username, email, password } = formData;

      await signUp.create({
        emailAddress: email,
        username,
        password,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      toast.success("OTP sent to your mail", { id: toastId });

      router.push("/verify-account");
    } catch (error: AnyError) {
      toast.error("Sign-up Error", { id: toastId });
      form.setError("root", {
        type: "validate",
        message:
          error?.errors?.[0]?.message || "Someting went wrong during sign-up",
      });
    } finally {
      router.refresh();
    }
  };

  // Signup Form (UI)
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSignupHandler)}
        className="flex flex-col gap-y-5"
      >
        {form.formState.errors.root && (
          <ErrorMessage
            text={form.formState.errors.root.message as string}
            className="leading-tight"
          />
        )}
        <FormField
          name="username"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter a name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter your email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div id="clerk-captcha" />

        <Button
          type="submit"
          variant={"default"}
          disabled={
            form.formState.isSubmitting ||
            form.formState.isSubmitSuccessful ||
            !isLoaded
          }
          className="font-semibold w-full"
        >
          {form.formState.isSubmitting ? <LoaderSpin /> : "Sign up"}
        </Button>
      </form>
    </Form>
  );
}
