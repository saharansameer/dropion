"use client";

import { useSignIn } from "@clerk/nextjs";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signinSchema, SigninSchemaInputs } from "@/zod/schema/authSchema";
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

export function SigninForm() {
  const router = useRouter();
  const { signIn, isLoaded, setActive } = useSignIn();

  // Signin Logic
  const form = useForm<SigninSchemaInputs>({
    resolver: zodResolver(signinSchema),
    defaultValues: { identifier: "", password: "" },
    mode: "onSubmit",
  });

  const onSigninHandler: SubmitHandler<SigninSchemaInputs> = async (
    formData
  ) => {
    if (!signIn) {
      toast.error("Undefined Clerk Signup");
      return;
    }

    try {
      const { identifier, password } = formData;

      const result = await signIn.create({
        identifier,
        password,
      });

      console.log("Signin Result:", result);

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        toast.success("Sign-in Success")
        router.push("/home");
        router.refresh();
      } else {
        form.setError("root", {
          type: "validate",
          message: "Failed to sign-in",
        });
      }
    } catch (error: any) {
      console.error("Signin Error:", error);
      form.setError("root", {
        type: "validate",
        message:
          error?.errors?.[0]?.message || "Someting went wrong during sign-in",
      });
    }
  };

  // Signin Form (UI)
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSigninHandler)}
        className="flex flex-col gap-y-5"
      >
        {form.formState.errors.root && (
          <ErrorMessage
            text={form.formState.errors.root.message as string}
            className="leading-tight"
          />
        )}
        <FormField
          name="identifier"
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
          {form.formState.isSubmitting ? <LoaderSpin /> : "Sign in"}
        </Button>
      </form>
    </Form>
  );
}
