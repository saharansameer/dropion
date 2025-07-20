"use client";

import { useSignUp } from "@clerk/nextjs";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { otpSchema, OtpSchemaInfer } from "@/zod/schema/authSchema";
import { Button } from "@/components/ui";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
} from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { LoaderSpin, ErrorMessage } from "@/components/server";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function OtpForm() {
  const router = useRouter();
  const { signUp, isLoaded, setActive } = useSignUp();

  // OTP Logic
  const otpForm = useForm<OtpSchemaInfer>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
    mode: "onSubmit",
  });

  const onVerificationHandler: SubmitHandler<OtpSchemaInfer> = async (
    formData
  ) => {
    if (!signUp) return;

    const toastId = toast.loading("Verifying...");

    try {
      const { otp } = formData;

      const result = await signUp.attemptEmailAddressVerification({
        code: otp,
      });

      if (result.status === "complete") {
        toast.success("Verification Success", { id: toastId });
        await setActive({ session: result.createdSessionId });
      }
    } catch (error: AnyError) {
      toast.error("Verification Error", { id: toastId });
      otpForm.setError("otp", {
        type: "validate",
        message:
          error?.errors?.[0]?.message || "Unable to verify OTP at this moment",
      });
    } finally {
      router.refresh();
    }
  };

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
              <FormLabel>One-Time Password</FormLabel>
              <FormDescription>
                Please enter the OTP sent to your email.
              </FormDescription>
              <FormControl>
                <InputOTP
                  minLength={6}
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

        <div id="clerk-captcha" />

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
