import type { Metadata, Viewport } from "next";
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
  title: "reGuard - LLM API Budget Protection | Stop Surprise Bills",
  description: "Automatically block LLM API calls when budget limits are reached. Track costs per customer and per feature, enforce hard spending caps, and prevent surprise bills across all LLM providers.",
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
  applicationName: "reGuard",
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
  
  // Open Graph / Facebook - Comprehensive Tags
  openGraph: {
    type: 'website',
    url: 'https://reguard.dev/',
    title: 'reGuard - LLM API Budget Protection | Stop Surprise Bills',
    description: 'Automatically block LLM API calls when budget limits are reached. Track costs per customer and per feature, enforce hard spending caps, and prevent surprise bills across all LLM providers.',
    siteName: 'reGuard',
    locale: 'en_US',
    alternateLocale: ['en_US'],
    images: [
      {
        url: 'https://reguard.dev/og-image.png',
        width: 1200,
        height: 630,
        alt: 'reGuard - LLM API Budget Protection | Stop Surprise Bills',
        type: 'image/png',
      },
    ],
  },
  
  // Twitter Card - Comprehensive Tags
  twitter: {
    card: 'summary_large_image',
    title: 'reGuard - LLM API Budget Protection | Stop Surprise Bills',
    description: 'Automatically block LLM API calls when budget limits are reached. Track costs per customer and per feature, enforce hard spending caps, and prevent surprise bills across all LLM providers.',
    images: ['https://reguard.dev/og-image.png'],
    creator: '@reGuardAI',
    site: '@reGuardAI',
  },
  
  // Icons & Favicons
  icons: {
    icon: [
      { url: 'https://reguard.dev/icon', sizes: '128x128', type: 'image/png' },
      { url: 'https://reguard.dev/icon-192', sizes: '192x192', type: 'image/png' },
      { url: 'https://reguard.dev/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: 'https://reguard.dev/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { url: 'https://reguard.dev/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
    shortcut: 'https://reguard.dev/favicon.ico',
    apple: 'https://reguard.dev/icon',
  },
  manifest: '/site.webmanifest',
  
  other: {
    'msapplication-TileColor': '#8B5CF6',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'reGuard',
    'format-detection': 'telephone=no',
  },
};

// Viewport configuration (separated from metadata in Next.js 14+)
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#8B5CF6' },
    { media: '(prefers-color-scheme: dark)', color: '#8B5CF6' },
  ],
  colorScheme: 'dark',
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
        
        {/* Additional Open Graph Tags (not in Metadata API) */}
        <meta property="og:image:secure_url" content="https://reguard.dev/og-image.png" />
        <meta property="og:logo" content="https://reguard.dev/icon" />
        
        {/* Additional Meta Tags (not in Metadata API) */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/site.webmanifest" />
        
        {/* Organization Schema - Helps Google understand your brand */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "reGuard",
              "url": "https://reguard.dev",
              "logo": "https://reguard.dev/icon",
              "description": "LLM API budget protection platform that automatically blocks API calls when spending limits are reached.",
              "sameAs": [
                "https://x.com/reGuardAI",
                "https://github.com/arm-reguard"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "email": "hello@reguard.dev",
                "contactType": "customer support"
              }
            })
          }}
        />
        
        {/* WebSite Schema - Enables sitelinks search box potential */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "reGuard",
              "url": "https://reguard.dev",
              "description": "LLM API budget protection - automatically block API calls when spending limits are reached",
              "publisher": {
                "@type": "Organization",
                "name": "reGuard",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://reguard.dev/icon"
                }
              }
            })
          }}
        />
        
        {/* SoftwareApplication Schema - Describes your product */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "reGuard",
              "applicationCategory": "DeveloperApplication",
              "operatingSystem": "Web",
              "description": "Automatically block LLM API calls when budget limits are reached. Track costs per customer and per feature, enforce hard spending caps, and prevent surprise bills across OpenAI, Anthropic, Google, and more.",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "description": "Join waitlist for early access"
              },
              "featureList": [
                "Hard spending limits that block API calls",
                "Cost tracking per customer",
                "Cost tracking per feature",
                "Multi-provider support (OpenAI, Anthropic, Google, etc.)",
                "Real-time monitoring",
                "Smart request caching"
              ],
              "screenshot": "https://reguard.dev/og-image.png"
            })
          }}
        />
        
        {/* FAQ Schema - For rich results in Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "How is reGuard different from monitoring tools like Helicone, Portkey, and Langfuse?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Monitoring tools send alerts when you approach budget limits, but your API calls continue and you still get billed. reGuard physically blocks API calls at your budget limit with a 429 error response. Set $500, spend $500, never $501. It's the only LLM API budget tool with enforceable hard spending limits that prevent surprise bills before they happen."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Does reGuard integrate with my existing code?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. Integration takes one line—just point your API calls to our proxy endpoint. No refactoring needed. We are also working on offering native SDKs for Python, Node.js, and Go that handle routing automatically with zero added latency."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What LLM providers does reGuard support?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "OpenAI, Anthropic, Google, Deepseek, Mistral, Cohere, Together AI, Groq, and all OpenAI-compatible APIs. Replicate, Hugging Face, and more coming soon."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What happens when I hit my budget limit?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "API calls are instantly blocked with a standard HTTP 429 (Rate Limit Exceeded) error. Your application handles it like any other rate limit response. You can configure custom error messages and fallback behaviors."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Can I track costs per customer or feature?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. Pass customer IDs or feature tags in request headers. We'll break down costs automatically by customer, feature, or API endpoint in your dashboard."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What's the pricing model for reGuard?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "reGuard uses a flat-rate pricing model with no usage-based fees. You pay a predictable monthly/yearly subscription regardless of how many API calls you make. Join the waitlist for early access details."
                  }
                }
              ]
            })
          }}
        />
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