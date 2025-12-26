import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
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
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12">
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
                <pre className="font-mono text-xs sm:text-sm md:text-base">
                  <code>
                    <span className="text-gray-400">{"{"}</span>{"\n"}
                    <span className="text-gray-400">  </span><span className="text-purple-400">&quot;status&quot;</span><span className="text-gray-400">: </span><span className="text-amber-400">404</span><span className="text-gray-400">,</span>{"\n"}
                    <span className="text-gray-400">  </span><span className="text-purple-400">&quot;error&quot;</span><span className="text-gray-400">: </span><span className="text-emerald-400">&quot;EndpointNotFound&quot;</span><span className="text-gray-400">,</span>{"\n"}
                    <span className="text-gray-400">  </span><span className="text-purple-400">&quot;message&quot;</span><span className="text-gray-400">: </span><span className="text-emerald-400">&quot;This API endpoint doesn&apos;t exist 😅&quot;</span><span className="text-gray-400">,</span>{"\n"}
                    <span className="text-gray-400">  </span><span className="text-purple-400">&quot;cost&quot;</span><span className="text-gray-400">: </span><span className="text-emerald-400">&quot;$0.00&quot;</span><span className="text-gray-400">,</span>{"\n"}
                    <span className="text-gray-400">  </span><span className="text-purple-400">&quot;suggestion&quot;</span><span className="text-gray-400">: </span><span className="text-emerald-400">&quot;Try these routes instead:&quot;</span>{"\n"}
                    <span className="text-gray-400">{"}"}</span>
                  </code>
                </pre>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <Link href="/" className="group block w-full">
                  <div className="relative flex items-center gap-3 px-4 py-3 sm:px-5 sm:py-4 rounded-lg bg-zinc-900/80 border border-zinc-700/50 hover:border-purple-500/50 transition-all duration-300 overflow-hidden">
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

      {/* Simple Footer */}
      <footer className="relative z-50 border-t border-zinc-800/50 bg-zinc-950/50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs text-zinc-500">
            © 2025 reGuard. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
