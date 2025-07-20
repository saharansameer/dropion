import { Trash2, Star, FolderOpen, Sparkles } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  type?: "files" | "trash" | "starred" | "general";
  className?: string;
}

export function EmptyState({
  title = "Empty",
  message,
  icon,
  type = "general",
  className = "",
}: EmptyStateProps) {
  const getTypeIcon = () => {
    switch (type) {
      case "files":
        return <FolderOpen className="w-10 h-10" />;
      case "trash":
        return <Trash2 className="w-10 h-10" />;
      case "starred":
        return <Star className="w-10 h-10" />;
      default:
        return <Sparkles className="w-10 h-10" />;
    }
  };

  const getGradientColors = () => {
    switch (type) {
      case "files":
        return "from-blue-500/20 to-indigo-500/20";
      case "trash":
        return "from-red-500/20 to-orange-500/20";
      case "starred":
        return "from-yellow-500/20 to-amber-500/20";
      default:
        return "from-primary/20 to-accent/20";
    }
  };

  const getDefaultMessages = () => {
    switch (type) {
      case "files":
        return "No files uploaded yet. Start by uploading your first file to get organized.";
      case "trash":
        return "Your trash is empty. Deleted files will appear here and can be restored or permanently deleted.";
      case "starred":
        return "No starred files yet. Star your important files to quickly access them here.";
      default:
        return "Nothing to show here yet.";
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center text-center py-12 px-6 ${className}`}
    >
      {/* Icon with gradient background */}
      <div className="relative mb-4">
        <div
          className={`w-20 h-20 rounded-full bg-gradient-to-br ${getGradientColors()} flex items-center justify-center backdrop-blur-sm border border-white/10 shadow-lg`}
        >
          <div className="text-foreground/70">{icon || getTypeIcon()}</div>
        </div>
        {/* Subtle glow effect */}
        <div
          className={`absolute inset-0 w-24 h-24 rounded-2xl bg-gradient-to-br ${getGradientColors()} blur-xl opacity-30 -z-10 -translate-x-2 -translate-y-2`}
        ></div>
      </div>

      {/* Content */}
      <div className="space-y-2 max-w-sm">
        <h3 className="text-xl font-semibold text-foreground tracking-tight">
          {title}
        </h3>
        <p className="text-muted-foreground leading-relaxed text-sm">
          {message || getDefaultMessages()}
        </p>
      </div>
    </div>
  );
}
