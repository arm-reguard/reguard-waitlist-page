import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import VisualEditsMessenger from "../visual-edits/VisualEditsMessenger";
import ErrorReporter from "@/components/ErrorReporter";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";

// Load custom fonts
const agileFont = localFont({
  src: "../../public/Fonts/Agile/agile.ttf",
  variable: "--font-agile",
});

const glastoneFont = localFont({
  src: "../../public/Fonts/GLASTONE.ttf",
  variable: "--font-glastone",
});

const merivaFont = localFont({
  src: "../../public/Fonts/meriva-font/meriva.ttf",
  variable: "--font-meriva",
});

const mooxyFont = localFont({
  src: "../../public/Fonts/mooxy-font-1761487746-0/mooxy.ttf",
  variable: "--font-mooxy",
});

const sugarFont = localFont({
  src: "../../public/Fonts/sugar-gorgeous-modern-font/Sugar.ttf",
  variable: "--font-sugar",
});

// Body fonts
const merriweatherSansFont = localFont({
  src: "../../public/Fonts/Merriweather_Sans,Source_Sans_3/Merriweather_Sans/MerriweatherSans-VariableFont_wght.ttf",
  variable: "--font-merriweather-sans",
});

const sourceSans3Font = localFont({
  src: "../../public/Fonts/Merriweather_Sans,Source_Sans_3/Source_Sans_3/SourceSans3-VariableFont_wght.ttf",
  variable: "--font-source-sans-3",
});

const openSansFont = localFont({
  src: "../../public/Fonts/Open-Sans-Full-Version/Desktop Fonts/OpenSans-VariableFont_wdth,wght.ttf",
  variable: "--font-open-sans",
});

const playfairDisplayFont = localFont({
  src: "../../public/Fonts/Playfair-Display-Full-Version/Desktop Fonts/Playfair Display/static/PlayfairDisplay-Regular.ttf",
  variable: "--font-playfair-display",
});

const spectralFont = localFont({
  src: "../../public/Fonts/Spectral/Spectral-Regular.ttf",
  variable: "--font-spectral",
});

export const metadata: Metadata = {
  title: "reGuard - Budget Protection for LLM APIs",
  description: "Protect your LLM API budget with intelligent monitoring and controls",
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${agileFont.variable} ${glastoneFont.variable} ${merivaFont.variable} ${mooxyFont.variable} ${sugarFont.variable} ${merriweatherSansFont.variable} ${sourceSans3Font.variable} ${openSansFont.variable} ${playfairDisplayFont.variable} ${spectralFont.variable}`}>
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
      </body>
    </html>
  );
}