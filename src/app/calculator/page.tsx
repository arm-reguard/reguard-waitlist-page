"use client";

import { CostCalculator } from "@/components/calculator/CostCalculator";
import { Footer } from "@/components/ui/footer";
import { AuroraBackground } from "@/components/ui/aurora-background";
import Link from "next/link";
import Image from "next/image";

export default function CalculatorPage() {
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
                loading="eager"
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
      <div className="relative z-50 pt-8 pb-20 px-4">
        <CostCalculator />
      </div>
      
      {/* Footer */}
      <Footer />
    </AuroraBackground>
  );
}

