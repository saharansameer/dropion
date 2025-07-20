import { z } from "zod/v4";
import {
  emailValidator,
  usernameValidator,
  passwordValidator,
  passwordValidatorLite,
} from "@/zod/validators";

// Signup Schema
export const signupSchema = z.object({
  email: emailValidator,
  username: usernameValidator,
  password: passwordValidator,
});

export type SignupSchemaInputs = z.input<typeof signupSchema>;

// Signin Schema
export const signinSchema = z.object({
  identifier: emailValidator,
  password: passwordValidatorLite,
});

export type SigninSchemaInputs = z.input<typeof signinSchema>;

// OTP Schema
export const otpSchema = z.object({
  otp: z
    .string()
    .min(6, { error: "Invalid OTP" })
});

export type OtpSchemaInfer = z.infer<typeof otpSchema>;
