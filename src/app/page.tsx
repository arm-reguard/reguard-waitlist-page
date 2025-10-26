"use client";

import { useState } from "react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { ReGuardButton } from "@/components/ui/reguard-button";
import { motion } from "framer-motion";
import { CheckCircle2, Infinity } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    setIsSubmitted(true);
  };

  return (
    <AuroraBackground>
      {/* Fixed Navigation Bar - Top Left */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 z-50 w-full"
      >
        <div className="p-6">
          <Link href="/" className="flex items-center gap-3 w-fit hover:opacity-80 transition-opacity">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-600/20 backdrop-blur-sm border border-purple-500/30 p-1.5">
              <Image 
                src="/reguard-logo.svg" 
                alt="reGuard Logo" 
                width={32} 
                height={32}
                className="w-full h-full"
              />
            </div>
            <span className="text-xl font-bold text-white">reGuard</span>
          </Link>
        </div>
      </motion.nav>

      {/* Main Content - Center Aligned */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 max-w-5xl"
        >
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl mb-6 whitespace-nowrap">
            <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
              Never Worry About API Costs Again
            </span>
          </h2>
          <p className="text-base text-zinc-300 sm:text-lg md:text-xl">
            Smart monitoring and controls to prevent unexpected API costs
          </p>
        </motion.div>

        {/* Features - 3 top, 2 bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-16 max-w-3xl"
        >
          <div className="flex flex-col items-center gap-4 text-sm text-zinc-400">
            {/* First row - 3 items */}
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
              <div className="flex items-center gap-2 whitespace-nowrap">
                <CheckCircle2 className="h-4 w-4 text-purple-400 flex-shrink-0" />
                <span>Real-time Monitoring</span>
              </div>
              <div className="flex items-center gap-2 whitespace-nowrap">
                <CheckCircle2 className="h-4 w-4 text-purple-400 flex-shrink-0" />
                <span>Instant Alerts</span>
              </div>
              <div className="flex items-center gap-2 whitespace-nowrap">
                <CheckCircle2 className="h-4 w-4 text-purple-400 flex-shrink-0" />
                <span>Multi-Provider Tracking</span>
              </div>
            </div>
            {/* Second row - 2 items */}
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
              <div className="flex items-center gap-2 whitespace-nowrap">
                <CheckCircle2 className="h-4 w-4 text-purple-400 flex-shrink-0" />
                <span>Request Caching</span>
              </div>
              <div className="flex items-center gap-2 whitespace-nowrap">
                <CheckCircle2 className="h-4 w-4 text-purple-400 flex-shrink-0" />
                <span>3D Cost Visualization</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Waitlist Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-full max-w-2xl"
        >
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full rounded-full text-white placeholder-gray-500 focus:outline-none transition-all text-base md:text-lg px-6 py-3"
                  style={{
                    background: "rgba(0, 0, 0, 0.5)",
                    border: "1px solid rgba(167, 139, 250, 0.3)",
                    boxShadow: "0 0 20px rgba(167, 139, 250, 0.1)",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.border = "1px solid rgba(167, 139, 250, 0.5)";
                    e.currentTarget.style.boxShadow = "0 0 20px rgba(167, 139, 250, 0.2)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.border = "1px solid rgba(167, 139, 250, 0.3)";
                    e.currentTarget.style.boxShadow = "0 0 20px rgba(167, 139, 250, 0.1)";
                  }}
                />
                <ReGuardButton 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full sm:w-auto sm:min-w-[200px]"
                >
                  {isLoading ? "Joining..." : "Join Waitlist"}
                </ReGuardButton>
              </div>
              <p className="text-xs text-zinc-500">
                Be the first to know when we launch. No spam, ever.
              </p>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-lg bg-purple-600/10 backdrop-blur-sm border border-purple-500/30 p-6"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <CheckCircle2 className="h-6 w-6 text-purple-400" />
                <h3 className="text-xl font-semibold text-white">You're on the list!</h3>
              </div>
              <p className="text-zinc-300">
                We'll notify you at <span className="font-medium text-white">{email}</span> when reGuard launches.
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-20 flex flex-wrap justify-center gap-12 text-center"
        >
          <div>
            <div className="text-3xl font-bold text-white">300+</div>
            <div className="text-sm text-zinc-400">On Waitlist</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">2mins</div>
            <div className="text-sm text-zinc-400">Setup Time</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white flex items-center justify-center gap-1">
              <Infinity className="h-8 w-8" />
            </div>
            <div className="text-sm text-zinc-400">API Tracking</div>
          </div>
        </motion.div>

        {/* Coming Soon Pill */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8"
        >
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="px-6 py-2 rounded-full text-sm font-medium text-purple-300"
            style={{
              background: "rgba(139, 92, 246, 0.15)",
              border: "1px solid rgba(167, 139, 250, 0.3)",
              boxShadow: "0 0 20px rgba(167, 139, 250, 0.2)",
            }}
          >
            Coming Soon
          </motion.div>
        </motion.div>
      </div>
    </AuroraBackground>
  );
}