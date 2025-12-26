"use client";

import { useState, useEffect, JSX } from "react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Footer } from "@/components/ui/footer";
import { motion } from "framer-motion";
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

// Floating particles component
function FloatingParticles() {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; duration: number; delay: number }>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none hidden sm:block" style={{ zIndex: 5 }}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            background: `rgba(139, 92, 246, ${0.2 + Math.random() * 0.3})`,
            boxShadow: `0 0 ${particle.size * 2}px rgba(139, 92, 246, 0.3)`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// Syntax highlighted JSON renderer
function SyntaxHighlightedJSON({ text, isComplete }: { text: string; isComplete: boolean }) {
  const renderHighlighted = () => {
    const lines = text.split('\n');
    return lines.map((line, lineIndex) => {
      const parts: JSX.Element[] = [];
      let remaining = line;
      let keyIndex = 0;

      // Match and highlight different parts
      while (remaining.length > 0) {
        // Match keys (quoted strings before colon)
        const keyMatch = remaining.match(/^(\s*)"([^"]+)":/);
        if (keyMatch) {
          if (keyMatch[1]) {
            parts.push(<span key={`ws-${keyIndex++}`} className="text-gray-400">{keyMatch[1]}</span>);
          }
          parts.push(<span key={`key-${keyIndex++}`} className="text-purple-400">&quot;{keyMatch[2]}&quot;</span>);
          parts.push(<span key={`colon-${keyIndex++}`} className="text-gray-400">:</span>);
          remaining = remaining.slice(keyMatch[0].length);
          continue;
        }

        // Match string values (quoted strings not before colon)
        const stringMatch = remaining.match(/^(\s*)"([^"]+)"(,?)/);
        if (stringMatch) {
          if (stringMatch[1]) {
            parts.push(<span key={`ws-${keyIndex++}`} className="text-gray-400">{stringMatch[1]}</span>);
          }
          parts.push(<span key={`str-${keyIndex++}`} className="text-emerald-400">&quot;{stringMatch[2]}&quot;</span>);
          if (stringMatch[3]) {
            parts.push(<span key={`comma-${keyIndex++}`} className="text-gray-400">{stringMatch[3]}</span>);
          }
          remaining = remaining.slice(stringMatch[0].length);
          continue;
        }

        // Match numbers
        const numberMatch = remaining.match(/^(\s*)(\d+)(,?)/);
        if (numberMatch) {
          if (numberMatch[1]) {
            parts.push(<span key={`ws-${keyIndex++}`} className="text-gray-400">{numberMatch[1]}</span>);
          }
          parts.push(<span key={`num-${keyIndex++}`} className="text-amber-400">{numberMatch[2]}</span>);
          if (numberMatch[3]) {
            parts.push(<span key={`comma-${keyIndex++}`} className="text-gray-400">{numberMatch[3]}</span>);
          }
          remaining = remaining.slice(numberMatch[0].length);
          continue;
        }

        // Match braces
        const braceMatch = remaining.match(/^([{}[\]])/);
        if (braceMatch) {
          parts.push(<span key={`brace-${keyIndex++}`} className="text-gray-400">{braceMatch[1]}</span>);
          remaining = remaining.slice(1);
          continue;
        }

        // Match whitespace and other characters
        const otherMatch = remaining.match(/^(\s+|.)/);
        if (otherMatch) {
          parts.push(<span key={`other-${keyIndex++}`} className="text-gray-400">{otherMatch[1]}</span>);
          remaining = remaining.slice(otherMatch[0].length);
          continue;
        }

        break;
      }

      return (
        <div key={lineIndex} className="leading-relaxed">
          {parts}
        </div>
      );
    });
  };

  return (
    <code className="font-mono text-xs sm:text-sm md:text-base block">
      {renderHighlighted()}
      {!isComplete && (
        <motion.span
          className="inline-block w-2 h-4 sm:h-5 bg-purple-400 ml-0.5"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
      )}
    </code>
  );
}

// API Endpoint Button
function APIButton({ 
  method, 
  path, 
  href, 
  label 
}: { 
  method: "GET" | "POST"; 
  path: string; 
  href: string; 
  label: string;
}) {
  const methodColor = method === "GET" ? "text-emerald-400" : "text-amber-400";
  
  return (
    <Link href={href} className="group block w-full">
      <motion.div
        className="relative flex items-center gap-3 px-4 py-3 sm:px-5 sm:py-4 rounded-lg bg-zinc-900/80 border border-zinc-700/50 hover:border-purple-500/50 transition-all duration-300 overflow-hidden"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Glow effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-purple-600/10 via-purple-500/5 to-transparent pointer-events-none" />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ boxShadow: 'inset 0 0 30px rgba(139, 92, 246, 0.1)' }} />
        
        <span className={`font-mono text-xs sm:text-sm font-bold ${methodColor} relative z-10`}>
          {method}
        </span>
        <span className="font-mono text-xs sm:text-sm text-zinc-300 group-hover:text-white transition-colors relative z-10">
          {path}
        </span>
        <span className="ml-auto text-xs text-zinc-500 group-hover:text-purple-400 transition-colors relative z-10">
          {label}
        </span>
        
        {/* Arrow icon */}
        <motion.svg
          className="w-4 h-4 text-zinc-500 group-hover:text-purple-400 transition-colors relative z-10"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          initial={{ x: 0 }}
          whileHover={{ x: 3 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </motion.svg>
      </motion.div>
    </Link>
  );
}

export default function NotFound() {
  const [displayedText, setDisplayedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    let currentIndex = 0;
    const typingSpeed = 15; // ms per character

    const typeNextChar = () => {
      if (currentIndex < jsonContent.length) {
        setDisplayedText(jsonContent.slice(0, currentIndex + 1));
        currentIndex++;
        setTimeout(typeNextChar, typingSpeed);
      } else {
        setIsTypingComplete(true);
      }
    };

    // Start typing after a small delay
    const startDelay = setTimeout(typeNextChar, 500);

    return () => clearTimeout(startDelay);
  }, []);

  return (
    <AuroraBackground className="min-h-screen">
      {/* Floating Particles */}
      <FloatingParticles />

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
                quality={95}
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
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-[600px]"
        >
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
                <SyntaxHighlightedJSON text={displayedText} isComplete={isTypingComplete} />
              </div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isTypingComplete ? 1 : 0.5 }}
                transition={{ duration: 0.4 }}
                className="space-y-3"
              >
                <APIButton 
                  method="GET" 
                  path="/" 
                  href="/" 
                  label="Go to homepage"
                />
                <APIButton 
                  method="GET" 
                  path="/calculator" 
                  href="/calculator" 
                  label="Cost calculator"
                />
              </motion.div>

              {/* Help text */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 0.5 }}
                className="text-center text-xs text-zinc-500 mt-6"
              >
                Lost? Our API can help you find your way back.
              </motion.p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <Footer />
    </AuroraBackground>
  );
}

