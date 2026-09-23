"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";

export default function BrandingLogoUpload({
  logoUrl,
  onUploaded,
}) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  async function handleFileChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Logo must be smaller than 5 MB.");
      event.target.value = "";
      return;
    }

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/webp",
      "image/svg+xml",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error(
        "Please upload a PNG, JPG, WEBP, or SVG image."
      );
      event.target.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("logo", file);

    setUploading(true);

    try {
      const response = await fetch(
        "/api/admin/branding/logo",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to upload logo."
        );
      }

      onUploaded(data.logo_url);

      toast.success("Logo uploaded.");
    } catch (error) {
      console.error("Logo upload failed:", error);

      toast.error(
        error.message || "Failed to upload logo."
      );
    } finally {
      setUploading(false);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[var(--color-text)]">
        Application Logo
      </label>

      <div className="flex min-h-40 items-center justify-center rounded-lg border border-dashed border-[var(--color-border)] bg-[var(--color-background)] p-6">
        {logoUrl ? (
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-20 w-64 items-center justify-center rounded-lg bg-[var(--color-surface)] p-3">
              <Image
                src={logoUrl}
                alt="Application logo"
                width={240}
                height={70}
                className="max-h-16 w-auto object-contain"
              />
            </div>

            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="
                inline-flex
                items-center
                gap-2
                rounded-lg
                border
                border-[var(--color-border)]
                px-4
                py-2
                text-sm
                font-medium
                text-[var(--color-text)]
                transition
                hover:bg-[var(--color-background)]
                disabled:opacity-60
              "
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}

              Change Logo
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="
              flex
              flex-col
              items-center
              gap-3
              text-[var(--color-text-muted)]
              transition
              hover:text-[var(--color-text)]
              disabled:opacity-60
            "
          >
            {uploading ? (
              <Loader2 className="h-8 w-8 animate-spin" />
            ) : (
              <ImagePlus className="h-8 w-8" />
            )}

            <span className="text-sm font-medium">
              {uploading
                ? "Uploading..."
                : "Upload Logo"}
            </span>

            <span className="text-xs">
              PNG, JPG, WEBP, or SVG up to 5 MB
            </span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}