"use client";

import { useState, useRef, ChangeEvent, useEffect } from "react";
import Image from "next/image";
import { X, File, Image as ImageIcon, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FileUploadProps {
  label: string;
  accept?: string;
  maxSize?: number; // in MB
  currentFile?: string | null;
  onFileSelect: (fileOrUrl: File | string) => void;
  onFileRemove?: () => void;
  directory?: string;
  type?: "image" | "document";
  description?: string;
  className?: string;
}

// Helper function to upload file to Supabase
export async function uploadFileToSupabase(
  file: File,
  directory: string
): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("directory", directory);

  const response = await fetch("/api/admin/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Upload failed");
  }

  const data = await response.json();
  return data.url;
}

export function FileUpload({
  label,
  accept = "image/*",
  maxSize = 50,
  currentFile,
  onFileSelect,
  onFileRemove,
  type = "image",
  description,
  className = "",
}: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentFile || null);
  const [error, setError] = useState<string | null>(null);
  const [uploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update preview when currentFile changes
  useEffect(() => {
    setPreview(currentFile || null);
  }, [currentFile]);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    // Show preview for images
    if (type === "image" && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(file.name);
    }

    // Pass the file to parent (not the URL yet)
    onFileSelect(file);
  };

  const handleRemove = async () => {
    if (onFileRemove) {
      onFileRemove();
    }
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`space-y-2 ${className}`}
    >
      <label className="block mb-2 font-medium text-slate-900 text-sm">
        {label}
      </label>

      {description && (
        <p className="text-sm text-slate-600 mb-3">{description}</p>
      )}

      <div className="relative">
        <AnimatePresence mode="wait">
          {preview ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative border-2 border-slate-200 rounded-xl overflow-hidden bg-white shadow-lg"
            >
              {type === "image" && (preview.startsWith("http") || preview.startsWith("data:")) ? (
                <div className="relative w-full h-64 bg-slate-50">
                  <Image
                    src={preview}
                    alt="Preview"
                    fill
                    className="object-contain"
                    unoptimized={preview.startsWith("data:")}
                  />
                </div>
              ) : (
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-teal-50 to-blue-50">
                  <div className="p-3 bg-white rounded-xl shadow-sm">
                    <File className="w-6 h-6 text-teal-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-900 font-medium truncate">
                      {preview.split("/").pop()}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">PDF Document</p>
                  </div>
                </div>
              )}

              {/* Remove button */}
              {!uploading && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={handleRemove}
                  className="absolute top-3 right-3 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-all shadow-lg hover:shadow-xl z-10"
                  aria-label="Remove file"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              )}

              {/* Uploading overlay */}
              {uploading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center"
                >
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-teal-500 mx-auto mb-2" />
                    <p className="text-sm text-slate-900 font-medium">Uploading...</p>
                    <p className="text-xs text-slate-500 mt-1">Please wait</p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ) : (
            // Upload Area
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              type="button"
              onClick={handleClick}
              disabled={uploading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full border-2 border-dashed border-slate-300 hover:border-teal-400 rounded-xl p-10 text-center transition-all bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md group"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="p-4 bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl group-hover:from-teal-100 group-hover:to-blue-100 transition-colors">
                  {type === "image" ? (
                    <ImageIcon className="w-10 h-10 text-teal-600" />
                  ) : (
                    <File className="w-10 h-10 text-teal-600" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Click to upload
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    or drag and drop
                  </p>
                  <p className="text-xs text-slate-400 mt-2">
                    {accept.split(',').join(', ')} (max {maxSize}MB)
                  </p>
                </div>
              </div>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
          aria-label={label}
        />
      </div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl"
          >
            <X className="w-4 h-4 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Convenience components for specific use cases
export function ImageUpload(props: Omit<FileUploadProps, "type" | "accept">) {
  return (
    <FileUpload
      {...props}
      type="image"
      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
    />
  );
}

export function DocumentUpload(props: Omit<FileUploadProps, "type" | "accept">) {
  return (
    <FileUpload
      {...props}
      type="document"
      accept="application/pdf,.pdf"
    />
  );
}
