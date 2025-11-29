"use client";

import React, { useEffect, useRef } from 'react';

interface BentoItemProps {
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

// Reusable BentoItem component
const BentoItem = ({ className, children, style }: BentoItemProps) => {
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const item = itemRef.current;
    if (!item) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = item.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      item.style.setProperty('--mouse-x', `${x}px`);
      item.style.setProperty('--mouse-y', `${y}px`);
    };

    item.addEventListener('mousemove', handleMouseMove);
    return () => {
      item.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div ref={itemRef} className={`bento-item ${className || ''}`} style={style}>
      {children}
    </div>
  );
};

// Main Component
export const CyberneticBentoGrid = () => {
  return (
    <div className="main-container">
      <div className="w-full max-w-6xl mx-auto z-10">
        <div className="text-sm text-zinc-400 text-center mb-2">reGuard Features</div>
        <h1 
          className="text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-[2.5rem] lg:text-[2.75rem] xl:text-[2.75rem] text-center mb-4 sm:mb-5"
          style={{ fontFamily: 'var(--font-meriva)' }}
        >
          <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
            Everything you need to control API costs
          </span>
        </h1>
        <p className="text-base text-zinc-300 sm:text-lg md:text-lg lg:text-lg text-center mb-4 sm:mb-5">
          From budget limits to cost tracking, reGuard gives you complete visibility and control over LLM API spending across all providers.
        </p>
        <div className="bento-grid">
          <BentoItem className="col-span-2 row-span-2 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Hard Spending Limits</h2>
              <p className="mt-2 text-[#babac1]">
                Auto-blocks API calls when budget limits are reached. Prevent surprise bills with enforceable spending caps across OpenAI, Anthropic, Google APIs, and more.
              </p>
            </div>
            <div className="mt-4 h-48 bg-zinc-900/50 rounded-lg border border-purple-500/20 p-2 overflow-hidden">
              <div className="h-full flex flex-col gap-1.5">
                {/* Monthly Spend Limit */}
                <div className="flex-1 bg-zinc-800/50 rounded p-1.5 min-h-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[10px] text-zinc-400">Monthly Spend Limit</span>
                    <span className="text-[9px] px-1.5 py-0.5 bg-purple-500/20 text-purple-300 rounded border border-purple-500/30">AUTO-BLOCK ON</span>
                  </div>
                  <div className="text-sm font-bold text-white mb-0.5">$500.00</div>
                  <div className="h-1.5 bg-zinc-700 rounded-full overflow-hidden mb-0.5">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500" style={{ width: '84%' }}></div>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-zinc-400">$420.50 Spent</span>
                    <span className="text-red-400">$79.50 Remaining</span>
                  </div>
                </div>
                
                {/* Bottom Row - Usage Trend & Live Requests */}
                <div className="flex gap-1.5 flex-1 min-h-0">
                  <div className="flex-1 bg-zinc-800/50 rounded p-1.5 min-h-0 flex flex-col">
                    <div className="text-[10px] text-zinc-400 mb-1">Usage Trend</div>
                    <div className="flex items-end justify-between flex-1 gap-0.5">
                      <div className="flex-1 bg-purple-500/70 rounded-t" style={{ height: '25%' }}></div>
                      <div className="flex-1 bg-purple-500/70 rounded-t" style={{ height: '35%' }}></div>
                      <div className="flex-1 bg-purple-500/70 rounded-t" style={{ height: '28%' }}></div>
                      <div className="flex-1 bg-purple-500/70 rounded-t" style={{ height: '55%' }}></div>
                      <div className="flex-1 bg-red-500 rounded-t relative" style={{ height: '100%' }}>
                        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-[7px] px-1 py-0.5 bg-red-600 rounded text-white font-bold whitespace-nowrap">ALERT</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 bg-zinc-800/50 rounded p-1.5 min-h-0 flex flex-col">
                    <div className="text-[10px] text-zinc-400 mb-1">Live Requests</div>
                    <div className="space-y-0.5 flex-1 flex flex-col justify-center">
                      <div className="flex items-center gap-1">
                        <div className="w-1 h-1 bg-green-500 rounded-full flex-shrink-0"></div>
                        <span className="text-[9px] text-zinc-300 truncate">POST /chat</span>
                        <span className="text-[9px] text-green-400 ml-auto flex-shrink-0">200 OK</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-1 h-1 bg-green-500 rounded-full flex-shrink-0"></div>
                        <span className="text-[9px] text-zinc-300 truncate">POST /embed</span>
                        <span className="text-[9px] text-green-400 ml-auto flex-shrink-0">200 OK</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-1 h-1 bg-red-500 rounded-full flex-shrink-0"></div>
                        <span className="text-[9px] text-zinc-300 truncate">POST /img</span>
                        <span className="text-[9px] text-red-400 ml-auto flex-shrink-0">429 BLOCKED</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </BentoItem>

          <BentoItem>
            <h2 className="text-xl font-bold text-white">Cost per Customer</h2>
            <p className="mt-2 text-[#babac1] text-sm">
              Track API spending by individual customer or user. Identify high-cost users and optimize pricing based on actual usage.
            </p>
          </BentoItem>

          <BentoItem>
            <h2 className="text-xl font-bold text-white">Response Caching</h2>
            <p className="mt-2 text-[#babac1] text-sm">
              Automatic response caching reduces token usage by 30-60% without code changes. Savings<br />on autopilot.
            </p>
          </BentoItem>

          <BentoItem>
            <h2 className="text-xl font-bold text-white">Testing Playground</h2>
            <p className="mt-2 text-[#babac1] text-sm">
              Test prompts and preview costs in a safe sandbox before deploying to production.
            </p>
          </BentoItem>

          <BentoItem>
            <h2 className="text-xl font-bold text-white">Cost per Feature</h2>
            <p className="mt-2 text-[#babac1] text-sm">
              Track spending by app feature or API endpoint. Identify which features cost most.
            </p>
          </BentoItem>

          <BentoItem className="col-span-2">
            <h2 className="text-xl font-bold text-white">Real-time Monitoring</h2>
            <p className="mt-2 text-[#babac1] text-sm md:hidden">
              Track API costs and usage in real-time with instant budget alerts. Get notified at 80%, 90%, and 100% budget thresholds before limits hit.
            </p>
            <div className="mt-2 text-[#babac1] text-sm hidden md:block space-y-2">
              <p>
                Track API costs and token usage in real-time across all LLM providers. Get instant budget alerts at 80%, 90%, and 100% thresholds before limits hit.
              </p>
              <p>
                Monitor spending by customer, feature, or endpoint with live dashboards that update every request.
              </p>
            </div>
          </BentoItem>

          <BentoItem>
            <h2 className="text-xl font-bold text-white">Drag-and-Drop Dashboard</h2>
            <p className="mt-2 text-[#babac1] text-sm">
              Customize dashboards with drag-and-drop widgets to track what matters most. Build views tailored to your workflow.
            </p>
          </BentoItem>

          <BentoItem>
            <h2 className="text-xl font-bold text-white">Multi-Provider Support</h2>
            <p className="mt-2 text-[#babac1] text-sm">
              One proxy, all providers. Works with OpenAI, Anthropic, Google, Deepseek, and more.
            </p>
          </BentoItem>
        </div>
      </div>
    </div>
  );
};

