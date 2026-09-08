"use client";

import { ReactLenis } from "lenis/react";
import { type ReactNode } from "react";
import { shouldUseSmoothScroll } from "@/lib/performance";

type SmoothScrollProviderProps = {
  children: ReactNode;
};

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  if (typeof window !== "undefined" && !shouldUseSmoothScroll()) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.12,
        smoothWheel: true,
        syncTouch: false,
        wheelMultiplier: 0.9,
      }}
    >
      {children}
    </ReactLenis>
  );
}

export default SmoothScrollProvider;
