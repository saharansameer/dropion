"use client";

import { Toaster, type ToasterProps } from "sonner";
import { useTheme } from "next-themes";

export default function SonnerToaster() {
  const { resolvedTheme } = useTheme();
  return (
    <Toaster
      richColors
      theme={resolvedTheme as ToasterProps["theme"]}
      position="bottom-right"
    />
  );
}
