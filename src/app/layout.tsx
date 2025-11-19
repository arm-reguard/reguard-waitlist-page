import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import VisualEditsMessenger from "../visual-edits/VisualEditsMessenger";
import ErrorReporter from "@/components/ErrorReporter";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

// Load only the fonts we actually use (removed 7 unused fonts for faster load)
const merivaFont = localFont({
  src: "../../public/Fonts/meriva-font/meriva.ttf",
  variable: "--font-meriva",
  display: "swap",
  preload: true,
});

const sourceSans3Font = localFont({
  src: "../../public/Fonts/Merriweather_Sans,Source_Sans_3/Source_Sans_3/SourceSans3-VariableFont_wght.ttf",
  variable: "--font-source-sans-3",
  display: "swap",
  preload: true,
});

const openSansFont = localFont({
  src: "../../public/Fonts/Open-Sans-Full-Version/Desktop Fonts/OpenSans-VariableFont_wdth,wght.ttf",
  variable: "--font-open-sans",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  // Primary Meta Tags
  title: "reGuard - Stop Surprise LLM API Bills | Budget Protection",
  description: "Auto-block LLM API spending at budget limits. Works with OpenAI, Anthropic, Google + 4 providers. Free API cost calculator. Join 300+ on waitlist.",
  keywords: [
    "API budget protection",
    "LLM API costs",
    "OpenAI budget limits",
    "Anthropic cost tracking",
    "stop API overspending",
    "API cost calculator",
    "prevent surprise API bills",
    "auto-block API spending",
  ],
  authors: [{ name: "reGuard" }],
  creator: "reGuard",
  publisher: "reGuard",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  metadataBase: new URL('https://reguard.dev'),
  alternates: {
    canonical: '/',
  },
  
  // Open Graph / Facebook
  openGraph: {
    type: 'website',
    url: 'https://reguard.dev/',
    title: 'reGuard - Stop Surprise LLM API Bills | Budget Protection',
    description: 'Auto-block LLM API spending at budget limits. Works with OpenAI, Anthropic, Google + 4 providers. Free API cost calculator. Join 300+ on waitlist.',
    siteName: 'reGuard',
    locale: 'en_US',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'reGuard - Stop Surprise LLM API Bills',
      },
    ],
  },
  
  // Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'reGuard - Stop Surprise LLM API Bills',
    description: 'Auto-block LLM API spending at budget limits. Works with OpenAI, Anthropic, Google + 4 providers. Free API cost calculator. Join 300+ on waitlist.',
    images: ['/og-image.svg'],
    creator: '@reGuardAI',
  },
  
  // Icons & Favicons
  icons: {
    icon: [
      { url: 'https://reguard.dev/icon', sizes: '128x128', type: 'image/png' },
      { url: 'https://reguard.dev/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: 'https://reguard.dev/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { url: 'https://reguard.dev/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
    shortcut: 'https://reguard.dev/favicon.ico',
    apple: 'https://reguard.dev/icon',
  },
  manifest: '/site.webmanifest',
  
  // Theme Colors
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#8B5CF6' },
    { media: '(prefers-color-scheme: dark)', color: '#8B5CF6' },
  ],
  colorScheme: 'dark',
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
  other: {
    'msapplication-TileColor': '#8B5CF6',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${merivaFont.variable} ${sourceSans3Font.variable} ${openSansFont.variable}`}>
      <head>
        {/* Google Search Console Verification */}
        <meta name="google-site-verification" content="GB8KV6SBWWtnKi4fx6iNnSL7AF-9IKWOpeZ4c3VQ96U" />
      </head>
      <body className="antialiased" style={{ fontFamily: 'var(--font-open-sans)' }}>
        <ErrorReporter />
        <Script
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts//route-messenger.js"
          strategy="afterInteractive"
          data-target-origin="*"
          data-message-type="ROUTE_CHANGE"
          data-include-search-params="true"
          data-only-in-iframe="true"
          data-debug="true"
          data-custom-data='{"appName": "YourApp", "version": "1.0.0", "greeting": "hi"}'
        />
        {children}
        <VisualEditsMessenger />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}