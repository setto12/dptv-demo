"use client";

import Image from "next/image";
import Link from "next/link";

import { useBranding } from "@/context/BrandingContext";

export default function AppLogo({
  href = "/",
  width = 160,
  height = 48,
  className = "",
}) {
  const { branding, loading } = useBranding();

  const logo = branding.logo_url;

  if (loading) {
    return (
      <div
        className={`h-10 w-32 animate-pulse rounded-md bg-gray-200 ${className}`}
      />
    );
  }

  if (!logo) {
    return (
      <Link
        href={href}
        className={`font-semibold ${className}`}
      >
        {branding.app_name}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={`inline-flex items-center ${className}`}
    >
      <Image
        src={logo}
        alt={branding.app_name}
        width={width}
        height={height}
        className="h-auto max-h-12 w-auto object-contain"
        priority
      />
    </Link>
  );
}