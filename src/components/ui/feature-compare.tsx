"use client";

import React, { useState, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { IconDotsVertical } from "@tabler/icons-react";

interface FeatureCompareProps {
  className?: string;
  slideMode?: "hover" | "drag";
}

const comparisons = [
  {
    leftTitle: "❌ ALERTS ONLY",
    leftSubheading: "Send alerts at 80%, 90%, 100%",
    leftExpanded: "→ Most monitoring tools send email alerts but don't physically stop API calls. You still get billed after hitting limits.",
    rightTitle: "✅ HARD LIMITS",
    rightSubheading: "Auto-blocks at 100%",
    rightExpanded: "→ Set $100, spend $100, never $101. Your API calls physically stop when budget hits. Hard protection, not soft alerts.",
  },
  {
    leftTitle: "❌ TOTAL SPEND",
    leftSubheading: "Show total spend only",
    leftExpanded: "→ Most tools show aggregate costs but can't break down spending by customer or feature. No visibility into who's costly.",
    rightTitle: "✅ COST ATTRIBUTION",
    rightSubheading: "Cost per customer & per feature",
    rightExpanded: "→ See exactly which customer or feature is expensive. Track costs at user-level, feature-level, or endpoint-level granularity.",
  },
  {
    leftTitle: "❌ TRACK ONLY",
    leftSubheading: "Monitor costs only",
    leftExpanded: "→ Tracking tools log your costs but don't actively reduce them through caching or optimization. Passive monitoring.",
    rightTitle: "✅ ACTIVE SAVINGS",
    rightSubheading: "Save 30-60% automatically",
    rightExpanded: "→ Response caching and format optimization automatically reduce token usage by 30-60% without changing your code or prompts.",
  },
  {
    leftTitle: "❌ TEST IN PROD",
    leftSubheading: "Test in production only",
    leftExpanded: "→ No safe environment to test prompts and preview costs before deploying to production. Risk surprise bills.",
    rightTitle: "✅ TEST PLAYGROUND",
    rightSubheading: "Catch issues before production deploy",
    rightExpanded: "→ Test prompts, see real costs, and catch issues in a safe sandbox before deploying to production. No surprise bills from tests.",
  },
];

export const FeatureCompare = ({ className, slideMode = "hover" }: FeatureCompareProps) => {
  const [sliderXPercent, setSliderXPercent] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!sliderRef.current) return;

      if (slideMode === "hover" || (slideMode === "drag" && isDragging)) {
        const rect = sliderRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const percent = (x / rect.width) * 100;

        requestAnimationFrame(() => {
          setSliderXPercent(Math.max(0, Math.min(100, percent)));
        });
      }
    },
    [slideMode, isDragging]
  );

  const handleStart = useCallback(
    (clientX: number) => {
      if (slideMode === "drag") {
        setIsDragging(true);
      }
    },
    [slideMode]
  );

  const handleEnd = useCallback(() => {
    if (slideMode === "drag") {
      setIsDragging(false);
    }
  }, [slideMode]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => handleStart(e.clientX),
    [handleStart]
  );

  const handleMouseUp = useCallback(() => handleEnd(), [handleEnd]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => handleMove(e.clientX),
    [handleMove]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      handleStart(e.touches[0].clientX);
    },
    [handleStart]
  );

  const handleTouchEnd = useCallback(() => {
    handleEnd();
  }, [handleEnd]);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      handleMove(e.touches[0].clientX);
    },
    [handleMove]
  );

  return (
    <div className={cn("w-full max-w-[900px] mx-auto", className)}>
      {/* Heading */}
      <div className="text-center" style={{ marginBottom: "40px" }}>
        <h2 className="font-bold text-white" style={{ fontSize: "clamp(28px, 6vw, 40px)", marginBottom: "40px" }}>
          What makes reGuard different
        </h2>
        <p className="text-zinc-400" style={{ fontSize: "clamp(16px, 3vw, 18px)", marginBottom: "40px" }}>
          Drag the slider to compare →
        </p>
      </div>

      {/* Compare Container */}
      <div
        ref={sliderRef}
        className="relative w-full h-[600px] sm:h-[700px] md:h-[750px] rounded-2xl overflow-hidden"
        style={{
          cursor: slideMode === "drag" ? "grab" : "col-resize",
          borderRadius: "16px",
        }}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleEnd}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
      >
        {/* Left Side - Other Tools - Clips from RIGHT, reveals more as slider moves RIGHT */}
        <motion.div
          className="absolute inset-0 flex flex-col rounded-l-2xl z-10"
          style={{
            backgroundColor: "#1a1a1d",
            border: "2px solid #ef4444",
            clipPath: `inset(0 ${100 - sliderXPercent}% 0 0)`,
            padding: "clamp(1.5rem, 4vw, 3rem)",
            pointerEvents: "auto",
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <h3 className="font-bold uppercase mb-6 sm:mb-8" style={{ color: "#ef4444", fontSize: "clamp(20px, 4vw, 24px)" }}>
            OTHER TOOLS
          </h3>
          <div className="flex-1 flex flex-col gap-4 sm:gap-6">
            {comparisons.map((comp, idx) => {
              // Calculate opacity for left expanded text: visible only when slider is < 40% (moved to left)
              const leftExpandedOpacity = sliderXPercent < 40 ? 1.0 : 0;
              const leftExpandedVisible = sliderXPercent < 40;
              
              return (
                <div key={idx}>
                  <div className="mb-2 sm:mb-3">
                    <h4 className="font-bold uppercase mb-2" style={{ color: "#ef4444", fontSize: "clamp(16px, 3vw, 18px)" }}>
                      {comp.leftTitle}
                    </h4>
                    <p className="text-white" style={{ fontSize: "clamp(14px, 2.5vw, 16px)", lineHeight: "1.6", marginBottom: "8px" }}>
                      {comp.leftSubheading}
                    </p>
                    <p 
                      className="text-white" 
                      style={{ 
                        fontSize: "clamp(12px, 2vw, 14px)", 
                        lineHeight: "1.6",
                        color: "rgba(255, 255, 255, 0.8)",
                        opacity: leftExpandedOpacity,
                        visibility: leftExpandedVisible ? "visible" : "hidden",
                        transition: "opacity 0.3s ease-in-out, visibility 0.3s ease-in-out",
                        marginTop: "16px"
                      }}
                    >
                      {comp.leftExpanded}
                    </p>
                  </div>
                  {idx < comparisons.length - 1 && (
                    <div className="h-px my-4 sm:my-6" style={{ backgroundColor: "rgba(239, 68, 68, 0.2)" }} />
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Right Side - reGuard - Clips from LEFT, reveals more as slider moves LEFT */}
        <motion.div
          className="absolute inset-0 flex flex-col rounded-r-2xl z-20"
          style={{
            backgroundColor: "#1a1a2e",
            border: "2px solid #8b5cf6",
            clipPath: `inset(0 0 0 ${sliderXPercent}%)`,
            padding: "clamp(1.5rem, 4vw, 3rem)",
            pointerEvents: "auto",
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <h3 className="font-bold uppercase mb-6 sm:mb-8" style={{ color: "#8b5cf6", fontSize: "clamp(20px, 4vw, 24px)" }}>
            reGuard
          </h3>
          <div className="flex-1 flex flex-col gap-4 sm:gap-6">
            {comparisons.map((comp, idx) => {
              // Calculate opacity for right expanded text: visible only when slider is > 60% (moved to right)
              const rightExpandedOpacity = sliderXPercent > 60 ? 1.0 : 0;
              const rightExpandedVisible = sliderXPercent > 60;
              
              return (
                <div key={idx}>
                  <div className="mb-2 sm:mb-3">
                    <h4 className="font-bold uppercase mb-2" style={{ color: "#8b5cf6", fontSize: "clamp(16px, 3vw, 18px)" }}>
                      {comp.rightTitle}
                    </h4>
                    <p className="text-white" style={{ fontSize: "clamp(14px, 2.5vw, 16px)", lineHeight: "1.6", marginBottom: "8px" }}>
                      {comp.rightSubheading}
                    </p>
                    <p 
                      className="text-white" 
                      style={{ 
                        fontSize: "clamp(12px, 2vw, 14px)", 
                        lineHeight: "1.6",
                        color: "rgba(255, 255, 255, 0.8)",
                        opacity: rightExpandedOpacity,
                        visibility: rightExpandedVisible ? "visible" : "hidden",
                        transition: "opacity 0.3s ease-in-out, visibility 0.3s ease-in-out",
                        marginTop: "16px"
                      }}
                    >
                      {comp.rightExpanded}
                    </p>
                  </div>
                  {idx < comparisons.length - 1 && (
                    <div className="h-px my-4 sm:my-6" style={{ backgroundColor: "rgba(139, 92, 246, 0.2)" }} />
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Slider Divider */}
        <AnimatePresence initial={false}>
          <motion.div
            className="h-full w-px absolute top-0 z-30 bg-gradient-to-b from-transparent from-[5%] to-[95%] via-purple-500 to-transparent"
            style={{
              left: `${sliderXPercent}%`,
              zIndex: 40,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="w-36 h-full [mask-image:radial-gradient(100px_at_left,white,transparent)] absolute top-1/2 -translate-y-1/2 left-0 bg-gradient-to-r from-purple-400 via-transparent to-transparent z-20 opacity-50" />
            <div className="w-10 h-1/2 [mask-image:radial-gradient(50px_at_left,white,transparent)] absolute top-1/2 -translate-y-1/2 left-0 bg-gradient-to-r from-violet-400 via-transparent to-transparent z-10 opacity-100" />
            <div className="h-5 w-5 rounded-md top-1/2 -translate-y-1/2 bg-white z-30 -right-2.5 absolute flex items-center justify-center shadow-[0px_-1px_0px_0px_#FFFFFF40]">
              <IconDotsVertical className="h-4 w-4 text-black" />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

