'use client'

import Script from 'next/script'

// Hardcoded fallback to ensure it always works
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-R5XYMCXD29'

export default function GoogleAnalytics() {
  return (
    <>
      {/* Google tag (gtag.js) - Exact format from Google */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  )
}

// ============================================
// Google Analytics Event Tracking Utilities
// ============================================

// Declare gtag on window for TypeScript
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'consent',
      targetId: string,
      config?: Record<string, unknown>
    ) => void
  }
}

/**
 * Track waitlist signup event
 * @param email - User's email (hashed for privacy)
 */
export const trackWaitlistSignup = (email?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'waitlist_signup', {
      event_category: 'engagement',
      event_label: 'Waitlist Form Submission',
      email_domain: email ? email.split('@')[1] : undefined,
    })
  }
}

/**
 * Track survey completion event
 * @param surveyType - Type of survey completed
 */
export const trackSurveyComplete = (surveyType?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'survey_complete', {
      event_category: 'engagement',
      event_label: 'Validation Survey Completed',
      survey_type: surveyType,
    })
  }
}

/**
 * Track calculator usage event
 * @param action - Specific calculator action (e.g., 'calculate', 'compare', 'export')
 * @param provider - LLM provider being calculated
 */
export const trackCalculatorUse = (action?: string, provider?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'calculator_use', {
      event_category: 'engagement',
      event_label: 'Cost Calculator Used',
      calculator_action: action,
      llm_provider: provider,
    })
  }
}

/**
 * Track CTA button clicks
 * @param ctaName - Name/identifier of the CTA button
 * @param ctaLocation - Where on the page the CTA is located
 */
export const trackCTAClick = (ctaName: string, ctaLocation?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'cta_click', {
      event_category: 'engagement',
      event_label: ctaName,
      cta_location: ctaLocation,
    })
  }
}

/**
 * Track page views (for SPA navigation)
 * @param url - Page URL
 * @param title - Page title
 */
export const trackPageView = (url: string, title?: string) => {
  if (typeof window !== 'undefined' && window.gtag && GA_MEASUREMENT_ID) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
      page_title: title,
    })
  }
}

