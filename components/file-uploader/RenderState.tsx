import { CloudUploadIcon, ImageIcon, Loader, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function RenderEmptyState({ isDragActive }: { isDragActive: boolean }) {
  return (
    <div className={"text-center"}>
      <div
        className={
          "flex items-center mx-auto justify-center size-12 rounded-full bg-muted mb-4"
        }
      >
        <CloudUploadIcon
          className={cn("size-6 text-muted-foreground", isDragActive && "text-primary")}
        />
      </div>

      <p className={"text-base font-semibold text-foreground"}>
        Drop your files here or{" "}
        <span className={"font-bold text-primary cursor-pointer"}>Click to upload</span>
      </p>
    </div>
  );
}

export function RenderErrorState() {
  return (
    <div className={"text-center"}>
      <div
        className={
          "flex items-center mx-auto justify-center size-12 rounded-full bg-destructive/30 mb-4"
        }
      >
        <ImageIcon className={"size-6 text-destructive"} />
      </div>

      <p className={"text-base font-semibold"}>Upload Failed</p>
      <p className={"text-xs mt-1 text-muted-foreground"}>Something went wrong</p>
      <Button type={"button"} className={"mt-4"}>
        Retry to upload
      </Button>
    </div>
  );
}

export function RenderedUploadedState({
  previewurl,
  isDeleting,
  handleRemoveFile,
  fileType
}: {
  previewurl: string;
  isDeleting: boolean;
  handleRemoveFile: () => void;
  fileType: "image" | "video"
}) {
  return (
    <div className="relatve group w-full h-full flex items-center justify-center">

      {fileType === "video" ? (
        <video src={ previewurl} controls className="rounded-md w-full h-full" />
      ) : (
        <Image src={previewurl} alt={"uploaded preview"} fill className="object-contain p-2" />
      )}

      <Button
        variant={"destructive"}
        size="icon"
        className={cn("absolute top-4 right-4")}
        type="button"
        onClick={handleRemoveFile}
        disabled={isDeleting}
      >
        {isDeleting ? (
          <Loader className="size-4 animate-spin" />
        ) : (
          <XIcon className="size-4" />
        )}
      </Button>
    </div>
  );
}

export function RenderUploadingState({ progress, file }: { progress: number; file: File }) {
  return (
    <div className="text-center flex justify-center items-center flex-col">
      <p className="mt-2 text-sm font-medium text-foreground">Uploading... {progress}</p>

      <p className="mt-1 text-xs text-muted-foreground truncate max-w-xs">{file.name}</p>
    </div>
  );
}
