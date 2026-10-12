"use client";

import * as React from "react";
import { CldUploadWidget } from "next-cloudinary";
import { UploadCloud, X, File as FileIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FileUploaderProps {
  onUpload: (result: { url: string; publicId: string; fileName: string; format: string }) => void;
  onRemove?: (publicId: string) => void;
  files?: { url: string; publicId: string; name?: string }[];
  multiple?: boolean;
  maxFiles?: number;
  accept?: "image" | "video" | "document" | "all";
  className?: string;
}

export function FileUploader({
  onUpload,
  onRemove,
  files = [],
  multiple = false,
  maxFiles = 5,
  accept = "all",
  className,
}: FileUploaderProps) {
  const resourceType = accept === "all" ? "auto" : accept === "document" ? "raw" : accept;
  
  return (
    <div className={cn("space-y-4", className)}>
      {(!multiple && files.length === 0) || multiple ? (
        <CldUploadWidget
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "unsigned_preset"}
          options={{
            maxFiles: multiple ? maxFiles : 1,
            resourceType: resourceType,
            clientAllowedFormats:
              accept === "image"
                ? ["png", "jpeg", "jpg", "webp"]
                : accept === "video"
                ? ["mp4", "mov", "webm"]
                : accept === "document"
                ? ["pdf", "doc", "docx"]
                : undefined,
          }}
          onSuccess={(result: any) => {
            if (result.info) {
              onUpload({
                url: result.info.secure_url,
                publicId: result.info.public_id,
                fileName: result.info.original_filename,
                format: result.info.format,
              });
            }
          }}
        >
          {({ open }) => {
            return (
              <div
                onClick={() => open()}
                className="cursor-pointer flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg bg-muted/20 hover:bg-muted/50 transition-colors"
              >
                <div className="p-3 bg-primary/10 text-primary rounded-full mb-3">
                  <UploadCloud className="h-6 w-6" />
                </div>
                <p className="text-sm font-medium">Click to upload files</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {accept === "image" ? "Images up to 5MB" : accept === "video" ? "Videos up to 50MB" : "Files up to 10MB"}
                </p>
              </div>
            );
          }}
        </CldUploadWidget>
      ) : null}

      {files.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {files.map((file) => (
            <div key={file.publicId} className="relative group rounded-md overflow-hidden border">
              {file.url.match(/\.(jpeg|jpg|gif|png|webp)/i) || file.url.includes("/image/upload/") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={file.url}
                  alt={file.name || "Upload"}
                  className="w-full h-24 object-cover"
                />
              ) : file.url.match(/\.(mp4|mov|webm)/i) || file.url.includes("/video/upload/") ? (
                <video src={file.url} className="w-full h-24 object-cover" />
              ) : (
                <div className="w-full h-24 flex flex-col items-center justify-center bg-muted">
                  <FileIcon className="h-8 w-8 text-muted-foreground mb-2" />
                  <span className="text-xs text-center px-2 truncate w-full" title={file.name}>
                    {file.name || "Document"}
                  </span>
                </div>
              )}
              {onRemove && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(file.publicId);
                  }}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
