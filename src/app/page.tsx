"use client";

import { useState } from "react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { ReGuardButton } from "@/components/ui/reguard-button";
import { motion } from "framer-motion";
import { CheckCircle2, Infinity } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { CostCalculator } from "@/components/calculator/CostCalculator";

export default function Home() {
  const [email, setEmail] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    setSubmittedEmail(email);
    const submittedEmailCopy = email;
    
    // Wait 0.75 seconds before showing result (feels more natural)
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      setIsDuplicate(false);
      setEmail('');
    }, 750);
    
    // Handle submission in background
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: submittedEmailCopy }),
      });

      const data = await response.json();
      console.log('Response status:', response.status);
      console.log('Response data:', data);

      if (!response.ok) {
        if (response.status === 409) {
          // Duplicate email detected - update to show duplicate message
          setTimeout(() => {
            setIsSubmitted(false);
            setIsDuplicate(true);
            setIsLoading(false);
          }, 750);
        } else {
          // Revert and show error
          setTimeout(() => {
            setIsSubmitted(false);
            setEmail(submittedEmailCopy);
            setIsLoading(false);
            alert(data.error || 'Something went wrong. Please try again.');
          }, 750);
        }
      }
      // If response.ok, success is already shown after 0.75 seconds
    } catch (error) {
      console.error('Error:', error);
      // Revert and show error
      setTimeout(() => {
        setIsSubmitted(false);
        setEmail(submittedEmailCopy);
        setIsLoading(false);
        alert('Something went wrong. Please try again.');
      }, 750);
    }
  };

  return (
    <>
      <AuroraBackground className="justify-start md:justify-center">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 pt-4 sm:pt-6"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-1 sm:py-2">
            <Link href="/" className="flex items-center w-fit hover:opacity-80 transition-opacity -ml-3 sm:-ml-5">
              <Image 
                src="/logos/Group 4.svg" 
                alt="reGuard Logo" 
                width={2071} 
                height={438}
                className="h-[30px] w-auto sm:h-[38px] md:h-[50px]"
              />
            </Link>
          </div>
        </motion.header>

        {/* Main Content - Center Aligned with Consistent Container */}
        <div className="relative z-10 flex flex-col items-center justify-start md:justify-center h-auto md:min-h-screen px-4 text-center pb-8 md:pb-0 mt-8 md:-mt-16">
        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-10 max-w-5xl w-full"
        >
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-[2.5rem] lg:text-[2.75rem] xl:text-[2.75rem] mb-5 sm:whitespace-nowrap" style={{ fontFamily: 'var(--font-meriva)' }}>
                <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                  Never worry about API costs again
                </span>
              </h2>
          <p className="text-base text-zinc-300 sm:text-lg md:text-lg lg:text-lg">
            Smart monitoring and controls to prevent unexpected API bills
          </p>
        </motion.div>

        {/* Features - Mobile: 1 column, Desktop: 3 top, 2 bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12 max-w-3xl w-full flex justify-center sm:hidden"
        >
          {/* Mobile: Vertical stack - Centered container with left-aligned items */}
          <div className="flex flex-col items-start gap-4 text-sm sm:text-base text-zinc-300/90">
            <div className="flex items-center gap-2 whitespace-nowrap">
              <CheckCircle2 className="h-4 w-4 text-purple-400 flex-shrink-0" />
              <span>Live Cost Monitoring</span>
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap">
              <CheckCircle2 className="h-4 w-4 text-purple-400 flex-shrink-0" />
              <span>Instant Budget Alerts</span>
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap">
              <CheckCircle2 className="h-4 w-4 text-purple-400 flex-shrink-0" />
              <span>3D Cost Visualization</span>
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap">
              <CheckCircle2 className="h-4 w-4 text-purple-400 flex-shrink-0" />
              <span>Intelligent Request Caching</span>
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap">
              <CheckCircle2 className="h-4 w-4 text-purple-400 flex-shrink-0" />
              <span>Multi-Provider LLM Tracking</span>
            </div>
          </div>
        </motion.div>
        
        {/* Desktop Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-11 max-w-3xl w-full hidden sm:block"
        >
          {/* Desktop: 3 top, 2 bottom layout */}
          <div className="flex flex-col items-center gap-6 text-sm sm:text-base text-zinc-300/90">
            {/* First row - 3 items */}
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
              <div className="flex items-center gap-2 whitespace-nowrap">
                <CheckCircle2 className="h-4 w-4 text-purple-400 flex-shrink-0" />
                <span>Live Cost Monitoring</span>
              </div>
              <div className="flex items-center gap-2 whitespace-nowrap">
                <CheckCircle2 className="h-4 w-4 text-purple-400 flex-shrink-0" />
                <span>Instant Budget Alerts</span>
              </div>
              <div className="flex items-center gap-2 whitespace-nowrap">
                <CheckCircle2 className="h-4 w-4 text-purple-400 flex-shrink-0" />
                <span>3D Cost Visualization</span>
              </div>
            </div>
            {/* Second row - 2 items */}
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
              <div className="flex items-center gap-2 whitespace-nowrap">
                <CheckCircle2 className="h-4 w-4 text-purple-400 flex-shrink-0" />
                <span>Intelligent Request Caching</span>
              </div>
              <div className="flex items-center gap-2 whitespace-nowrap">
                <CheckCircle2 className="h-4 w-4 text-purple-400 flex-shrink-0" />
                <span>Multi-Provider LLM Tracking</span>
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
          {!isSubmitted && !isDuplicate ? (
            <form 
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="email-input w-full rounded-full text-white placeholder-gray-500 focus:outline-none text-base md:text-lg px-6 py-3"
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
              <button
                type="button"
                onClick={() => document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-sm text-purple-400 hover:text-purple-300 transition-colors mt-2 font-bold cursor-pointer"
              >
                Try our FREE API Cost Calculator
              </button>
            </form>
          ) : isDuplicate ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-lg bg-purple-600/10 backdrop-blur-sm border border-purple-500/30 p-6"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-3xl">✨</span>
                <h3 className="text-xl font-semibold text-white">Already on the list!</h3>
              </div>
              <p className="text-zinc-300">
                <span className="font-medium text-white">{submittedEmail}</span> is already signed up for the waitlist.
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-lg bg-purple-600/10 backdrop-blur-sm border border-purple-500/30 p-6"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-3xl">🎉</span>
                <h3 className="text-xl font-semibold text-white">You're on the waitlist!</h3>
              </div>
              <p className="text-zinc-300">
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
          className="mt-12 flex justify-center gap-8 sm:gap-12"
        >
          <div className="flex flex-col items-center">
            <div className="text-2xl sm:text-3xl font-bold text-white h-[40px] flex items-center justify-center">300+</div>
            <div className="text-xs sm:text-sm text-zinc-300/90 mt-2">On Waitlist</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-2xl sm:text-3xl font-bold text-white h-[40px] flex items-center justify-center">2mins</div>
            <div className="text-xs sm:text-sm text-zinc-300/90 mt-2">Setup Time</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-white font-bold h-[40px] flex items-center justify-center">
              <Infinity className="h-8 w-8 sm:h-10 sm:w-10" />
            </div>
            <div className="text-xs sm:text-sm text-zinc-300/90 mt-2">API Tracking</div>
          </div>
        </motion.div>

        {/* Coming Soon Pill */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-14 mb-6"
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
            }}
          >
            Launching Soon
          </motion.div>
        </motion.div>
      </div>

      {/* Calculator Section */}
      <section id="calculator" className="mt-4 pb-20 px-4">
        <CostCalculator />
      </section>
      </AuroraBackground>
    </>
  );
}