"use client";

import { useState } from "react";
import { getInitials, getAvatarBg } from "@/lib/utils";

interface RepPhotoProps {
  name: string;
  photoUrl?: string;
  photoPlaceholder: string;
  size?: "sm" | "md";
  className?: string;
}

export function RepPhoto({
  name,
  photoUrl,
  photoPlaceholder,
  size = "md",
  className = "",
}: RepPhotoProps) {
  const [imgError, setImgError] = useState(false);
  const sizeClass = size === "md" ? "w-16 h-16 text-xl" : "w-14 h-14 text-lg";

  if (photoUrl && !imgError) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photoUrl}
        alt={name}
        loading="lazy"
        onError={() => setImgError(true)}
        className={`rounded-full object-cover object-top shrink-0 ${sizeClass} ${className}`}
      />
    );
  }

  return (
    <div
      className={`rounded-full ${getAvatarBg(photoPlaceholder)} flex items-center justify-center text-white font-bold shrink-0 ${sizeClass} ${className}`}
      aria-label={`Initials of ${name}`}
    >
      {getInitials(name)}
    </div>
  );
}
