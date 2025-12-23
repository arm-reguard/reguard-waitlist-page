export interface ModelPricing {
  id: string;
  name: string;
  provider: string;
  inputCostPerMillion: number;  // Cost per 1M input tokens
  outputCostPerMillion: number; // Cost per 1M output tokens
  color: string; // Brand color for the provider
  popular?: boolean; // Flag popular models
  excludeFromTokenCalculator?: boolean; // Exclude from token-based cost calculations (e.g., Sora video models)
}

export const pricingData: ModelPricing[] = [
  // OpenAI
  {
    id: "openai-gpt5",
    name: "GPT-5.2",
    provider: "OpenAI",
    inputCostPerMillion: 1.75,
    outputCostPerMillion: 14.00,
    color: "#10a37f",
    popular: true
  },
  {
    id: "openai-gpt5-mini",
    name: "GPT-5 mini",
    provider: "OpenAI",
    inputCostPerMillion: 0.25,
    outputCostPerMillion: 2.00,
    color: "#10a37f",
    popular: true
  },
  {
    id: "openai-gpt5-nano",
    name: "GPT-5 nano",
    provider: "OpenAI",
    inputCostPerMillion: 0.05,
    outputCostPerMillion: 0.40,
    color: "#10a37f"
  },
  {
    id: "openai-gpt5-pro",
    name: "GPT-5.2 pro",
    provider: "OpenAI",
    inputCostPerMillion: 21.00,
    outputCostPerMillion: 168.00,
    color: "#10a37f"
  },
  {
    id: "openai-gpt41",
    name: "GPT-4.1",
    provider: "OpenAI",
    inputCostPerMillion: 3.00,
    outputCostPerMillion: 12.00,
    color: "#10a37f"
  },
  {
    id: "openai-gpt41-mini",
    name: "GPT-4.1 mini",
    provider: "OpenAI",
    inputCostPerMillion: 0.80,
    outputCostPerMillion: 3.20,
    color: "#10a37f"
  },
  {
    id: "openai-gpt41-nano",
    name: "GPT-4.1 nano",
    provider: "OpenAI",
    inputCostPerMillion: 0.20,
    outputCostPerMillion: 0.80,
    color: "#10a37f"
  },
  {
    id: "openai-o4-mini",
    name: "o4-mini",
    provider: "OpenAI",
    inputCostPerMillion: 4.00,
    outputCostPerMillion: 16.00,
    color: "#10a37f"
  },
  {
    id: "openai-gpt35-turbo",
    name: "GPT-3.5 turbo",
    provider: "OpenAI",
    inputCostPerMillion: 0.50,
    outputCostPerMillion: 1.50,
    color: "#10a37f"
  },
  // OpenAI Image Generation API
  {
    id: "openai-gpt-image-1",
    name: "GPT-image-1",
    provider: "OpenAI",
    inputCostPerMillion: 5.00, // Text input pricing
    outputCostPerMillion: 40.00, // Image output pricing
    color: "#10a37f"
  },
  {
    id: "openai-gpt-image-1-mini",
    name: "GPT-image-1-mini",
    provider: "OpenAI",
    inputCostPerMillion: 2.00, // Text input pricing
    outputCostPerMillion: 8.00, // Image output pricing
    color: "#10a37f"
  },
  // OpenAI Sora Video API (excluded from token calculator)
  {
    id: "openai-sora-2",
    name: "Sora 2",
    provider: "OpenAI",
    inputCostPerMillion: 0, // Not applicable - priced per second
    outputCostPerMillion: 0, // Not applicable - priced per second
    color: "#10a37f",
    excludeFromTokenCalculator: true
  },
  {
    id: "openai-sora-2-pro-720p",
    name: "Sora 2 Pro (720p)",
    provider: "OpenAI",
    inputCostPerMillion: 0, // Not applicable - priced per second ($0.30/sec)
    outputCostPerMillion: 0, // Not applicable - priced per second
    color: "#10a37f",
    excludeFromTokenCalculator: true
  },
  {
    id: "openai-sora-2-pro-1024p",
    name: "Sora 2 Pro (1024p)",
    provider: "OpenAI",
    inputCostPerMillion: 0, // Not applicable - priced per second ($0.50/sec)
    outputCostPerMillion: 0, // Not applicable - priced per second
    color: "#10a37f",
    excludeFromTokenCalculator: true
  },

  // Anthropic Claude
  {
    id: "anthropic-opus-45",
    name: "Opus 4.5",
    provider: "Anthropic",
    inputCostPerMillion: 5.00,
    outputCostPerMillion: 25.00,
    color: "#D97757",
    popular: true
  },
  {
    id: "anthropic-sonnet-45",
    name: "Sonnet 4.5",
    provider: "Anthropic",
    inputCostPerMillion: 3.00, // Note: 6.00 for >200K context
    outputCostPerMillion: 15.00, // Note: 22.50 for >200K context
    color: "#D97757",
    popular: true
  },
  {
    id: "anthropic-haiku-45",
    name: "Haiku 4.5",
    provider: "Anthropic",
    inputCostPerMillion: 1.00,
    outputCostPerMillion: 5.00,
    color: "#D97757"
  },

  // Google Gemini
  {
    id: "google-gemini-3-pro-preview",
    name: "Gemini 3 Pro Preview",
    provider: "Google",
    inputCostPerMillion: 2.00, // <=200k tokens pricing
    outputCostPerMillion: 12.00, // <=200k tokens pricing
    color: "#4285f4",
    popular: true
  },
  {
    id: "google-gemini-3-pro-image-preview",
    name: "Gemini 3 Pro Image Preview",
    provider: "Google",
    inputCostPerMillion: 2.00, // Text input pricing
    outputCostPerMillion: 12.00, // Text output pricing
    color: "#4285f4"
  },
  {
    id: "google-gemini-25-pro",
    name: "Gemini 2.5 Pro",
    provider: "Google",
    inputCostPerMillion: 1.25, // <=200k tokens pricing (verified)
    outputCostPerMillion: 10.00, // <=200k tokens pricing (verified)
    color: "#4285f4",
    popular: true
  },
  {
    id: "google-gemini-25-flash",
    name: "Gemini 2.5 Flash",
    provider: "Google",
    inputCostPerMillion: 0.30, // Text/image/video pricing (verified)
    outputCostPerMillion: 2.50, // Verified
    color: "#4285f4",
    popular: true
  },
  {
    id: "google-gemini-25-flash-lite",
    name: "Gemini 2.5 Flash-Lite",
    provider: "Google",
    inputCostPerMillion: 0.10, // Text/image/video pricing
    outputCostPerMillion: 0.40,
    color: "#4285f4"
  },
  {
    id: "google-gemini-20-flash",
    name: "Gemini 2.0 Flash",
    provider: "Google",
    inputCostPerMillion: 0.50, // Verified
    outputCostPerMillion: 2.00, // Verified
    color: "#4285f4"
  },
  {
    id: "google-gemini-20-flash-lite",
    name: "Gemini 2.0 Flash-Lite",
    provider: "Google",
    inputCostPerMillion: 0.075,
    outputCostPerMillion: 0.30,
    color: "#4285f4"
  },
  // Google Imagen (Image Generation) - Excluded from token calculator
  {
    id: "google-imagen-4-fast",
    name: "Imagen 4 Fast",
    provider: "Google",
    inputCostPerMillion: 0, // Not applicable - priced per image ($0.02/image)
    outputCostPerMillion: 0, // Not applicable - priced per image
    color: "#4285f4",
    excludeFromTokenCalculator: true
  },
  {
    id: "google-imagen-4-standard",
    name: "Imagen 4 Standard",
    provider: "Google",
    inputCostPerMillion: 0, // Not applicable - priced per image ($0.04/image)
    outputCostPerMillion: 0, // Not applicable - priced per image
    color: "#4285f4",
    excludeFromTokenCalculator: true
  },
  {
    id: "google-imagen-4-ultra",
    name: "Imagen 4 Ultra",
    provider: "Google",
    inputCostPerMillion: 0, // Not applicable - priced per image ($0.06/image)
    outputCostPerMillion: 0, // Not applicable - priced per image
    color: "#4285f4",
    excludeFromTokenCalculator: true
  },
  {
    id: "google-imagen-3",
    name: "Imagen 3",
    provider: "Google",
    inputCostPerMillion: 0, // Not applicable - priced per image ($0.03/image)
    outputCostPerMillion: 0, // Not applicable - priced per image
    color: "#4285f4",
    excludeFromTokenCalculator: true
  },
  // Google Veo (Video Generation) - Excluded from token calculator
  {
    id: "google-veo-31-standard",
    name: "Veo 3.1 Standard",
    provider: "Google",
    inputCostPerMillion: 0, // Not applicable - priced per second ($0.40/sec)
    outputCostPerMillion: 0, // Not applicable - priced per second
    color: "#4285f4",
    excludeFromTokenCalculator: true
  },
  {
    id: "google-veo-31-fast",
    name: "Veo 3.1 Fast",
    provider: "Google",
    inputCostPerMillion: 0, // Not applicable - priced per second ($0.15/sec)
    outputCostPerMillion: 0, // Not applicable - priced per second
    color: "#4285f4",
    excludeFromTokenCalculator: true
  },
  {
    id: "google-veo-3-standard",
    name: "Veo 3 Standard",
    provider: "Google",
    inputCostPerMillion: 0, // Not applicable - priced per second ($0.40/sec)
    outputCostPerMillion: 0, // Not applicable - priced per second
    color: "#4285f4",
    excludeFromTokenCalculator: true
  },
  {
    id: "google-veo-3-fast",
    name: "Veo 3 Fast",
    provider: "Google",
    inputCostPerMillion: 0, // Not applicable - priced per second ($0.15/sec)
    outputCostPerMillion: 0, // Not applicable - priced per second
    color: "#4285f4",
    excludeFromTokenCalculator: true
  },
  {
    id: "google-veo-2",
    name: "Veo 2",
    provider: "Google",
    inputCostPerMillion: 0, // Not applicable - priced per second ($0.35/sec)
    outputCostPerMillion: 0, // Not applicable - priced per second
    color: "#4285f4",
    excludeFromTokenCalculator: true
  },

  // Mistral
  {
    id: "mistral-large",
    name: "Mistral Large",
    provider: "Mistral",
    inputCostPerMillion: 2.00,
    outputCostPerMillion: 8.00,
    color: "#ff7000"
  },
  {
    id: "mistral-medium",
    name: "Mistral Medium",
    provider: "Mistral",
    inputCostPerMillion: 0.40,
    outputCostPerMillion: 2.00,
    color: "#ff7000"
  },
  {
    id: "mistral-small",
    name: "Mistral Small",
    provider: "Mistral",
    inputCostPerMillion: 0.20,
    outputCostPerMillion: 0.20,
    color: "#ff7000"
  },
  {
    id: "mistral-mixtral-8x7b",
    name: "Mixtral 8x7B",
    provider: "Mistral",
    inputCostPerMillion: 0.60,
    outputCostPerMillion: 0.60,
    color: "#ff7000"
  },

  // Cohere
  {
    id: "cohere-command-r-plus",
    name: "Command R+ 08-2024",
    provider: "Cohere",
    inputCostPerMillion: 2.50,
    outputCostPerMillion: 10.00,
    color: "#39594D"
  },

  // Together AI
  {
    id: "together-llama4-maverick",
    name: "Llama 4 Maverick",
    provider: "Together AI",
    inputCostPerMillion: 0.27,
    outputCostPerMillion: 0.85,
    color: "#7C3AED"
  },
  {
    id: "together-llama4-scout",
    name: "Llama 4 Scout",
    provider: "Together AI",
    inputCostPerMillion: 0.18,
    outputCostPerMillion: 0.59,
    color: "#7C3AED"
  },
  {
    id: "together-llama31-8b-turbo",
    name: "Llama 3.1 8B Instruct Turbo",
    provider: "Together AI",
    inputCostPerMillion: 0.18,
    outputCostPerMillion: 0.18,
    color: "#7C3AED"
  },
  {
    id: "together-mixtral-8x7b",
    name: "Mixtral 8x7B Instruct v0.1",
    provider: "Together AI",
    inputCostPerMillion: 0.60,
    outputCostPerMillion: 0.60,
    color: "#7C3AED"
  },
  {
    id: "together-gpt-oss-120b",
    name: "gpt-oss-120B",
    provider: "Together AI",
    inputCostPerMillion: 0.15,
    outputCostPerMillion: 0.60,
    color: "#7C3AED"
  },
  {
    id: "together-gpt-oss-20b",
    name: "gpt-oss-20B",
    provider: "Together AI",
    inputCostPerMillion: 0.05,
    outputCostPerMillion: 0.20,
    color: "#7C3AED"
  },

  // Groq
  {
    id: "groq-llama31-8b",
    name: "Llama 3.1 8B Instant",
    provider: "Groq",
    inputCostPerMillion: 0.05,
    outputCostPerMillion: 0.08,
    color: "#f55036"
  },
  {
    id: "groq-llama4-scout",
    name: "Llama 4 Scout (17Bx16E)",
    provider: "Groq",
    inputCostPerMillion: 0.11,
    outputCostPerMillion: 0.34,
    color: "#f55036"
  },
  {
    id: "groq-llama4-maverick",
    name: "Llama 4 Maverick (17Bx128E)",
    provider: "Groq",
    inputCostPerMillion: 0.20,
    outputCostPerMillion: 0.60,
    color: "#f55036"
  },
  {
    id: "groq-gpt-oss-20b",
    name: "GPT OSS 20B",
    provider: "Groq",
    inputCostPerMillion: 0.075,
    outputCostPerMillion: 0.30,
    color: "#f55036"
  },
  {
    id: "groq-gpt-oss-120b",
    name: "GPT OSS 120B",
    provider: "Groq",
    inputCostPerMillion: 0.15,
    outputCostPerMillion: 0.60,
    color: "#f55036"
  }
];

export const useCaseDefaults = {
  "content-generation": {
    inputTokensPerCall: 500,
    outputTokensPerCall: 1500,
    callsPerMonth: 50000,
    description: "Blog posts, articles, marketing copy"
  },
  "chatbot": {
    inputTokensPerCall: 300,
    outputTokensPerCall: 200,
    callsPerMonth: 100000,
    description: "Customer support, conversational AI"
  },
  "code-assistant": {
    inputTokensPerCall: 800,
    outputTokensPerCall: 600,
    callsPerMonth: 30000,
    description: "Code generation, debugging, reviews"
  },
  "data-analysis": {
    inputTokensPerCall: 2000,
    outputTokensPerCall: 500,
    callsPerMonth: 10000,
    description: "Data processing, insights, reporting"
  },
  "general": {
    inputTokensPerCall: 500,
    outputTokensPerCall: 500,
    callsPerMonth: 50000,
    description: "General purpose AI assistant"
  },
  "translation": {
    inputTokensPerCall: 300,
    outputTokensPerCall: 300,
    callsPerMonth: 80000,
    description: "Text translation between languages"
  },
  "summarization": {
    inputTokensPerCall: 2000,
    outputTokensPerCall: 300,
    callsPerMonth: 40000,
    description: "Document and content summarization"
  }
};

// Quality tiers for smart recommendations
export type QualityTier = 'premium' | 'balanced' | 'budget';

// Define which models are suitable for each use case and quality tier
export const useCaseQualityMap: Record<string, Record<QualityTier, string[]>> = {
  "content-generation": {
    premium: ["openai-gpt5", "openai-gpt5-pro", "anthropic-opus-45", "anthropic-sonnet-45", "google-gemini-3-pro-preview", "google-gemini-25-pro"],
    balanced: ["openai-gpt5-mini", "openai-gpt41", "anthropic-haiku-45", "google-gemini-25-flash"],
    budget: ["openai-gpt5-nano", "anthropic-haiku-45", "google-gemini-25-flash-lite", "google-gemini-25-flash", "mistral-medium"]
  },
  "chatbot": {
    premium: ["openai-gpt5", "openai-gpt5-pro", "anthropic-sonnet-45", "google-gemini-3-pro-preview", "google-gemini-25-pro"],
    balanced: ["openai-gpt5-mini", "anthropic-haiku-45", "google-gemini-25-flash", "openai-gpt41-mini"],
    budget: ["openai-gpt5-nano", "google-gemini-25-flash-lite", "google-gemini-20-flash", "google-gemini-20-flash-lite", "mistral-small", "groq-llama4-scout"]
  },
  "code-assistant": {
    premium: ["openai-gpt5", "openai-gpt5-pro", "anthropic-sonnet-45", "anthropic-opus-45", "google-gemini-3-pro-preview", "google-gemini-25-pro"],
    balanced: ["openai-gpt5-mini", "openai-gpt41", "openai-o4-mini", "anthropic-haiku-45", "google-gemini-25-flash"],
    budget: ["openai-gpt41-mini", "anthropic-haiku-45"]
  },
  "data-analysis": {
    premium: ["openai-o4-mini", "openai-gpt5", "openai-gpt5-pro", "anthropic-opus-45", "anthropic-sonnet-45", "google-gemini-3-pro-preview", "google-gemini-25-pro"],
    balanced: ["openai-gpt5-mini", "openai-gpt41", "anthropic-haiku-45", "google-gemini-25-flash"],
    budget: ["openai-gpt41-mini", "google-gemini-25-flash-lite", "google-gemini-25-flash", "mistral-large"]
  },
  "general": {
    premium: ["openai-gpt5", "openai-gpt5-pro", "anthropic-sonnet-45", "google-gemini-3-pro-preview", "google-gemini-25-pro"],
    balanced: ["openai-gpt5-mini", "anthropic-haiku-45", "google-gemini-25-flash"],
    budget: ["openai-gpt5-nano", "google-gemini-25-flash-lite", "google-gemini-20-flash", "google-gemini-20-flash-lite", "mistral-small"]
  },
  "translation": {
    premium: ["openai-gpt5", "openai-gpt5-pro", "anthropic-sonnet-45", "google-gemini-3-pro-preview", "google-gemini-25-pro"],
    balanced: ["openai-gpt5-mini", "google-gemini-25-flash", "anthropic-haiku-45"],
    budget: ["openai-gpt41-nano", "mistral-small", "google-gemini-25-flash-lite", "google-gemini-20-flash", "google-gemini-20-flash-lite", "groq-llama31-8b"]
  },
  "summarization": {
    premium: ["openai-gpt5", "openai-gpt5-pro", "anthropic-sonnet-45", "google-gemini-3-pro-preview", "google-gemini-25-pro"],
    balanced: ["openai-gpt5-nano", "anthropic-haiku-45", "google-gemini-25-flash"],
    budget: ["openai-gpt41-nano", "mistral-small", "google-gemini-25-flash-lite", "google-gemini-20-flash-lite", "groq-llama31-8b", "together-llama31-8b-turbo"]
  }
};

