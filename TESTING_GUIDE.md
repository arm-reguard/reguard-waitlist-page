# Testing Guide for LLM API Cost Calculator

## Quick Start

```bash
# Make sure dependencies are installed
npm install

# Start development server
npm run dev

# Open browser to http://localhost:3000
```

## Manual Testing Checklist

### 1. Page Load & Initial State
- [ ] Page loads without errors
- [ ] Calculator section appears below the hero section
- [ ] Default use case is "Content Generation"
- [ ] Default values: 50,000 calls, 500 input tokens, 1,500 output tokens
- [ ] All 37 models displayed by default
- [ ] Table shows top 10 models with "Show More" button
- [ ] Cheapest model has green background and "BEST VALUE" badge

### 2. Calculator Interactions

#### Use Case Selection
- [ ] Select "Chatbot" - values update to 100K calls, 300 input, 200 output
- [ ] Select "Code Assistant" - values update to 30K calls, 800 input, 600 output
- [ ] Select "Data Analysis" - values update to 10K calls, 2000 input, 500 output
- [ ] Select "General" - values update to 50K calls, 500 input, 500 output

#### Slider Control
- [ ] Drag slider left and right - number updates in real-time
- [ ] Slider range: 1,000 to 500,000
- [ ] Cost calculations update immediately as slider moves

#### Number Inputs
- [ ] Type in Monthly API Calls input - calculations update
- [ ] Type in Input Tokens input - calculations update
- [ ] Type in Output Tokens input - calculations update
- [ ] Try invalid values (negative, zero) - should default to minimum 1
- [ ] Try very large values (100K+ tokens) - should calculate correctly

#### Provider Filters
- [ ] Click "OpenAI" - only OpenAI models shown
- [ ] Click "Anthropic" - only Anthropic models shown
- [ ] Click multiple providers - shows union of selected providers
- [ ] Unclick all filters - shows all models again

### 3. Results Display

#### Insights Panel
- [ ] Savings card shows correct difference between cheapest and most expensive
- [ ] Annual projection shows correct calculation (monthly × 12)
- [ ] Recommendations appear for high volume (>100K calls)
- [ ] Recommendations appear for large context (>1500 tokens)
- [ ] reGuard value props section displays correctly

#### Visual Chart
- [ ] Bar chart displays with top 8 models
- [ ] Bars are colored by provider
- [ ] Cheapest model bar is green
- [ ] Hover over bars shows tooltip with exact cost
- [ ] Chart is readable and labels not overlapping

#### Comparison Table
- [ ] Table shows all columns: Provider & Model, Input Cost, Output Cost, Total/Month
- [ ] Costs formatted as currency ($X.XX)
- [ ] Provider color dots display correctly
- [ ] "BEST VALUE" badge only on cheapest model
- [ ] Rows have hover effect
- [ ] "Show All" button expands to show all models
- [ ] After clicking "Show All", button changes to "Show Less"

#### Pricing Note
- [ ] Footer note about Claude Sonnet 4.5 tiered pricing is visible
- [ ] Note is readable and properly formatted

### 4. Navigation & CTAs

#### Hero to Calculator
- [ ] "Try our API Cost Calculator" link visible in hero section
- [ ] Click link - smoothly scrolls to calculator section
- [ ] Link only shows when waitlist form is visible (not after submission)

#### Calculator to Waitlist
- [ ] "Join Waitlist" button visible at bottom of calculator
- [ ] Click button - smoothly scrolls to top of page
- [ ] After clicking, waitlist form is visible and ready for input

### 5. Mobile Responsiveness

#### Test on Mobile (< 640px width)
- [ ] Calculator inputs stack vertically
- [ ] Table scrolls horizontally if needed
- [ ] Provider filter buttons wrap properly
- [ ] Insights cards stack vertically
- [ ] Chart height adjusts appropriately
- [ ] Text remains readable
- [ ] Touch targets are large enough (44px minimum)
- [ ] Slider thumb is easy to drag on touch

#### Test on Tablet (640px - 1024px)
- [ ] Layout adapts to medium screens
- [ ] Insights show 2 columns
- [ ] Table remains readable
- [ ] No horizontal scroll on main page

### 6. Performance

- [ ] Calculations complete in < 100ms
- [ ] No lag when dragging slider
- [ ] No lag when typing in inputs
- [ ] Page animations smooth (60fps)
- [ ] No console errors in browser devtools
- [ ] No console warnings about React keys or renders

### 7. Accessibility

#### Keyboard Navigation
- [ ] Tab through all form inputs in logical order
- [ ] Focus states visible on all interactive elements
- [ ] Enter key submits waitlist form
- [ ] Escape key doesn't break anything

#### Screen Reader
- [ ] Form labels announced correctly
- [ ] Results table has proper headers
- [ ] Button purposes clear from labels

#### Color Contrast
- [ ] All text meets WCAG AA standards (4.5:1 ratio)
- [ ] Purple text on dark background readable
- [ ] Gray text on dark background readable

### 8. Edge Cases

#### Extreme Values
- [ ] 1 call/month with 1 token - shows very small costs ($0.00)
- [ ] 10M calls/month with 100K tokens - shows large costs correctly
- [ ] Switch between extremes - no errors

#### Filtering
- [ ] Filter to single provider with 1 model - works correctly
- [ ] Filter to provider with no models - shows empty state
- [ ] Clear all filters - returns to showing all models

#### Data Accuracy
- [ ] Manually verify 2-3 calculations:
  - Example: 50K calls, 500 input, 1500 output with GPT-5 mini
  - Input cost: (50000 × 500 / 1M) × $0.25 = $6.25
  - Output cost: (50000 × 1500 / 1M) × $2.00 = $150.00
  - Total: $156.25 ✓

### 9. Visual Polish

- [ ] All sections aligned properly
- [ ] Consistent spacing throughout
- [ ] Brand colors match existing page
- [ ] Animations feel natural, not jarring
- [ ] No layout shift during load
- [ ] Smooth transitions between states

### 10. Integration with Existing Page

- [ ] Hero section unchanged
- [ ] Waitlist form unchanged
- [ ] Stats section unchanged
- [ ] "Coming Soon" badge unchanged
- [ ] Aurora background animation works
- [ ] Navigation logo clickable
- [ ] No visual glitches or overlaps

## Browser Compatibility Testing

Test in these browsers:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## Build & Production Testing

```bash
# Production build
npm run build

# Start production server
npm start

# Test on http://localhost:3000
```

- [ ] Production build completes without errors
- [ ] No warnings during build
- [ ] Production version works identically to dev
- [ ] All assets load correctly
- [ ] No 404 errors in network tab

## Known Issues & Limitations

1. **Chart on very small screens** - Chart may be cramped on screens < 375px
2. **Recharts dependency** - Requires `react-is` peer dependency (now installed)
3. **Client-side only** - All calculations happen in browser (no server validation)

## What to Check Before Deploying

- [ ] All tests above passed
- [ ] No console errors
- [ ] Lighthouse score > 90
- [ ] No broken links
- [ ] All images load
- [ ] Analytics ready (if applicable)
- [ ] Git changes reviewed
- [ ] Ready to push to GitHub

## Automated Testing (Future Enhancement)

Consider adding:
- Unit tests for calculation functions
- Integration tests for calculator component
- E2E tests with Playwright or Cypress
- Visual regression tests

---

**Status**: Manual testing required before production deployment
**Last Updated**: [Current Date]

