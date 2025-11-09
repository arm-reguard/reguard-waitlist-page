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
  title: "reGuard - Budget Protection for LLM APIs",
  description: "Protect your LLM API budget with intelligent monitoring and controls",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/icon.svg', sizes: '32x32', type: 'image/svg+xml' },
      { url: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.svg',
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