"use client";

import React, { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";

interface SafeImageProps extends Omit<ImageProps, "src"> {
  src: string | null | undefined;
  fallbackSrc?: string;
}

const DEFAULT_FALLBACK = "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80";

function sanitizeImageSrc(url: unknown): string | null {
  if (typeof url !== "string") return null;
  let trimmed = url.trim();
  if (!trimmed) return null;

  // If pointing to backend assets directory on localhost, use local Next.js /assets/ directly
  if (trimmed.includes("localhost:5153/assets/")) {
    trimmed = trimmed.replace(/^https?:\/\/localhost:5153/, "");
  }

  // If it's a backend upload, ensure it has the host if needed
  if (trimmed.startsWith("/uploads/")) {
    trimmed = `http://localhost:5153${trimmed}`;
  }

  // Ensure spaces in path are URL encoded for Next.js Image component
  if (trimmed.startsWith("/") || trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    try {
      // Avoid double encoding if already encoded
      return encodeURI(decodeURI(trimmed));
    } catch {
      return trimmed;
    }
  }

  return trimmed;
}

export function SafeImage({ src, fallbackSrc = DEFAULT_FALLBACK, alt, ...props }: SafeImageProps) {
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
  }, [src]);

  const sanitized = sanitizeImageSrc(src);
  const finalSrc = !sanitized || error ? fallbackSrc : sanitized;

  return (
    <Image
      {...props}
      src={finalSrc}
      alt={alt || ""}
      onError={() => {
        setError(true);
      }}
    />
  );
}
