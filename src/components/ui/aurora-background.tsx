"use client";

import { cn } from "@/lib/utils";
import React, { ReactNode, useState, useEffect } from "react";
import { motion } from "framer-motion";

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
  const [hasMounted, setHasMounted] = useState(false);
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    setHasMounted(true);

    if (typeof window === "undefined") return;

    let cancelled = false;
    let rafId = 0;
    const startAnimation = () => {
      if (cancelled) return;
      rafId = window.requestAnimationFrame(() => {
        if (!cancelled) setIsAnimated(true);
      });
    };

    if (document.readyState === "complete") {
      startAnimation();
    } else {
      window.addEventListener("load", startAnimation, { once: true });
    }

    const safetyTimeout = window.setTimeout(startAnimation, 1500);

    return () => {
      cancelled = true;
      window.removeEventListener("load", startAnimation);
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(safetyTimeout);
    };
  }, []);

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
        {hasMounted && (
          <>
            {isAnimated ? (
              <>
                <motion.div
                  className="absolute inset-[-100%]"
                  initial={false}
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 50,
                    ease: "linear",
                    repeat: Infinity,
                    repeatType: "loop",
                  }}
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
                    backgroundPosition: "0% 50%",
                    filter: "blur(60px)",
                  }}
                />
                <motion.div
                  className="absolute inset-[-10px]"
                  initial={false}
                  animate={{
                    backgroundPosition: [
                      "50% 50%, 50% 50%",
                      "100% 50%, 150% 50%",
                      "50% 50%, 50% 50%",
                    ],
                  }}
                  transition={{
                    duration: 60,
                    ease: "linear",
                    repeat: Infinity,
                    repeatType: "loop",
                  }}
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
                  }}
                />
              </>
            ) : (
              <>
                <div
                  className="absolute inset-[-100%]"
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
                    backgroundPosition: "0% 50%",
                    filter: "blur(60px)",
                  }}
                />
                <div
                  className="absolute inset-[-10px]"
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
                  }}
                />
              </>
            )}
          </>
        )}
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