"use client";

import React, { useCallback, useEffect, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  RenderedUploadedState,
  RenderEmptyState,
  RenderErrorState,
  RenderUploadingState,
} from "@/components/file-uploader/RenderState";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

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

interface UploaderProps {
  value?: string;
  onChange?: (value: string) => void;
}

export function Uploader({ value, onChange }: UploaderProps) {
  const [fileState, setFileState] = useState<UploaderState>({
    error: false,
    file: null,
    id: null,
    uploading: false,
    progress: 0,
    isDeleting: false,
    fileType: "image",
    key: value,
  });

  const uploadFile = useCallback(
    async (file: File) => {
      setFileState((prev) => ({
        ...prev,
        uploading: true,
        progress: 0,
      }));

      try {
        //get prisigned url

        const presignedResponse = await fetch("/api/s3/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: file.name,
            contentType: file.type,
            size: file.size,
            isImage: true,
          }),
        });

        if (!presignedResponse.ok) {
          toast.error("Failed to presigned URL.");
          setFileState((prev) => ({
            ...prev,
            uploading: false,
            progress: 0,
            error: true,
          }));

          return;
        }

        const { presignedUrl, key } = await presignedResponse.json();

        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();

          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const percentageCompleted = (event.loaded / event.total) * 100;

              setFileState((prev) => ({
                ...prev,
                progress: Math.round(percentageCompleted),
              }));
            }
          };

          xhr.onload = () => {
            if (xhr.status === 200 || xhr.status === 204) {
              setFileState((prev) => ({
                ...prev,
                progress: 100,
                uploading: false,
                key: key,
              }));

              toast.success("File uploaded successfully");

              onChange?.(key);

              resolve();
            } else {
              reject(new Error("Upload failed."));
            }
          };

          xhr.onerror = () => {
            reject(new Error("Upload failed."));
          };

          xhr.open("PUT", presignedUrl);

          xhr.setRequestHeader("Content-Type", file.type);

          xhr.send(file);
        });
      } catch {
        toast.error("Something went wrong.");

        setFileState((prev) => ({
          ...prev,
          uploading: false,
          progress: 0,
          error: true,
        }));
      }
    },
    [onChange],
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];

        if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
          URL.revokeObjectURL(fileState.objectUrl!);
        }

        setFileState({
          file: file,
          uploading: false,
          progress: 0,
          objectUrl: URL.createObjectURL(file),
          error: false,
          id: uuidv4(),
          isDeleting: false,
          fileType: "image",
        });

        uploadFile(file);
      }
    },
    [fileState.objectUrl, uploadFile],
  );

  const handleRemoveFile = async () => {
    if (fileState.isDeleting || !fileState.objectUrl) return;

    try {
      setFileState((prev) => ({
        ...prev,
        isDeleting: true,
      }));

      const response = await fetch("/api/s3/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ key: fileState.key }),
      });

      if (!response.ok) {
        toast.error("Failed to delete file.");
        setFileState((prev) => ({
          ...prev,
          isDeleting: true,
          error: true,
        }));

        return;
      }

      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl!);
      }

      onChange?.("");

      setFileState((prev) => ({
        ...prev,
        uploading: false,
        progress: 0,
        objectUrl: undefined,
        error: false,
        fielType: "image",
        id: null,
        isDeleting: false,
      }));

      toast.success("File deleted successfully.");
    } catch {
      toast.error("Failed to delete file.");

      setFileState((prev) => ({
        ...prev,
        isDeleting: false,
        error: true,
      }));
    }
  };

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

  const rednerContent = () => {
    if (fileState.uploading) {
      return <RenderUploadingState progress={fileState.progress} file={fileState.file!} />;
    }

    if (fileState.error) {
      return <RenderErrorState />;
    }

    if (fileState.objectUrl) {
      return (
        <RenderedUploadedState
          previewurl={fileState.objectUrl}
          isDeleting={fileState.isDeleting}
          handleRemoveFile={handleRemoveFile}
        ></RenderedUploadedState>
      );
    }

    return <RenderEmptyState isDragActive={isDragActive} />;
  };

  useEffect(() => {
    return () => {
      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl!);
      }
    };
  }, [fileState.objectUrl]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
    multiple: false,
    maxSize: 5 * 1024 * 1024,
    onDropRejected: rejectedFiles,
    disabled: fileState.uploading || !!fileState.objectUrl,
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
      <CardContent className={"flex items-center justify-center h-full w-full p-4"}>
        <input {...getInputProps()} />

        {rednerContent()}
      </CardContent>
    </Card>
  );
}
