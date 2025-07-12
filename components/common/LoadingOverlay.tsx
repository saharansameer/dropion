import { Loader2 } from "lucide-react";

export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
        <Loader2 className="h-16 w-16 text-primary animate-spin" />
      </div>
    </div>
  );
}
