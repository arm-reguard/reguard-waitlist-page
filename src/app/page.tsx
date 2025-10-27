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
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    setSubmittedEmail(email);
    
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setEmail('');
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
          <Link href="/" className="flex items-center w-fit hover:opacity-80 transition-opacity" style={{ gap: '0px' }}>
            <Image 
              src="/reguard-logo.svg" 
              alt="reGuard Logo" 
              width={140} 
              height={140}
              className="w-[140px] h-[140px]"
              style={{ marginRight: '-20px' }}
            />
            <span className="text-4xl font-bold text-white" style={{ fontFamily: 'var(--font-meriva)' }}>reGuard</span>
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
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl lg:text-5xl mb-6 whitespace-nowrap" style={{ fontFamily: 'var(--font-meriva)' }}>
                <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                  Never worry about API costs again
                </span>
              </h2>
          <p className="text-base text-zinc-300 sm:text-lg md:text-xl" style={{ fontFamily: 'var(--font-spectral)' }}>
            Smart monitoring and controls to prevent unexpected API bills
          </p>
        </motion.div>

        {/* Features - 3 top, 2 bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-16 max-w-3xl"
        >
          <div className="flex flex-col items-center gap-4 text-sm text-zinc-400" style={{ fontFamily: 'var(--font-spectral)' }}>
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
            <form 
              onSubmit={handleSubmit}
              className="space-y-3"
            >
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
              <p className="text-xs text-zinc-500" style={{ fontFamily: 'var(--font-spectral)' }}>
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
                <span className="text-3xl">🎉</span>
                <h3 className="text-xl font-semibold text-white" style={{ fontFamily: 'var(--font-spectral)' }}>You're on the waitlist!</h3>
              </div>
              <p className="text-zinc-300" style={{ fontFamily: 'var(--font-spectral)' }}>
                We'll notify you at <span className="font-medium text-white">{submittedEmail}</span> when reGuard launches.
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-20 flex justify-center gap-12"
          style={{ fontFamily: 'var(--font-spectral)' }}
        >
          <div className="flex flex-col items-center">
            <div className="text-3xl font-bold text-white h-[40px] flex items-center justify-center">300+</div>
            <div className="text-sm text-zinc-400 mt-2">On Waitlist</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-3xl font-bold text-white h-[40px] flex items-center justify-center">2mins</div>
            <div className="text-sm text-zinc-400 mt-2">Setup Time</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-white h-[40px] flex items-center justify-center">
              <Infinity className="h-10 w-10" />
            </div>
            <div className="text-sm text-zinc-400 mt-2">API Tracking</div>
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
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="px-6 py-2 rounded-full text-sm font-medium text-purple-300"
            style={{
              background: "rgba(139, 92, 246, 0.15)",
              border: "1px solid rgba(167, 139, 250, 0.3)",
              boxShadow: "0 0 20px rgba(167, 139, 250, 0.2)",
              fontFamily: 'var(--font-spectral)',
            }}
          >
            Launching Soon
          </motion.div>
        </motion.div>
      </div>
    </AuroraBackground>
  );
}