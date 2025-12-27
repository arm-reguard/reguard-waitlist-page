"use client";

import { useState, useEffect, useMemo } from "react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { ReGuardButton } from "@/components/ui/reguard-button";
import { CyberneticBentoGrid } from "@/components/ui/bento-grid";
import { Footer } from "@/components/ui/footer";
import { FAQSection } from "@/components/ui/faq-section";
import { motion } from "framer-motion";
import { CheckCircle2, Infinity } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const [email, setEmail] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [hasMounted, setHasMounted] = useState(false);
  
  // Beta access form state
  const [betaEmail, setBetaEmail] = useState("");
  const [betaSubmittedEmail, setBetaSubmittedEmail] = useState("");
  const [betaIsSubmitted, setBetaIsSubmitted] = useState(false);
  const [betaIsDuplicate, setBetaIsDuplicate] = useState(false);
  const [betaIsLoading, setBetaIsLoading] = useState(false);

  const phrases = useMemo(
    () => ["API costs again", "AI spending again", "LLM expenses again", "vibe coding again"],
    []
  );

  // Prevent hydration mismatch by waiting for client mount
  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (phraseIndex === phrases.length - 1) {
        setPhraseIndex(0);
      } else {
        setPhraseIndex(phraseIndex + 1);
      }
    }, 3000);
    return () => clearTimeout(timeoutId);
  }, [phraseIndex, phrases]);

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

  const handleBetaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!betaEmail) return;
    
    setBetaIsLoading(true);
    setBetaSubmittedEmail(betaEmail);
    const submittedEmailCopy = betaEmail;
    
    // Wait 0.75 seconds before showing result (feels more natural)
    setTimeout(() => {
      setBetaIsLoading(false);
      setBetaIsSubmitted(true);
      setBetaIsDuplicate(false);
      setBetaEmail('');
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

      if (!response.ok) {
        if (response.status === 409) {
          // Duplicate email detected - update to show duplicate message
          setTimeout(() => {
            setBetaIsSubmitted(false);
            setBetaIsDuplicate(true);
            setBetaIsLoading(false);
          }, 750);
        } else {
          // Revert and show error
          setTimeout(() => {
            setBetaIsSubmitted(false);
            setBetaEmail(submittedEmailCopy);
            setBetaIsLoading(false);
            alert(data.error || 'Something went wrong. Please try again.');
          }, 750);
        }
      }
      // If response.ok, success is already shown after 0.75 seconds
    } catch (error) {
      console.error('Error:', error);
      // Revert and show error
      setTimeout(() => {
        setBetaIsSubmitted(false);
        setBetaEmail(submittedEmailCopy);
        setBetaIsLoading(false);
        alert('Something went wrong. Please try again.');
      }, 750);
    }
  };

  return (
    <>
      <AuroraBackground className="justify-start md:justify-center">
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
                href="/calculator"
                className="relative z-50 px-3 py-1.5 sm:px-6 sm:py-3 rounded-full text-[10px] sm:text-sm font-semibold text-white hover:text-white transition-all border-2 border-purple-500/50 hover:border-purple-400 bg-gradient-to-r from-purple-600/80 to-violet-600/80 hover:from-purple-500 hover:to-violet-500 backdrop-blur-sm whitespace-nowrap shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40"
              >
                <span className="sm:hidden">API Calculator</span>
                <span className="hidden sm:inline">API Cost Calculator</span>
              </Link>
            </nav>
          </div>
        </header>

        {/* Main Content - Center Aligned with Consistent Container */}
        <div className="relative z-50 flex flex-col items-center justify-start md:justify-center h-auto md:min-h-screen px-4 text-center pb-8 md:pb-0 mt-5 sm:mt-2 md:mt-2 md:-mt-16">
        {/* Main Headline */}
        <div className="relative z-50 mb-2 sm:mb-6 md:mb-7 max-w-5xl w-full">
              <h2 className="relative z-50 text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-[2.5rem] lg:text-[2.75rem] xl:text-[2.75rem] mb-4 sm:mb-5" style={{ fontFamily: 'var(--font-meriva)' }}>
                <div className="relative z-50 bg-gradient-to-r from-purple-400 via-violet-400 to-purple-400 bg-clip-text text-transparent flex flex-col items-center gap-2">
                  <span className="whitespace-nowrap bg-gradient-to-r from-purple-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">Never worry about</span>
                  <span className="relative overflow-hidden" style={{ minWidth: 'max-content', minHeight: '1.2em' }}>
                    {hasMounted ? (
                      // Animated version - only renders after client mount to prevent hydration mismatch
                      phrases.map((phrase, index) => (
                        <motion.span
                          key={index}
                          className="absolute left-1/2 -translate-x-1/2 font-bold bg-gradient-to-r from-purple-400 via-violet-400 to-purple-400 bg-clip-text text-transparent whitespace-nowrap"
                          style={{ 
                            fontFamily: 'var(--font-meriva)',
                            fontWeight: 'bold',
                            fontSize: 'inherit',
                            lineHeight: 'inherit',
                            letterSpacing: 'inherit'
                          }}
                          initial={index === 0 ? { opacity: 1, y: 0 } : { opacity: 0, y: "100%" }}
                          transition={{ type: "spring", stiffness: 50 }}
                          animate={
                            phraseIndex === index
                              ? {
                                  y: 0,
                                  opacity: 1,
                                }
                              : {
                                  y: -150,
                                  opacity: 0,
                                }
                          }
                        >
                          {phrase}
                        </motion.span>
                      ))
                    ) : (
                      // Static fallback for SSR - prevents hydration mismatch
                      <span 
                        className="absolute left-1/2 -translate-x-1/2 font-bold bg-gradient-to-r from-purple-400 via-violet-400 to-purple-400 bg-clip-text text-transparent whitespace-nowrap"
                        style={{ 
                          fontFamily: 'var(--font-meriva)',
                          fontWeight: 'bold',
                          fontSize: 'inherit',
                          lineHeight: 'inherit',
                          letterSpacing: 'inherit'
                        }}
                      >
                        {phrases[0]}
                      </span>
                    )}
                    {/* Invisible spacer with exact same styling to maintain baseline and width */}
                    <span className="invisible whitespace-nowrap bg-gradient-to-r from-purple-400 via-violet-400 to-purple-400 bg-clip-text text-transparent" style={{ fontFamily: 'var(--font-meriva)', fontWeight: 'bold', fontSize: 'inherit', lineHeight: 'inherit', letterSpacing: 'inherit' }}>{phrases[hasMounted ? phraseIndex : 0]}</span>
                  </span>
                </div>
              </h2>
          <p className="relative z-50 text-base text-zinc-300 sm:text-lg md:text-lg lg:text-lg mb-4 sm:mb-5">
            Hard spending limits that physically stop API calls.
            <br />
            Not alerts. Not warnings. Real protection.
            <br />
            Set your budget, we'll enforce it.
          </p>
        </div>

        {/* Features - Mobile: 1 column, Desktop: 3 top, 2 bottom */}
        <div className="relative z-50 mb-2 sm:mb-4 max-w-3xl w-full flex justify-center sm:hidden">
          {/* Mobile: Vertical stack - Centered container with left-aligned items */}
          <div className="relative z-50 flex flex-col items-start gap-3.5 text-base sm:text-lg text-zinc-300/90">
            <div className="relative z-50 flex items-center gap-2 whitespace-nowrap">
              <CheckCircle2 className="relative z-50 h-4 w-4 text-purple-400 flex-shrink-0" />
              <span className="relative z-50">Auto-Blocks at Budget</span>
            </div>
            <div className="relative z-50 flex items-center gap-2 whitespace-nowrap">
              <CheckCircle2 className="relative z-50 h-4 w-4 text-purple-400 flex-shrink-0" />
              <span className="relative z-50">Smart Request Caching</span>
            </div>
            <div className="relative z-50 flex items-center gap-2 whitespace-nowrap">
              <CheckCircle2 className="relative z-50 h-4 w-4 text-purple-400 flex-shrink-0" />
              <span className="relative z-50">Cost per Customer</span>
            </div>
            <div className="relative z-50 flex items-center gap-2 whitespace-nowrap">
              <CheckCircle2 className="relative z-50 h-4 w-4 text-purple-400 flex-shrink-0" />
              <span className="relative z-50">Test Before Production</span>
            </div>
            <div className="relative z-50 flex items-center gap-2 whitespace-nowrap">
              <CheckCircle2 className="relative z-50 h-4 w-4 text-purple-400 flex-shrink-0" />
              <span className="relative z-50">One Proxy, All Providers</span>
            </div>
          </div>
        </div>
        
        {/* Desktop Features */}
        <div className="relative z-50 mb-4 max-w-3xl w-full hidden sm:block">
          {/* Desktop: 3 top, 2 bottom layout */}
          <div className="flex flex-col items-center gap-7 text-base sm:text-lg text-zinc-300/90">
            {/* First row - 3 items */}
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
              <div className="flex items-center gap-2 whitespace-nowrap">
                <CheckCircle2 className="h-4 w-4 text-purple-400 flex-shrink-0" />
                <span>Auto-Blocks at Budget</span>
              </div>
              <div className="flex items-center gap-2 whitespace-nowrap">
                <CheckCircle2 className="h-4 w-4 text-purple-400 flex-shrink-0" />
                <span>Smart Request Caching</span>
              </div>
              <div className="flex items-center gap-2 whitespace-nowrap">
                <CheckCircle2 className="h-4 w-4 text-purple-400 flex-shrink-0" />
                <span>Cost per Customer</span>
              </div>
            </div>
            {/* Second row - 2 items */}
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
              <div className="flex items-center gap-2 whitespace-nowrap">
                <CheckCircle2 className="h-4 w-4 text-purple-400 flex-shrink-0" />
                <span>Test Before Production</span>
              </div>
              <div className="flex items-center gap-2 whitespace-nowrap">
                <CheckCircle2 className="h-4 w-4 text-purple-400 flex-shrink-0" />
                <span>One Proxy, All Providers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Waitlist Form */}
        <div className="relative z-50 w-full max-w-2xl">
          {!isSubmitted && !isDuplicate ? (
            <form 
              onSubmit={handleSubmit}
              className="relative z-50 space-y-3 sm:space-y-4"
            >
              <div className="relative z-50 flex flex-col sm:flex-row gap-4 sm:gap-4">
                <input
                  type="email"
                  id="waitlist-email"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="relative z-50 email-input w-full rounded-full text-white placeholder-gray-500 focus:outline-none text-base md:text-lg px-6 py-3"
                />
                <ReGuardButton 
                  type="submit" 
                  disabled={isLoading}
                  className="relative z-50 w-full sm:w-auto sm:min-w-[200px]"
                >
                  {isLoading ? "Joining..." : "Join Waitlist"}
                </ReGuardButton>
              </div>
              <p className="relative z-50 text-xs text-zinc-500">
                Be the first to know when we launch. No spam, ever.
              </p>
              <Link
                href="/calculator"
                className="relative z-50 text-sm text-purple-400 hover:text-purple-300 transition-colors mt-3 mb-2 font-bold cursor-pointer inline-block"
              >
                Try our FREE API Cost Calculator
              </Link>
            </form>
          ) : isDuplicate ? (
            <motion.div
              initial={{ opacity: 1, scale: 1 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative z-50 rounded-lg bg-purple-600/10 backdrop-blur-sm border border-purple-500/30 p-6"
            >
              <div className="relative z-50 flex items-center justify-center gap-2 mb-2">
                <span className="relative z-50 text-3xl">✨</span>
                <h3 className="relative z-50 text-xl font-semibold text-white">Already on the list!</h3>
              </div>
              <p className="relative z-50 text-zinc-300">
                <span className="font-medium text-white">{submittedEmail}</span> is already signed up for the waitlist.
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 1, scale: 1 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative z-50 rounded-lg bg-purple-600/10 backdrop-blur-sm border border-purple-500/30 p-6"
            >
              <div className="relative z-50 flex items-center justify-center gap-2 mb-2">
                <span className="relative z-50 text-3xl">🎉</span>
                <h3 className="relative z-50 text-xl font-semibold text-white">You're on the waitlist!</h3>
              </div>
              <p className="relative z-50 text-zinc-300">
                We'll notify you at <span className="font-medium text-white">{submittedEmail}</span> when reGuard launches.
              </p>
            </motion.div>
          )}
        </div>

        {/* Stats */}
        <div className="relative z-50 mt-4 sm:mt-6 md:mt-7 flex justify-center gap-8 sm:gap-12">
          <div className="relative z-50 flex flex-col items-center">
            <div className="relative z-50 text-2xl sm:text-3xl font-bold text-white h-[40px] flex items-center justify-center">300+</div>
            <div className="relative z-50 text-xs sm:text-sm text-zinc-300/90 mt-2">On Waitlist</div>
          </div>
          <div className="relative z-50 flex flex-col items-center">
            <div className="relative z-50 text-2xl sm:text-3xl font-bold text-white h-[40px] flex items-center justify-center">2mins</div>
            <div className="relative z-50 text-xs sm:text-sm text-zinc-300/90 mt-2">Setup Time</div>
          </div>
          <div className="relative z-50 flex flex-col items-center">
            <div className="relative z-50 text-white font-bold h-[40px] flex items-center justify-center">
              <Infinity className="relative z-50 h-8 w-8 sm:h-10 sm:w-10" />
            </div>
            <div className="relative z-50 text-xs sm:text-sm text-zinc-300/90 mt-2">API Tracking</div>
          </div>
        </div>

        {/* Coming Soon Pill */}
        <div className="relative z-50 mt-4 sm:mt-6 md:mt-7 mb-2 sm:mb-3">
          <div
            className="relative z-50 px-6 py-2 rounded-full text-sm font-medium text-purple-300"
            style={{
              background: "rgba(139, 92, 246, 0.15)",
              border: "1px solid rgba(167, 139, 250, 0.3)",
              boxShadow: "0 0 20px rgba(167, 139, 250, 0.2)",
            }}
          >
            <span className="relative z-50">Launching Soon</span>
          </div>
        </div>
      </div>

      {/* Bento Grid Section */}
      <section id="features" className="relative z-50 pt-0 sm:pt-1 pb-16 sm:pb-20 md:pb-24 px-4 -mt-4 sm:-mt-8">
        <CyberneticBentoGrid />
      </section>

      {/* Built from real developer pain Section */}
      <section className="relative z-50 pt-0 sm:pt-1 pb-8 sm:pb-12 px-4">
        <div className="w-full max-w-6xl mx-auto z-10">
          <h1 
            className="text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-[2.5rem] lg:text-[2.75rem] xl:text-[2.75rem] text-center mb-4 sm:mb-5"
            style={{ fontFamily: 'var(--font-meriva)' }}
          >
            <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
              Built from real developer pain
            </span>
          </h1>
          <p className="text-base text-zinc-300 sm:text-lg md:text-lg lg:text-lg text-center mb-4 sm:mb-5">
            We researched developers who've been hit with surprise API bills. These are their stories.
          </p>
          <div className="mt-8 sm:mt-12 flex items-center justify-center">
            <div className="relative w-full max-w-4xl">
              <Image
                src="/Painpoint_new.png"
                alt="Developer pain points"
                width={1200}
                height={900}
                className="w-full h-auto rounded-lg"
                priority
              />
            </div>
          </div>
          
          {/* CTA Section */}
          <div className="mt-8 sm:mt-10 text-center">
            <p className="text-base text-zinc-300 sm:text-lg mb-3">
              Tired of surprise API bills? Help us fix it.
            </p>
            <a 
              href="https://reguard.fillout.com/survey" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 rounded-full text-xs sm:text-sm font-semibold text-white hover:text-white transition-all border-2 border-purple-500/50 hover:border-purple-400 bg-gradient-to-r from-purple-600/80 to-violet-600/80 hover:from-purple-500 hover:to-violet-500 backdrop-blur-sm whitespace-nowrap shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40"
            >
              <span>Take 2-Minute Survey</span>
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection />

      {/* Get exclusive beta access Section */}
      <section className="relative z-50 pt-0 sm:pt-1 pb-16 sm:pb-20 md:pb-24 px-4">
        <div className="relative z-50 flex flex-col items-center text-center">
          <h1 
            className="relative z-50 text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-[2.5rem] lg:text-[2.75rem] xl:text-[2.75rem] mb-4 sm:mb-5 max-w-5xl w-full"
            style={{ fontFamily: 'var(--font-meriva)' }}
          >
            <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
              Get exclusive beta access
            </span>
          </h1>
          <p className="relative z-50 text-base text-zinc-300 sm:text-lg md:text-lg lg:text-lg mb-4 sm:mb-5 max-w-5xl w-full">
            Be among the first developers to<br className="sm:hidden" /> test reGuard in production.
          </p>
          
          {/* Waitlist Form */}
          <div className="relative z-50 w-full max-w-2xl">
            {!betaIsSubmitted && !betaIsDuplicate ? (
              <form 
                onSubmit={handleBetaSubmit}
                className="relative z-50 space-y-3 sm:space-y-4"
              >
                <div className="relative z-50 flex flex-col sm:flex-row gap-4 sm:gap-4">
                  <input
                    type="email"
                    id="beta-email"
                    name="email"
                    autoComplete="email"
                    value={betaEmail}
                    onChange={(e) => setBetaEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="relative z-50 email-input w-full rounded-full text-white placeholder-gray-500 focus:outline-none text-base md:text-lg px-6 py-3"
                  />
                  <ReGuardButton 
                    type="submit" 
                    disabled={betaIsLoading}
                    className="relative z-50 w-full sm:w-auto sm:min-w-[200px]"
                  >
                    {betaIsLoading ? "Joining..." : "Join Waitlist"}
                  </ReGuardButton>
                </div>
              </form>
            ) : betaIsDuplicate ? (
              <motion.div
                initial={{ opacity: 1, scale: 1 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-50 rounded-lg bg-purple-600/10 backdrop-blur-sm border border-purple-500/30 p-6"
              >
                <div className="relative z-50 flex items-center justify-center gap-2 mb-2">
                  <span className="relative z-50 text-3xl">✨</span>
                  <h3 className="relative z-50 text-xl font-semibold text-white">Already on the list!</h3>
                </div>
                <p className="relative z-50 text-zinc-300">
                  <span className="font-medium text-white">{betaSubmittedEmail}</span> is already signed up for the waitlist.
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 1, scale: 1 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-50 rounded-lg bg-purple-600/10 backdrop-blur-sm border border-purple-500/30 p-6"
              >
                <div className="relative z-50 flex items-center justify-center gap-2 mb-2">
                  <span className="relative z-50 text-3xl">🎉</span>
                  <h3 className="relative z-50 text-xl font-semibold text-white">You're on the waitlist!</h3>
                </div>
                <p className="relative z-50 text-zinc-300">
                  We'll notify you at <span className="font-medium text-white">{betaSubmittedEmail}</span> when reGuard launches.
                </p>
              </motion.div>
            )}
          </div>
          
          <p className="relative z-50 text-sm text-zinc-400 text-center mt-4">
            Limited spots. Launching Q1 2026.
          </p>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      </AuroraBackground>
    </>
  );
}