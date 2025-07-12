import { Loader2 } from "lucide-react";

export function LoaderSpin({ className }: { className?: string | null }) {
  return <Loader2 className={className || "h-5 w-5 animate-spin"} />;
}
