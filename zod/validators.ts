import { z } from "zod/v4";

export const emailValidator = z.email({ error: "Email is invalid" });

export const usernameValidator = z
  .string()
  .min(4, { error: "Username must be at least 4 characters" })
  .max(24, { error: "Username must not exceed 24 characters" });

export const passwordValidator = z
  .string()
  .min(8, { error: "Password must be at least 8 characters" })
  .max(128, { error: "Password must not exceed 128 characters" });

export const passwordValidatorLite = z
  .string()
  .min(1, { error: "Password can't be empty" })
  .max(128, { error: "Password exceeded 128 characters" });
