"use client";

import type React from "react";
import { useState, useRef } from "react";
import {
  CloudUpload,
  X,
  Image as ImageIcon,
  FileVideo as VideoIcon,
  FileText as FileIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { SidebarMenuButton } from "./sidebar";

interface FileInputProps {
  id: string;
  accept?: string;
  value?: File | null;
  maxFileSize?: number;
  onChange: (file: File | null) => void;
  disabled?: boolean;
  errorMessage?: string;
  variant: "dropzone" | "button";
}

const iconStyle = { width: "18px", height: "18px" };

export function FileInput({
  id,
  accept = "video/*,image/*,.pdf,.txt",
  value,
  maxFileSize = 100,
  onChange,
  disabled = false,
  errorMessage,
  variant,
}: FileInputProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isValidDrag, setIsValidDrag] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): { isValid: boolean; error?: string } => {
    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      return {
        isValid: false,
        error: `File size must be less than ${maxFileSize} MB`,
      };
    }

    // Check file type if accept is specified
    if (accept && accept !== "*") {
      const acceptedTypes = accept.split(",").map((type) => type.trim());
      const fileType = file.type;
      const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();

      const isAccepted = acceptedTypes.some((type) => {
        if (type.startsWith(".")) {
          return fileExtension === type.toLowerCase();
        }
        if (type.endsWith("/*")) {
          return fileType.startsWith(type.slice(0, -1));
        }
        return fileType === type;
      });

      if (!isAccepted) {
        return { isValid: false, error: "File type not supported" };
      }
    }

    return { isValid: true };
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    if (selected) {
      const validation = validateFile(selected);
      if (validation.isValid) {
        onChange(selected);
      } else {
        toast.error(validation.error);
      }
    } else {
      onChange(null);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;

    setIsDragOver(true);

    // Check if dragged items are valid
    const items = Array.from(e.dataTransfer.items);
    const hasValidFile = items.some((item) => item.kind === "file");
    setIsValidDrag(hasValidFile);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;

    // Only set drag over to false if we're leaving the component entirely
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsDragOver(false);
      setIsValidDrag(true);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;

    // Set the drop effect
    e.dataTransfer.dropEffect = isValidDrag ? "copy" : "none";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;

    setIsDragOver(false);
    setIsValidDrag(true);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      const validation = validateFile(file);
      if (validation.isValid) {
        onChange(file);
      }
    }
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return (
        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
          <ImageIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        </div>
      );
    }
    if (file.type.startsWith("video/")) {
      return (
        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
          <VideoIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
        </div>
      );
    }
    if (file.type === "application/pdf") {
      return (
        <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
          <FileIcon className="w-4 h-4 text-red-600 dark:text-red-400" />
        </div>
      );
    }
    return (
      <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
        <FileIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl">
      {variant === "dropzone" ? (
        // Existing dropzone variant
        <div
          className={cn(
            "relative rounded-xl border-2 border-dashed transition-all duration-200 ease-in-out",
            "focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
            // Base styles
            !disabled && "cursor-pointer hover:border-primary/50",
            // Drag states
            isDragOver &&
              isValidDrag &&
              "border-primary bg-primary/5 scale-[1.02]",
            isDragOver && !isValidDrag && "border-destructive bg-destructive/5",
            // Error state
            errorMessage && "border-destructive",
            // Disabled state
            disabled && "opacity-50 cursor-not-allowed",
            // Default state
            !isDragOver &&
              !errorMessage &&
              "border-muted-foreground/25 bg-muted/5"
          )}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <div className="p-8">
            {value ? (
              // File selected state
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start space-x-3 flex-1 min-w-0">
                    {getFileIcon(value)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {value.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(value.size)}
                      </p>
                    </div>
                  </div>
                  {!disabled && (
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="p-1 rounded-full hover:bg-muted transition-colors flex-shrink-0 mt-0.5"
                      aria-label="Remove file"
                    >
                      <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              // Empty state
              <div className="text-center space-y-4">
                <div
                  className={cn(
                    "mx-auto w-12 h-12 rounded-full flex items-center justify-center transition-colors",
                    isDragOver &&
                      isValidDrag &&
                      "bg-primary text-primary-foreground",
                    isDragOver &&
                      !isValidDrag &&
                      "bg-destructive text-destructive-foreground",
                    !isDragOver && "bg-muted text-muted-foreground"
                  )}
                >
                  <CloudUpload className="w-6 h-6" />
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">
                    {isDragOver
                      ? isValidDrag
                        ? "Drop your file here"
                        : "File type not supported"
                      : "Drag and drop your file here"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    or{" "}
                    <span className="text-primary font-medium">
                      click to browse
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Progress indicator for drag state */}
          {isDragOver && (
            <div className="absolute inset-0 rounded-xl border-2 border-primary animate-pulse pointer-events-none" />
          )}
        </div>
      ) : (
        // Button variant
        <SidebarMenuButton
          tooltip={"Upload"}
          onClick={(e) => {
            e.preventDefault();
            handleClick();
          }}
          className="w-full"
        >
          <CloudUpload style={iconStyle} />
          Upload
        </SidebarMenuButton>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        id={id}
        className="sr-only"
        onChange={handleFileChange}
        accept={accept}
        disabled={disabled}
      />
    </div>
  );
}
