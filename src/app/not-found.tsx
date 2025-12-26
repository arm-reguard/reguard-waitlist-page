import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-4">
      {/* Main Content */}
      <div className="w-full max-w-md text-center">
        {/* 404 Badge */}
        <div className="mb-8">
          <span className="inline-block px-6 py-3 rounded-full bg-red-500/15 border-2 border-red-500/40 text-red-400 font-mono text-2xl sm:text-3xl font-bold tracking-wider">
            ERROR 404
          </span>
        </div>

        {/* Message */}
        <h1 className="text-xl sm:text-2xl font-semibold text-white mb-4">
          Page Not Found
        </h1>
        <p className="text-zinc-400 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium transition-colors"
          >
            Go to Homepage
          </Link>
          <Link
            href="/calculator"
            className="px-6 py-3 rounded-lg border border-zinc-700 hover:border-purple-500 text-zinc-300 hover:text-white font-medium transition-colors"
          >
            API Calculator
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 text-center">
        <p className="text-xs text-zinc-600">
          © 2025 reGuard
        </p>
      </div>
    </div>
  );
}

