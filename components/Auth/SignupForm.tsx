"use client";

import { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  signupSchema,
  SignupSchemaInputs,
  otpSchema,
  OtpSchemaInputs,
} from "@/zod/schema/authSchema";
import { Input, Button } from "@/components/ui";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
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
  const [enterOTP, setEnterOTP] = useState<boolean>(false); // OTP field open/closed

  const router = useRouter();
  const { signUp, isLoaded, setActive } = useSignUp();

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

      setEnterOTP(true);
    } catch (error: AnyError) {
      console.error("Signup Error:", error);
      form.setError("root", {
        type: "validate",
        message:
          error?.errors?.[0]?.message || "Someting went wrong during sign-up",
      });
    }
  };

  // OTP Logic
  const otpForm = useForm<OtpSchemaInputs>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
    mode: "onSubmit",
  });

  const onVerificationHandler: SubmitHandler<OtpSchemaInputs> = async (
    otpFormData
  ) => {
    const { otp } = otpFormData;

    if (!enterOTP || !signUp) return;

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: otp,
      });
      console.log("OTP Result:", result);

      if (result.status === "complete") {
        toast.success("Verification Success");
        await setActive({ session: result.createdSessionId });
        router.push("/home");
        router.refresh()
      }
    } catch (error: AnyError) {
      console.error("OTP Error:", error);
      otpForm.setError("otp", {
        type: "validate",
        message:
          error?.errors?.[0]?.message || "Unable to verify OTP at this moment",
      });
    }
  };

  if (enterOTP) {
    // OTP Form (UI)
    return (
      <Form {...otpForm}>
        <form
          onSubmit={otpForm.handleSubmit(onVerificationHandler)}
          className="space-y-4"
        >
          {otpForm.formState.errors.otp && (
            <ErrorMessage
              text={otpForm.formState.errors.otp.message as string}
              className="leading-tight"
            />
          )}
          <FormField
            name="otp"
            control={otpForm.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter OTP</FormLabel>
                <FormControl>
                  <InputOTP
                    maxLength={6}
                    value={field.value}
                    onChange={field.onChange}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            variant={"default"}
            disabled={
              otpForm.formState.isSubmitting ||
              otpForm.formState.isSubmitSuccessful ||
              !isLoaded
            }
            className="cursor-pointer"
          >
            {otpForm.formState.isSubmitting ? <LoaderSpin /> : "Verify"}
          </Button>
        </form>
      </Form>
    );
  }

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
