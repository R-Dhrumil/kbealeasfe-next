"use client";

import React, { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";

interface SafeImageProps extends Omit<ImageProps, "src"> {
  src: string | null | undefined;
  fallbackSrc?: string;
}

const DEFAULT_FALLBACK = "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80";

export function SafeImage({ src, fallbackSrc = DEFAULT_FALLBACK, alt, ...props }: SafeImageProps) {
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
  }, [src]);

  // If src is falsy or missing, or if it errored out, use the fallback.
  const finalSrc = !src || error ? fallbackSrc : src;

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
