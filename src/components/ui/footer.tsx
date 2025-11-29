"use client";

import Link from "next/link";
import Image from "next/image";
import { Github, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative z-50 border-t border-zinc-800/50 bg-zinc-950/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="flex flex-row justify-between items-start gap-3 md:gap-12">
          {/* Logo and Socials */}
          <div className="flex-shrink-0 flex flex-col min-w-0">
            <Link href="/" className="inline-block mb-2 sm:mb-3 hover:opacity-80 transition-opacity">
              <Image 
                src="/logos/Group 4.svg" 
                alt="reGuard Logo" 
                width={2071} 
                height={438}
                className="h-[20px] sm:h-[24px] w-auto"
                priority
              />
            </Link>
            <p className="text-[10px] sm:text-sm text-zinc-400 mb-2 sm:mb-4 leading-tight">
              Stop overspending. Start building.
            </p>
            <div className="flex items-center gap-2 sm:gap-4 mt-auto pt-2 sm:pt-4">
              <a 
                href="https://x.com/reGuardAI" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-white transition-colors"
                aria-label="X (Twitter)"
              >
                <Image 
                  src="/twiiter.avif" 
                  alt="X" 
                  width={24} 
                  height={24}
                  className="h-4 w-4 sm:h-6 sm:w-6"
                />
              </a>
              <a 
                href="https://github.com/arm-reguard" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a 
                href="mailto:hello@reguard.dev" 
                className="text-zinc-400 hover:text-white transition-colors"
                aria-label="Email"
              >
                <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
            </div>
          </div>

          {/* Product and Company Columns - Far Right */}
          <div className="flex gap-4 md:gap-16 flex-shrink-0">
            {/* Product Column */}
            <div>
              <h3 className="text-[10px] sm:text-sm font-semibold text-white mb-2 sm:mb-4 uppercase tracking-wider">Product</h3>
              <ul className="space-y-1.5 sm:space-y-3">
                <li>
                  <Link 
                    href="/#features" 
                    className="text-[10px] sm:text-sm text-zinc-400 hover:text-white transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/calculator" 
                    className="text-[10px] sm:text-sm text-zinc-400 hover:text-white transition-colors"
                  >
                    API Calculator
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h3 className="text-[10px] sm:text-sm font-semibold text-white mb-2 sm:mb-4 uppercase tracking-wider">Company</h3>
              <ul className="space-y-1.5 sm:space-y-3">
                <li>
                  <a 
                    href="https://reguard.fillout.com/survey" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] sm:text-sm text-zinc-400 hover:text-white transition-colors"
                  >
                    Survey
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-zinc-800/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-zinc-500">
            © 2025 reGuard. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
