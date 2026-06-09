"use client";

import React, { useCallback, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RenderEmptyState } from "@/components/file-uploader/RenderState";
import { toast } from "sonner";

interface UploaderState {
  id: string | null;
  file: File | null;
  uploading: boolean;
  progress: number;
  key?: string;
  isDeleting: boolean;
  error: boolean;
  objectUrl?: string;
  fileType: "image" | "video";
}

export function Uploader() {
  const [fileState, setFileState] = useState<FileRejection>(undefined);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log(acceptedFiles);
  }, []);

  function rejectedFiles(fileRejection: FileRejection[]) {
    if (fileRejection.length) {
      const tooManyFiles = fileRejection.find(
        (rejection) => rejection.errors[0].code === "too-many-files",
      );

      const fileSizeTooBig = fileRejection.find(
        (rejection) => rejection.errors[0].code === "file-too-large",
      );

      if (tooManyFiles) {
        toast.error("Too many files have been selected.");
      }

      if (fileSizeTooBig) {
        toast.error("Size of the file is too big.");
      }
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
    multiple: false,
    maxSize: 5 * 1024 * 1024,
    onDropRejected: rejectedFiles,
  });

  return (
    <Card
      {...getRootProps()}
      className={cn(
        "relative border-2 border-dashed transition-colors duration-200 w-full h-64",

        isDragActive
          ? "border-primary bg-primary/10 border-solid"
          : "border-border hover:border-primary",
      )}
    >
      <CardContent
        className={"flex items-center justify-center h-full w-full p-4"}
      >
        <input {...getInputProps()} />

        <RenderEmptyState isDragActive={isDragActive} />
      </CardContent>
    </Card>
  );
}
