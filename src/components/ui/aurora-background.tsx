"use client";

import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode;
  showRadialGradient?: boolean;
}

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) => {
  return (
    <div
      className={cn(
        "relative flex flex-col w-full bg-zinc-950 dark:bg-zinc-950 text-slate-50 transition-bg",
        className
      )}
      {...props}
    >
      {/* Aurora Gradient Background - DESKTOP ONLY */}
      <div className="absolute inset-0 overflow-hidden opacity-40 pointer-events-none hidden sm:block" aria-hidden="true" style={{ zIndex: 0 }}>
        <div
          className="absolute inset-[-100%] aurora-animate-1"
          style={{
            background: `
              repeating-linear-gradient(100deg, 
                #8b5cf6 10%, 
                #3b82f6 15%, 
                #ec4899 20%, 
                #8b5cf6 25%, 
                #3b82f6 30%)
            `,
            backgroundSize: "300% 100%",
            filter: "blur(60px)",
            willChange: "background-position",
            transform: "translate3d(0, 0, 0)",
            backfaceVisibility: "hidden" as const,
            WebkitBackfaceVisibility: "hidden" as const,
          }}
        />
        <div
          className="absolute inset-[-10px] aurora-animate-2"
          style={{
            background: `
              repeating-linear-gradient(100deg, 
                rgba(139, 92, 246, 0.1) 0%, 
                rgba(139, 92, 246, 0.1) 7%, 
                transparent 10%, 
                transparent 12%, 
                rgba(139, 92, 246, 0.1) 16%),
              repeating-linear-gradient(100deg, 
                #8b5cf6 10%, 
                #3b82f6 15%, 
                #ec4899 20%, 
                #8b5cf6 25%, 
                #3b82f6 30%)
            `,
            backgroundSize: "200%, 100%",
            backgroundPosition: "50% 50%, 50% 50%",
            mixBlendMode: "difference",
            willChange: "background-position",
            transform: "translate3d(0, 0, 0)",
            backfaceVisibility: "hidden" as const,
            WebkitBackfaceVisibility: "hidden" as const,
          }}
        />
      </div>

      {/* Vignette Overlay - DESKTOP ONLY */}
      <div
        className="absolute inset-0 pointer-events-none hidden sm:block"
        style={{
          background: "radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.5) 100%)",
          zIndex: 1,
        }}
        aria-hidden="true"
      />

      {/* Content Layer */}
      <div className="relative w-full" style={{ zIndex: 10 }}>
        {children}
      </div>
    </div>
  );
};