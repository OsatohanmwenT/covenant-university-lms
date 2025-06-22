"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface FileUploadProps {
  type: string;
  accept: string;
  placeholder: string;
  folder: string;
  onFileChange: (url: string) => void;
  value?: string;
}

const FileUpload = ({
  type,
  accept,
  placeholder,
  folder,
  onFileChange,
  value,
}: FileUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState<string>("");

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsUploading(true);
    
    try {
      // In a real application, this would upload to a server
      // Here, we'll simulate it and return a placeholder URL
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate upload delay
      
      // Generate a placeholder URL for demo purposes
      const url = `https://placeholders.com/${folder}/${file.name}`;
      
      onFileChange(url);
      setIsUploading(false);
    } catch (error) {
      console.error("Upload failed:", error);
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <label
          htmlFor="file-upload"
          className="cursor-pointer bg-secondary text-secondary-foreground hover:bg-secondary/80 text-sm px-4 py-2 rounded-md"
        >
          Choose file
        </label>
        <Input
          id="file-upload"
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleUpload}
        />
        <div className="text-sm">
          {isUploading ? (
            <div className="flex items-center">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Uploading...
            </div>
          ) : fileName || value ? (
            <span className="text-primary">
              {fileName || value.split("/").pop()}
            </span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </div>
      </div>
      {value && type === "image" && (
        <div className="relative h-40 w-40 rounded-md overflow-hidden border">
          <img
            src={value}
            alt="Preview"
            className="object-cover w-full h-full"
          />
        </div>
      )}
    </div>
  );
};

export default FileUpload;
