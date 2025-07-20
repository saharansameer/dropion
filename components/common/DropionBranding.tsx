import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";
import { ArrowLeftFromLine } from "lucide-react";
import Link from "next/link";

export function DropionBranding({ className }: { className?: string }) {
  return (
    <div className={cn("flex gap-x-2 mb-10", className)}>
      <Image src="/logo.png" alt="Dropion Logo" width={50} height={50} />

      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-semibold text-3xl font-sans text-primary">
          Dropion
        </span>
      </div>
    </div>
  );
}

export function DropionBrandingWithButton() {
  return (
    <div className="w-full max-w-sm flex justify-between">
      <DropionBranding />
      <Link href={"/"}>
        <Button variant={"outline"}>
          <ArrowLeftFromLine />
        </Button>
      </Link>
    </div>
  );
}
