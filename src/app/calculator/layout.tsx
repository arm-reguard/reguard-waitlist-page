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

// FAQPage Schema for potential rich results
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I calculate LLM API costs?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Use our free calculator to estimate costs. Select your LLM provider (OpenAI, Anthropic, Google, etc.), enter your expected monthly API calls, and specify average input/output tokens per call. The calculator shows estimated monthly costs across all providers."
      }
    },
    {
      "@type": "Question",
      "name": "Which LLM providers are supported?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our calculator supports OpenAI (GPT-5.1, GPT-4.5), Anthropic (Claude Opus 4.5, Sonnet 4.5), Google (Gemini 3 Pro), Mistral, Groq, Together AI, Cohere, and more. We regularly update pricing data to reflect the latest rates."
      }
    },
    {
      "@type": "Question",
      "name": "Is the API cost calculator free?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, the LLM API cost calculator is completely free to use. No signup required. Calculate and compare costs across all major providers instantly."
      }
    }
  ]
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
      {/* FAQ Schema for rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  );
}

