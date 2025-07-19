"use client";

import { useEffect, useState } from "react";
import { useFileViewer } from "@/hooks/use-file-viewer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { type File } from "@/lib/db/schema";
import { Image, Video } from "@imagekit/next";
import Link from "next/link";

// Viewer for Image files
function ImageFileViewer({ file }: { file: File }) {
  if (!file.fileUrl) return null;

  return (
    <div className="relative aspect-video w-full">
      <Image
        urlEndpoint={file.fileUrl}
        src={file.fileUrl}
        alt={file.name}
        fill
        className="object-contain"
      />
    </div>
  );
}

// Viewer for Video files
function VideoFileViewer({ file }: { file: File }) {
  if (!file.fileUrl) return null;

  return (
    <Video
      urlEndpoint={file.fileUrl}
      src={file.fileUrl}
      controls
      autoPlay
      object-contain
      className="w-full rounded-lg aspect-video"
    />
  );
}

// Viewer for Document files (PDF, TXT)
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
        className="w-full h-[80vh] border-0"
        title={file.name}
      />
    );
  }

  if (isTxt) {
    return (
      <pre className="w-full h-[80vh] overflow-auto bg-muted p-4 rounded-md text-sm whitespace-pre-wrap">
        <code>{textContent ?? "Loading..."}</code>
      </pre>
    );
  }

  return (
    <div className="text-center p-8">
      <p>Preview is not available for this file type.</p>
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

// Main component that decides which viewer to show
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
        return <p>Unsupported file type.</p>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-none flex flex-col p-4
        w-[calc(100vw-2rem)] md:p-6 md:w-[calc(100vw-5rem)]"
      >
        <DialogHeader>
        </DialogHeader>
        <div className="w-full max-w-none mt-2">{getViewer()}</div>
      </DialogContent>
    </Dialog>
  );
}
