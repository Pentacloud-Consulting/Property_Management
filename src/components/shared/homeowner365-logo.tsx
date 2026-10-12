"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface HomeOwner365LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "dark" | "light" | "auto";
  href?: string;
  showTagline?: boolean;
  iconOnly?: boolean;
}

export function HomeOwner365Logo({
  className,
  size = "md",
  variant = "auto",
  href,
  showTagline = false,
  iconOnly = false,
}: HomeOwner365LogoProps) {
  const isLight = variant === "light";

  const sizeStyles = {
    sm: { height: 26, width: 172, imgClass: "h-[26px]" },
    md: { height: 34, width: 226, imgClass: "h-[34px]" },
    lg: { height: 42, width: 280, imgClass: "h-[42px]" },
    xl: { height: 52, width: 345, imgClass: "h-[52px]" },
  };

  const iconSizes = {
    sm: { size: 28, class: "w-7 h-7" },
    md: { size: 36, class: "w-9 h-9" },
    lg: { size: 44, class: "w-11 h-11" },
    xl: { size: 56, class: "w-14 h-14" },
  };

  if (iconOnly) {
    const iconContent = (
      <div className={cn("inline-flex items-center group select-none shrink-0", className)}>
        <Image
          src="/logo-icon.png"
          alt="HomeOwner365 Logo"
          width={iconSizes[size].size}
          height={iconSizes[size].size}
          className={cn(iconSizes[size].class, "object-contain transition-transform duration-300 group-hover:scale-105")}
          priority
        />
      </div>
    );
    if (href) {
      return (
        <Link href={href} className="inline-flex items-center shrink-0">
          {iconContent}
        </Link>
      );
    }
    return iconContent;
  }

  const logoSrc = isLight ? "/logo-horizontal-light.png" : "/logo-horizontal.png";

  const content = (
    <div className={cn("inline-flex items-center group select-none", className)}>
      <Image
        src={logoSrc}
        alt="HomeOwner365"
        width={sizeStyles[size].width}
        height={sizeStyles[size].height}
        className={cn(sizeStyles[size].imgClass, "w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]")}
        priority
      />
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center">
        {content}
      </Link>
    );
  }

  return content;
}
