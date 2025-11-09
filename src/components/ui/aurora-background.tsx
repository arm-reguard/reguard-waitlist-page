"use client";

import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";
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
  return (
    <div
      className={cn(
        "relative flex flex-col w-full bg-zinc-950 dark:bg-zinc-950 text-slate-50 transition-bg",
        className
      )}
      {...props}
    >
      {/* Aurora Gradient Background */}
      <div className="absolute inset-0 overflow-hidden opacity-40" aria-hidden="true">
        <motion.div
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
            filter: "blur(80px)",
            willChange: "background-position",
            transform: "translateZ(0)",
          }}
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
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
            willChange: "background-position",
            transform: "translateZ(0)",
          }}
          animate={{
            backgroundPosition: [
              "50% 50%, 50% 50%",
              "100% 50%, 150% 50%",
              "50% 50%, 50% 50%",
            ],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Vignette Overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.8) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Content Layer */}
      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  );
};