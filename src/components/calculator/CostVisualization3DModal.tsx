"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  Dialog,
  DialogContent,
  DialogClose,
} from '@/components/ui/dialog';
import { X, CheckCircle2 } from 'lucide-react';
import { ReGuardButton } from '@/components/ui/reguard-button';
import type { CalculatedModel } from '@/lib/calculator-utils';

// Lazy load the 3D component (no SSR)
const CostVisualization3D = dynamic(
  () => import('./CostVisualization3D').then(mod => ({ default: mod.CostVisualization3D })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading 3D visualization...</p>
        </div>
      </div>
    ),
  }
);

interface CostVisualization3DModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: CalculatedModel[];
}

export function CostVisualization3DModal({
  open,
  onOpenChange,
  data,
}: CostVisualization3DModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll to waitlist
  const scrollToWaitlist = () => {
    onOpenChange(false); // Close modal first
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 300);
  };

  if (!mounted) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[98vw] !w-[98vw] !h-[95vh] !p-0 bg-black/95 border-purple-500/30 overflow-hidden" showCloseButton={false}>
        {/* Close Button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 rounded-lg bg-zinc-900/80 p-2 border border-zinc-700 hover:bg-zinc-800 transition-colors z-50 cursor-pointer"
        >
          <X className="h-5 w-5 text-gray-400" />
        </button>

        <div className="flex flex-col h-full w-full p-6 gap-3">
          {/* Header - Main heading, larger size */}
          <div className="text-center flex-shrink-0">
            <h3 
              className="text-2xl sm:text-3xl font-bold tracking-tight mb-1"
              style={{ fontFamily: 'var(--font-meriva)' }}
            >
              <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                3D Cost Universe
              </span>
            </h3>
            <p className="text-gray-400 text-xs">
              Your {data.length} models visualized in 3D space
            </p>
          </div>

          {/* 3D Canvas - Flex grow to take available space */}
          <div className="flex-1 w-full rounded-xl border border-zinc-800/50 bg-[#0a0a0a] overflow-hidden min-h-0">
            <CostVisualization3D data={data} />
          </div>

          {/* CTA Section - Generous spacing for readability */}
          <div className="flex-shrink-0 pt-4 text-center">
            <h4 
              className="text-xl sm:text-2xl font-bold tracking-tight mb-6"
              style={{ fontFamily: 'var(--font-meriva)' }}
            >
              <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                See your actual API requests in 3D
              </span>
            </h4>
            
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mb-7 text-sm text-zinc-300/90">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-purple-400 flex-shrink-0" />
                <span>Real-Time Tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-purple-400 flex-shrink-0" />
                <span>Intelligent Clustering</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-purple-400 flex-shrink-0" />
                <span>Anomaly Detection</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-purple-400 flex-shrink-0" />
                <span>Heat Zones</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-purple-400 flex-shrink-0" />
                <span>AI-Powered Insights</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-purple-400 flex-shrink-0" />
                <span>AI Cost Recommendations</span>
              </div>
            </div>
            
            <div className="flex justify-center scale-90">
              <ReGuardButton onClick={scrollToWaitlist}>
                Join Waitlist - Get Early Access
              </ReGuardButton>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

