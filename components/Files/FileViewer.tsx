"use client";

import { useEffect, useState } from "react";
import { useFileViewer } from "@/hooks/use-file-viewer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog";
import { type File } from "@/lib/db/schema";
import { Image, Video } from "@imagekit/next";
import Link from "next/link";
import { X } from "lucide-react";

function ImageFileViewer({ file }: { file: File }) {
  if (!file.fileUrl) return null;
  return (
    <div className="relative">
      <Image
        urlEndpoint={file.fileUrl}
        src={file.fileUrl}
        alt={file.name}
        width={1920}
        height={1080}
        className="w-auto h-auto max-h-[90vh] mx-auto object-contain"
      />
    </div>
  );
}

function VideoFileViewer({ file }: { file: File }) {
  if (!file.fileUrl) return null;
  return (
    <div className="relative">
      <Video
        urlEndpoint={file.fileUrl}
        src={file.fileUrl}
        controls
        autoPlay
        className="w-auto h-auto max-h-[90vh] mx-auto object-contain"
      />
    </div>
  );
}

function DocumentFileViewer({ file }: { file: File }) {
  const [textContent, setTextContent] = useState<string | null>(null);
  const isPdf = file.name.toLowerCase().endsWith(".pdf");
  const isTxt = file.name.toLowerCase().endsWith(".txt");

  useEffect(() => {
    if (isTxt && file.fileUrl) {
      fetch(file.fileUrl)
        .then((res) => res.text())
        .then(setTextContent)
        .catch(() => setTextContent("Failed to load file content."));
    }
  }, [file.fileUrl, isTxt]);

  if (isPdf) {
    return (
      <iframe
        src={file.fileUrl}
        className="w-full h-full border-0"
        title={file.name}
      />
    );
  }

  if (isTxt) {
    return (
      <div className="w-full h-full bg-muted text-muted-foreground p-4">
        <pre className="w-full h-full overflow-auto text-sm whitespace-pre-wrap">
          <code>{textContent ?? "Loading..."}</code>
        </pre>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-background">
      <p className="mb-4">Preview is not available for this file type.</p>
      <Link
        href={file.fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline"
      >
        Download File
      </Link>
    </div>
  );
}

export function FileViewer() {
  const { isOpen, file, onClose } = useFileViewer();

  if (!file) {
    return null;
  }

  const getViewer = () => {
    switch (file.type) {
      case "image":
        return <ImageFileViewer file={file} />;
      case "video":
        return <VideoFileViewer file={file} />;
      case "document":
        return <DocumentFileViewer file={file} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-background">
            <p className="mb-4">Preview is not available for this file type.</p>
            <Link
              href={file.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Download File
            </Link>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent variant="fullscreen">
        <DialogHeader className="p-2 flex-row justify-between items-center bg-transparent absolute top-0 left-0 w-full z-10 h-14">
          <DialogTitle className="text-sm truncate px-2">
            {file.name}
          </DialogTitle>
          <DialogClose className="rounded-sm bg-accent opacity-80 hover:opacity-100">
            <X className="h-6 w-6" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        <div className="w-full h-full pt-14">{getViewer()}</div>
      </DialogContent>
    </Dialog>
  );
}
