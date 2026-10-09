"use client";

import React, { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";

interface SafeImageProps extends Omit<ImageProps, "src"> {
  src: string | null | undefined;
  fallbackSrc?: string;
}

const DEFAULT_FALLBACK = "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80";

function isValidUrlOrPath(url: unknown): boolean {
  if (typeof url !== "string") return false;
  const trimmed = url.trim();
  if (!trimmed) return false;
  return (
    trimmed.startsWith("/") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:image/") ||
    trimmed.startsWith("blob:")
  );
}

export function SafeImage({ src, fallbackSrc = DEFAULT_FALLBACK, alt, ...props }: SafeImageProps) {
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
  }, [src]);

  const hasValidSrc = isValidUrlOrPath(src);
  const finalSrc = !hasValidSrc || error ? fallbackSrc : (src as string);

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
