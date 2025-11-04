# Smart Recommendation Logic - All Use Cases

## Quality Requirements by Use Case

### 🔴 CRITICAL (Never Downgrade from Premium)
**Use Cases:** `code-assistant`, `data-analysis`

**Why:** These require complex reasoning, architecture design, and deep analysis. Quality degradation significantly impacts output.

**Recommendation Rules:**
- **Premium → Premium only** (find cheaper premium alternative, stay premium)
- **Balanced → Balanced or upgrade to Premium** (never suggest budget)
- **Budget → Budget or upgrade to Balanced** (suggest improvement path)

**Example:**
- Using GPT-5 for code-assistant? Won't recommend GPT-5 mini (would break complex code tasks)
- Using Opus 4.1 for data-analysis? Won't recommend Haiku (would miss nuanced insights)

---

### 🟡 HIGH QUALITY (Premium → Balanced OK, but not Budget)
**Use Cases:** `content-generation`, `translation`

**Why:** Quality matters for brand voice and accuracy, but balanced models can handle most scenarios well.

**Recommendation Rules:**
- **Premium → Premium or Balanced** (can downgrade one tier safely)
- **Balanced → Balanced or Budget** (flexible for routine content)
- **Budget → Budget or Balanced** (suggest improvement if needed)

**Example:**
- Using GPT-5 for content? Can recommend GPT-5 mini (still high quality for most content)
- Using Sonnet 4.5 for translation? Can recommend Haiku 4.5 (good for routine translations)

---

### 🟢 MODERATE (Flexible Downgrading)
**Use Cases:** `chatbot`, `summarization`, `general`

**Why:** These can tolerate more quality variance. Budget models handle simple queries well.

**Recommendation Rules:**
- **Premium → Premium or Balanced** (suggest cost-effective balanced option)
- **Balanced → Balanced or Budget** (freely suggest budget for cost savings)
- **Budget → Budget** (stay budget, it's already optimal for cost)

**Example:**
- Using GPT-5 for chatbot? Can recommend GPT-5 mini or even GPT-4.1 mini (handles FAQs fine)
- Using Sonnet for summarization? Can recommend Haiku (great for summaries)

---

## Smart Recommendations (Multi-Provider Diversity)

### Logic: Prioritize Provider Diversity

**Goal:** Show users they can get similar quality from different providers at different price points

**Algorithm:**
1. Get quality tier lists (budget, balanced, premium) for the use case
2. Track which providers have been recommended
3. For each tier:
   - **First try:** Find cheapest model from a NEW provider
   - **Fallback:** If all providers used, pick cheapest available

**Result:** Recommendations naturally diversify across providers

**Example for Code Assistant:**
- Budget: Groq Llama 3.1 8B (provider: Groq)
- Balanced: OpenAI GPT-5 mini (provider: OpenAI) 
- Premium: Anthropic Sonnet 4.5 (provider: Anthropic)

**Example for Chatbot:**
- Budget: Groq Llama 3.1 8B (provider: Groq)
- Balanced: Google Gemini 2.5 Flash (provider: Google)
- Premium: OpenAI GPT-5 (provider: OpenAI)

---

## Provider-Specific Optimization

### Logic: Based on User's Current Selection

**Input:** User selected OpenAI GPT-5 and Anthropic Sonnet 4.5 for code-assistant

**Process:**
1. Identify current model per provider (GPT-5, Sonnet 4.5)
2. Check use case category (code-assistant = CRITICAL)
3. For CRITICAL + Premium tier: Only look at other premium models
4. Find cheaper premium alternative within same provider
5. Calculate savings

**Output:**
- OpenAI: "Currently using GPT-5 ($210/mo)" → No cheaper premium alternative → "Already optimal"
- Anthropic: "Currently using Sonnet 4.5 ($342/mo)" → No cheaper premium alternative → "Already optimal"

**If they were using GPT-5 pro ($2,520/mo) for code-assistant:**
- OpenAI: "Currently using GPT-5 pro" → "Switch to GPT-5 ($210/mo)" → Save $2,310/mo (92% less)

---

## Quality Tier Definitions (per Use Case)

Defined in `pricing-data.ts` → `useCaseQualityMap`

**Example for code-assistant:**
```typescript
"code-assistant": {
  premium: ["openai-gpt5", "anthropic-sonnet-45", "google-gemini-25-pro"],
  balanced: ["openai-gpt5-mini", "anthropic-haiku-45", "google-gemini-25-flash"],
  budget: ["openai-gpt41-nano", "mistral-small", "groq-llama31-8b"]
}
```

---

## Testing Checklist

### ✅ Code Assistant (CRITICAL)
- [ ] Premium (GPT-5) → Won't recommend mini
- [ ] Premium (Opus 4.1) → Won't recommend Haiku
- [ ] Shows correct selected model, not assumed model

### ✅ Data Analysis (CRITICAL)
- [ ] Premium → Premium only
- [ ] Balanced → Balanced or Premium
- [ ] Budget → Budget or Balanced

### ✅ Content Generation (HIGH QUALITY)
- [ ] Premium → Can suggest Balanced
- [ ] Premium → Won't suggest Budget
- [ ] Balanced → Can suggest Budget

### ✅ Translation (HIGH QUALITY)
- [ ] Premium → Can suggest Balanced
- [ ] Premium → Won't suggest Budget

### ✅ Chatbot (MODERATE)
- [ ] Premium → Can suggest Balanced
- [ ] Balanced → Can suggest Budget
- [ ] More flexible overall

### ✅ Summarization (MODERATE)
- [ ] Premium → Can suggest Balanced
- [ ] Balanced → Can suggest Budget

### ✅ General (MODERATE)
- [ ] Flexible recommendations across tiers

---

## Summary

**Key Principles:**
1. **Respect use case complexity** - Don't recommend downgrades for critical tasks
2. **Diversify providers** - Show users there are alternatives
3. **Use actual selected models** - Not assumptions
4. **Balance cost and quality** - Smart middle ground

**Result:** Users get practical, valuable recommendations that respect their needs while showing cost-saving opportunities.

