"use client";

import React from "react";
import { useTheme } from "@/components/providers/ThemeProvider";

interface IdeaBinBrandProps {
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  taglineSize?: "sm" | "md";
  className?: string;
}

export const IdeaBinBrand: React.FC<IdeaBinBrandProps> = ({
  size = "md",
  showTagline = false,
  taglineSize = "sm",
  className = "",
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Emblem dimensions based on size
  const emblemSizes = {
    sm: "h-5 sm:h-6 w-auto",
    md: "h-7 sm:h-8 w-auto",
    lg: "h-9 sm:h-11 w-auto",
    xl: "h-12 sm:h-14 w-auto",
  };

  // Comfortaa wordmark font sizes
  const wordmarkSizes = {
    sm: "text-[16px] sm:text-[18px]",
    md: "text-[21px] sm:text-[23px]",
    lg: "text-[27px] sm:text-[30px]",
    xl: "text-[38px] sm:text-[44px]",
  };

  return (
    <div className={`flex flex-col select-none ${className}`}>
      {/* Tight gap between logo emblem and ideabin text */}
      <div className="flex items-center gap-1 sm:gap-1.5">
        {/* Fluid folded-ribbon 3D emblem */}
<img
           src="/ideabin_logo_black.png"
           alt="IdeaBin Logo Emblem"
           loading="lazy"
           className={`${emblemSizes[size]} object-contain flex-shrink-0 drop-shadow-[0_2px_10px_rgba(249,115,22,0.25)] transition-transform duration-300 group-hover:scale-105`}
         />

        {/* Wordmark: Comfortaa font with white idea + orange-gold gradient bin */}
        <div className="flex items-baseline leading-none font-comfortaa font-bold tracking-[-0.035em]">
          <span
            className={`${wordmarkSizes[size]} lowercase transition-colors duration-200 ${
              isDark ? "text-[#FFFFFF]" : "text-[#111111]"
            }`}
          >
            idea
          </span>
          <span
            className={`${wordmarkSizes[size]} lowercase bg-gradient-to-r from-[#FFDE59] via-[#FB923C] to-[#F97316] bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(249,115,22,0.35)]`}
          >
            bin
          </span>
        </div>
      </div>

      {/* Optional Brand Tagline */}
      {showTagline && (
        <div className="mt-1 pl-[2px]">
          <span
            className={`font-comfortaa font-semibold uppercase tracking-[0.22em] block leading-tight transition-colors duration-300 ${
              taglineSize === "sm" ? "text-[9px] sm:text-[10.5px]" : "text-[10.5px] sm:text-[12px]"
            } ${isDark ? "text-zinc-400" : "text-neutral-500"}`}
          >
            DIGITAL &amp; WEB TECH SOLUTIONS
          </span>
        </div>
      )}
    </div>
  );
};

export default IdeaBinBrand;
