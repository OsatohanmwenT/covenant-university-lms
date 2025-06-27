"use client";

import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
  ImageKitProvider,
} from "@imagekit/next";
import Image from "next/image";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import config from "@/lib/config";

interface Props {
  type: "image" | "video";
  accept: string;
  placeholder: string;
  folder: string;
  variant: "light" | "dark";
  value?: string;
  onFileChange: (filePath: string | undefined) => void;
}

const FileUpload = ({
  type,
  accept,
  placeholder,
  folder,
  variant,
  onFileChange,
  value,
}: Props) => {
  const [progress, setProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<{
    filePath: string | undefined;
  }>({
    filePath: value ?? undefined,
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortController = new AbortController();

  const styles = {
    button:
      variant === "dark"
        ? "bg-dark-300"
        : "bg-light-700 border-gray-100 border",
    placeholder: variant === "dark" ? "text-light-100" : "text-slate-500",
    text: variant === "dark" ? "text-light-100" : "text-dark-400",
  };

  const authenticator = async () => {
    try {
      const response = await fetch(`/api/auth/imagekit`);
      const data = await response.json();
      const { signature, expire, token, publicKey } = data;
      return { signature, expire, token, publicKey };
    } catch {
      toast.error("Authentication failed");
      throw new Error("Upload authentication failed");
    }
  };

  const handleFileSelect = () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    // Set preview immediately
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleUpload = async () => {
    const fileInput = fileInputRef.current;
    if (!fileInput?.files?.length) {
      toast.error("Please select a file to upload");
      return;
    }

    const file = fileInput.files[0];

    if (type === "image" && file.size > 20 * 1024 * 1024) {
      toast.error("Image must be less than 20MB");
      return;
    }

    let authParams;
    try {
      authParams = await authenticator();
    } catch {
      return;
    }

    setProgress(0);

    try {
      const uploadResponse = await upload({
        ...authParams,
        file,
        fileName: file.name,
        folder,
        onProgress: (event) => {
          setProgress(Math.round((event.loaded / event.total) * 100));
        },
        abortSignal: abortController.signal,
      });

      setUploadedFile({ filePath: uploadResponse.filePath });
      console.log("Upload Response:", uploadResponse.url);  
      onFileChange(uploadResponse.url);

      toast.success(`${uploadResponse.name} uploaded successfully`);
    } catch (error) {
      let message = "Upload failed. Please try again.";
      if (error instanceof ImageKitAbortError) message = "Upload aborted.";
      if (error instanceof ImageKitInvalidRequestError) message = error.message;
      if (error instanceof ImageKitUploadNetworkError)
        message = "Network issue during upload.";
      if (error instanceof ImageKitServerError)
        message = "ImageKit server error.";

      toast.error(message);
      console.error("Upload Error:", error);
    }
  };

  // Create a safe URL for the preview image, with a fallback for placeholder URLs
  const getImageUrl = (path?: string): string => {
    if (!path) return "/images/placeholder-image.jpg"; // Add a default placeholder in your public folder

    // If it's already a full URL that isn't from placeholders.com
    if (path.startsWith("http") && !path.includes("placeholders.com")) {
      return path;
    }

    // If it's from ImageKit
    if (path && config?.env?.imagekit?.urlEndpoint) {
      return `${config.env.imagekit.urlEndpoint}/${path}`;
    }

    // Default fallback
    return "/images/placeholder-image.jpg";
  };


  return (
    <ImageKitProvider urlEndpoint={config.env.imagekit.urlEndpoint || ""}>
      <div className="flex flex-col gap-2">
        <input
          type="file"
          ref={fileInputRef}
          accept={accept}
          className="hidden"
          onChange={handleFileSelect}
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            fileInputRef.current?.click();
          }}
          className={cn("upload-btn", styles.button)}
        >
          <Image src="/icons/upload.svg" alt="upload" width={20} height={20} />
          <p className={cn("text-base", styles.placeholder)}>{placeholder}</p>
          {uploadedFile.filePath && (
            <p className={cn("upload-filename", styles.text)}>
              {uploadedFile.filePath.split("/").pop()}
            </p>
          )}
        </button>

        <button
          type="button"
          onClick={handleUpload}
          className={cn("upload-btn", styles.button)}
        >
          Upload file
        </button>

        {progress > 0 && progress !== 100 && (
          <div className="w-full bg-gray-200 rounded">
            <div
              className="bg-green-500 text-white px-2 py-1 text-xs rounded"
              style={{ width: `${progress}%` }}
            >
              {progress}%
            </div>
          </div>
        )}

        {(previewUrl || uploadedFile.filePath) && (
          <div className="relative w-full h-[200px] mt-2">
            <Image
              src={previewUrl || getImageUrl(uploadedFile.filePath)}
              alt="Preview"
              fill
              className="object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/images/placeholder-image.jpg";
              }}
            />
          </div>
        )}
      </div>
    </ImageKitProvider>
  );
};

export default FileUpload;
