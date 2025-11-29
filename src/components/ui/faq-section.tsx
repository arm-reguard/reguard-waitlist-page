"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { ReactNode } from "react";

const faqs: Array<{
  question: string;
  answer: string | ReactNode;
}> = [
  {
    question: "How is reGuard different from monitoring tools like Helicone, Portkey, and Langfuse?",
    answer: "Monitoring tools send alerts when you approach budget limits, but your API calls continue and you still get billed. reGuard physically blocks API calls at your budget limit with a 429 error response. Set $500, spend $500, never $501. It's the only LLM API budget tool with enforceable hard spending limits that prevent surprise bills before they happen.",
  },
  {
    question: "Does reGuard integrate with my existing code?",
    answer: "Yes. Integration takes one line—just point your API calls to our proxy endpoint. No refactoring needed. We are also working on offereing native SDKs for Python, Node.js, and Go that handle routing automatically with zero added latency. Our proxy architecture ensures your requests are processed in real-time without performance degradation, so you get budget protection without sacrificing speed.",
  },
  {
    question: "What providers do you support?",
    answer: "OpenAI, Anthropic, Google, Deepseek, Mistral, Cohere, Together AI, Groq, and all OpenAI-compatible API. Replicate, Hugging Face, and more coming.",
  },
  {
    question: "What happens when I hit my budget limit?",
    answer: "API calls are instantly blocked with a standard HTTP 429 (Rate Limit Exceeded) error. Your application handles it like any other rate limit response. You can configure custom error messages and fallback behaviors. This prevents unexpected charges while giving you full control over how your app responds to budget constraints, whether that's switching to a cheaper model, queuing requests, or notifying users.",
  },
  {
    question: "Can I track costs per customer or feature?",
    answer: "Yes. Pass customer IDs or feature tags in request headers. We'll break down costs automatically by customer, feature, or API endpoint in your dashboard. This helps you identify high-cost users, optimize pricing models, and understand which features drive the most API spending.",
  },
  {
    question: "What's the pricing model?",
    answer: "reGuard uses a flat-rate pricing model with no usage-based fees. You pay a predictable monthly/yearly subscription regardless of how many API calls you make or how much you spend. Pricing tiers will be announced before beta launch—join the waitlist for early access details and early adopter benefits.",
  },
  {
    question: "How can I get beta access? Is it free?",
    answer: (
      <>
        Yes, the beta access is completely free. Take our{" "}
        <Link 
          href="https://reguard.fillout.com/survey" 
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-400 hover:text-purple-300 underline transition-colors"
        >
          2-minute validation survey
        </Link>{" "}
        to share your API cost challenges and get priority access when we launch. We're accepting a limited number of beta testers in Q1 2026, so early signups get first access to test reGuard in production environments.
      </>
    ),
  },
];

export function FAQSection() {
  return (
    <section className="relative z-50 pt-8 sm:pt-12 pb-16 sm:pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 
          className="text-2xl sm:text-3xl md:text-[2.5rem] lg:text-[2.75rem] xl:text-[2.75rem] font-bold tracking-tight text-center mb-8 sm:mb-10"
          style={{ fontFamily: 'var(--font-meriva)' }}
        >
          <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
            Frequently Asked Questions
          </span>
        </h1>
        
        <Accordion type="single" collapsible className="w-full space-y-0">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border-b border-zinc-800/50 last:border-b-0 scroll-mt-0"
            >
              <AccordionTrigger className="text-left text-base sm:text-lg font-semibold text-white py-4 sm:py-6 hover:text-purple-400 transition-colors duration-300 [&[data-state=open]]:text-purple-400 cursor-pointer">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm sm:text-base text-zinc-400 pb-4 sm:pb-6 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

