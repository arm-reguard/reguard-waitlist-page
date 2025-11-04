# 3D Visualization - Quick Testing Guide

## 🧪 How to Test

### Step 1: Start Dev Server
```bash
npm run dev
```

### Step 2: Navigate to Calculator
```
http://localhost:3000
```
Scroll down to the cost calculator section.

### Step 3: Find the "View in 3D" Button
- Look for the Visual Comparison section
- You should see a pulsing button in the top-right that says "🌐 View in 3D PREVIEW"
- Button should have:
  - Purple-to-blue gradient background
  - Subtle pulse animation
  - Glow effect when you hover

### Step 4: Click the Button
- Modal should open full-screen
- Loading spinner should appear for 2-3 seconds (first time only)
- 3D visualization should render

### Step 5: Test 3D Interactions
1. **Auto-rotation:** 3D scene should slowly rotate automatically
2. **Drag:** Click and drag to rotate the view manually
3. **Zoom:** Scroll up/down to zoom in/out
4. **Hover:** Move mouse over spheres to see tooltip with:
   - Provider name with color dot
   - Model name
   - Monthly cost
   - Token pricing (input/output)

### Step 6: Check Visual Elements
- [ ] Provider legend at top (color-coded list)
- [ ] "Sphere size = Monthly cost" text at bottom-right
- [ ] Spheres have glow effects
- [ ] Colors match the 2D chart exactly
- [ ] If 30+ models, see "Showing top 30..." message

### Step 7: Test CTA
- Scroll down in modal to see CTA section
- Click "Join Waitlist for Early Access"
- Modal should close
- Page should scroll to top (waitlist form)

### Step 8: Test Close Button
- Open modal again
- Click X button in top-right corner
- Modal should close smoothly
- Calculator should still be in same state

---

## 🔍 What to Check

### Visual Quality:
- [ ] Spheres render smoothly (no flickering)
- [ ] Colors are vibrant and match 2D chart
- [ ] Glow effects are visible but not overpowering
- [ ] Text is readable
- [ ] No UI elements overlapping

### Performance:
- [ ] Smooth 60fps rotation
- [ ] No lag when dragging
- [ ] Zoom is responsive
- [ ] Tooltips appear instantly on hover
- [ ] No console errors

### Functionality:
- [ ] All existing calculator features still work
- [ ] Changing filters → 3D updates when reopened
- [ ] Modal doesn't affect scroll position
- [ ] Multiple open/close cycles work fine

---

## 🐛 Common Issues to Check

### Issue: Modal doesn't open
**Check:**
- Console for errors
- Button click handler is working
- State is updating (`show3DModal`)

### Issue: 3D doesn't render
**Check:**
- WebGL is supported (check browser)
- Three.js loaded correctly
- No console errors
- Try different browser

### Issue: Tooltips don't show
**Check:**
- Hover detection is working
- Tooltip position calculation
- Z-index of tooltip element

### Issue: Colors don't match 2D chart
**Check:**
- `PROVIDER_COLORS` object in CostVisualization3D.tsx
- Make sure colors are exact hex values
- Check CostChart.tsx for source colors

---

## 📸 Screenshots to Take

1. **Button in calculator** (before click)
2. **Modal opened** (full 3D view)
3. **Hover tooltip** (showing model details)
4. **Provider legend** (top of 3D view)
5. **CTA section** (bottom of modal)

---

## ✅ Quick Checklist

**Before Deploying:**
- [ ] Tested on Chrome
- [ ] Tested on Firefox
- [ ] Tested on Safari
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Build succeeds (`npm run build`)
- [ ] Button looks good
- [ ] 3D renders smoothly
- [ ] Modal opens/closes cleanly
- [ ] CTA works
- [ ] Existing calculator unaffected

---

## 🎯 Test Scenarios

### Scenario 1: Default State
1. Load page
2. See all providers (no filter)
3. Click "View in 3D"
4. Should show all available models (up to 30)

### Scenario 2: Single Provider
1. Select only OpenAI
2. Click "View in 3D"
3. Should show only green spheres (OpenAI)

### Scenario 3: Multi-Provider
1. Select OpenAI + Anthropic
2. Click "View in 3D"
3. Should show green (OpenAI) and red (Anthropic) spheres

### Scenario 4: Many Models
1. Select all providers
2. Click "View in 3D"
3. Should show "Showing top 30..." message
4. Should only render 30 spheres

### Scenario 5: After Filter Change
1. Open 3D with all providers
2. Close modal
3. Deselect some providers
4. Open 3D again
5. Should show updated set of models

---

## 🚀 Ready to Go Live?

**Final Check:**
- ✅ Everything works locally
- ✅ No console errors
- ✅ Build passes
- ✅ Performance is smooth
- ✅ Design looks polished
- ✅ CTA drives conversions

**Deploy it!** 🎉

