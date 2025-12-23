import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free LLM API Cost Calculator | Compare OpenAI, Anthropic, Google Pricing",
  description: "Calculate and compare API costs across OpenAI, Anthropic, Google, Mistral, and more. Free tool to estimate monthly LLM spending based on your usage.",
  keywords: [
    "LLM API cost calculator",
    "OpenAI pricing calculator",
    "Anthropic API costs",
    "Google AI pricing",
    "GPT-4 cost calculator",
    "Claude API pricing",
    "compare LLM costs",
    "AI API budget estimator",
  ],
  alternates: {
    canonical: '/calculator',
  },
  openGraph: {
    title: "Free LLM API Cost Calculator | Compare Provider Pricing",
    description: "Calculate and compare API costs across OpenAI, Anthropic, Google, Mistral, and more. Free tool to estimate monthly LLM spending.",
    url: 'https://reguard.dev/calculator',
    type: 'website',
    images: [
      {
        url: 'https://reguard.dev/og-image.png',
        width: 1200,
        height: 630,
        alt: 'reGuard - Free LLM API Cost Calculator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Free LLM API Cost Calculator",
    description: "Calculate and compare API costs across OpenAI, Anthropic, Google, and more. Free tool to estimate monthly LLM spending.",
    images: ['https://reguard.dev/og-image.png'],
    creator: '@reGuardAI',
    site: '@reGuardAI',
  },
};

// JSON-LD Schema for the Calculator Tool
const calculatorSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "LLM API Cost Calculator",
  "url": "https://reguard.dev/calculator",
  "description": "Free tool to calculate and compare API costs across OpenAI, Anthropic, Google, Mistral, and other LLM providers. Estimate monthly spending based on your usage.",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "featureList": [
    "Compare costs across 7+ LLM providers",
    "Calculate monthly API spending",
    "Adjust tokens per call",
    "Visual cost comparison charts",
    "3D cost visualization",
    "Provider-specific model selection"
  ],
  "creator": {
    "@type": "Organization",
    "name": "reGuard",
    "url": "https://reguard.dev"
  },
  "screenshot": "https://reguard.dev/og-image.png"
};


export default function CalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Calculator Tool Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(calculatorSchema) }}
      />
      {children}
    </>
  );
}

