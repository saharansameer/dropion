import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeftFromLine } from "lucide-react";

export const metadata: Metadata = {
  title: "404 Not Found",
  description: "The page you're looking for does not exist or has been moved.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="text-center space-y-6">
        <div className="text-5xl sm:text-6xl font-bold text-muted-foreground/30 select-none">
          404
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Page Not Found
          </h1>
          <p className="text-muted-foreground">
            The page you&apos;re looking for does not exist or has been moved.
          </p>
        </div>
        <Link href="/home">
          <Button variant="outline">
            <ArrowLeftFromLine className="w-4 h-4" />
            Go Back
          </Button>
        </Link>
      </div>
    </div>
  );
}
