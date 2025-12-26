"use client";

import { useState, useEffect } from "react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Footer } from "@/components/ui/footer";
import Link from "next/link";
import Image from "next/image";

// JSON content for typing effect
const jsonContent = `{
  "status": 404,
  "error": "EndpointNotFound",
  "message": "This API endpoint doesn't exist 😅",
  "cost": "$0.00",
  "suggestion": "Try these routes instead:"
}`;

// Syntax highlighted JSON with typing effect
function TypedJSON() {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let currentIndex = 0;
    const typingSpeed = 15;

    const typeNextChar = () => {
      if (currentIndex < jsonContent.length) {
        setDisplayedText(jsonContent.slice(0, currentIndex + 1));
        currentIndex++;
        setTimeout(typeNextChar, typingSpeed);
      } else {
        setIsComplete(true);
      }
    };

    const startDelay = setTimeout(typeNextChar, 500);
    return () => clearTimeout(startDelay);
  }, []);

  // Render with syntax highlighting
  const renderHighlighted = () => {
    const lines = displayedText.split('\n');
    return lines.map((line, lineIndex) => {
      let highlighted = line;
      
      // Highlight keys (purple)
      highlighted = highlighted.replace(/"([^"]+)":/g, '<span class="text-purple-400">"$1"</span>:');
      // Highlight string values (green) - after keys
      highlighted = highlighted.replace(/: "([^"]+)"/g, ': <span class="text-emerald-400">"$1"</span>');
      // Highlight numbers (amber)
      highlighted = highlighted.replace(/: (\d+)/g, ': <span class="text-amber-400">$1</span>');
      // Highlight braces (gray)
      highlighted = highlighted.replace(/([{}])/g, '<span class="text-gray-400">$1</span>');
      
      return (
        <div key={lineIndex} dangerouslySetInnerHTML={{ __html: highlighted || '&nbsp;' }} />
      );
    });
  };

  return (
    <code className="font-mono text-xs sm:text-sm md:text-base block text-gray-400">
      {renderHighlighted()}
      {!isComplete && (
        <span className="inline-block w-2 h-4 sm:h-5 bg-purple-400 ml-0.5 animate-pulse" />
      )}
    </code>
  );
}

export default function NotFound() {
  return (
    <AuroraBackground className="min-h-screen">
      {/* Header with Navigation */}
      <header className="relative z-50 pt-4 sm:pt-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-0.5 sm:py-1">
          <nav className="flex items-center justify-between">
            <Link href="/" className="flex items-center w-fit hover:opacity-80 transition-opacity -ml-3 sm:-ml-5">
              <Image 
                src="/logos/Group 4.svg" 
                alt="reGuard Logo" 
                width={2071} 
                height={438}
                className="h-[20px] sm:h-[32px] md:h-[40px] w-auto"
                priority
              />
            </Link>
            <Link 
              href="/"
              className="relative z-50 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium text-white hover:text-purple-300 transition-colors border border-zinc-700/50 hover:border-purple-500/50 bg-zinc-900/50 hover:bg-zinc-800/50 backdrop-blur-sm whitespace-nowrap"
            >
              Home
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-50 flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4 py-8 sm:py-12">
        {/* Card Container */}
        <div className="w-full max-w-[600px]">
          {/* Glassmorphism Card with Gradient Border */}
          <div className="relative rounded-2xl overflow-hidden">
            {/* Gradient border */}
            <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-br from-purple-500 via-violet-500 to-purple-600">
              <div className="absolute inset-[1px] rounded-2xl bg-zinc-950" />
            </div>
            
            {/* Card content */}
            <div className="relative bg-purple-500/5 backdrop-blur-lg rounded-2xl p-5 sm:p-8">
              {/* 404 Badge */}
              <div className="flex justify-center mb-6 sm:mb-8">
                <div className="px-6 py-2.5 sm:px-8 sm:py-3 rounded-full bg-red-500/15 border-2 border-red-500/40 shadow-lg shadow-red-500/10">
                  <span className="text-red-400 font-mono text-xl sm:text-2xl md:text-3xl font-bold tracking-wider">ERROR 404</span>
                </div>
              </div>

              {/* JSON Response Block */}
              <div className="bg-zinc-900/80 rounded-xl p-4 sm:p-6 border border-zinc-800/50 mb-6 sm:mb-8">
                <div className="flex items-center gap-2 mb-3 pb-3 border-b border-zinc-800/50">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <span className="text-xs text-zinc-500 font-mono ml-2">response.json</span>
                </div>
                <TypedJSON />
              </div>

              {/* CTA Buttons - API Endpoint Style */}
              <div className="space-y-3">
                <Link href="/" className="group block w-full">
                  <div className="relative flex items-center gap-3 px-4 py-3 sm:px-5 sm:py-4 rounded-lg bg-zinc-900/80 border border-zinc-700/50 hover:border-purple-500/50 transition-all duration-300 overflow-hidden">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-purple-600/10 via-purple-500/5 to-transparent pointer-events-none" />
                    <span className="font-mono text-xs sm:text-sm font-bold text-emerald-400 relative z-10">
                      GET
                    </span>
                    <span className="font-mono text-xs sm:text-sm text-zinc-300 group-hover:text-white transition-colors relative z-10">
                      /
                    </span>
                    <span className="ml-auto text-xs text-zinc-500 group-hover:text-purple-400 transition-colors relative z-10">
                      Go to homepage
                    </span>
                    <svg
                      className="w-4 h-4 text-zinc-500 group-hover:text-purple-400 transition-colors relative z-10"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
                <Link href="/calculator" className="group block w-full">
                  <div className="relative flex items-center gap-3 px-4 py-3 sm:px-5 sm:py-4 rounded-lg bg-zinc-900/80 border border-zinc-700/50 hover:border-purple-500/50 transition-all duration-300 overflow-hidden">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-purple-600/10 via-purple-500/5 to-transparent pointer-events-none" />
                    <span className="font-mono text-xs sm:text-sm font-bold text-emerald-400 relative z-10">
                      GET
                    </span>
                    <span className="font-mono text-xs sm:text-sm text-zinc-300 group-hover:text-white transition-colors relative z-10">
                      /calculator
                    </span>
                    <span className="ml-auto text-xs text-zinc-500 group-hover:text-purple-400 transition-colors relative z-10">
                      Cost calculator
                    </span>
                    <svg
                      className="w-4 h-4 text-zinc-500 group-hover:text-purple-400 transition-colors relative z-10"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              </div>

              {/* Help text */}
              <p className="text-center text-xs text-zinc-500 mt-6">
                Lost? Our API can help you find your way back.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </AuroraBackground>
  );
}
