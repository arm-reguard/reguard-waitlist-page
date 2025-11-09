"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { pricingData, useCaseDefaults, useCaseQualityMap } from "@/lib/pricing-data";
import { calculateCost, CalculationInputs, formatCurrency, getSmartRecommendations, getProviderRecommendations } from "@/lib/calculator-utils";
import { ComparisonTable } from "./ComparisonTable";
import { InsightsPanel } from "./InsightsPanel";
import { CostVisualization3DModal } from "./CostVisualization3DModal";
import { ReGuardButton } from "@/components/ui/reguard-button";
import { CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";

// Lazy load the heavy chart component to improve initial page load
const CostChart = dynamic(() => import("./CostChart").then(mod => ({ default: mod.CostChart })), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[450px] md:h-[550px] flex items-center justify-center">
      <div className="text-zinc-400 text-sm">Loading chart...</div>
    </div>
  ),
});

type UseCase = keyof typeof useCaseDefaults;

interface ProviderModelSelection {
  provider: string;
  modelId: string;
}

export function CostCalculator() {
  const [useCase, setUseCase] = useState<UseCase>("content-generation");
  const [callsPerMonth, setCallsPerMonth] = useState(50000);
  const [inputTokens, setInputTokens] = useState(500);
  const [outputTokens, setOutputTokens] = useState(1500);
  const [selectedProviders, setSelectedProviders] = useState<Set<string>>(new Set());
  const [selectedModels, setSelectedModels] = useState<ProviderModelSelection[]>([]);
  const [show3DModal, setShow3DModal] = useState(false);
  const [showAllProviders, setShowAllProviders] = useState(false);
  const [showDetailedBreakdown, setShowDetailedBreakdown] = useState(false);
  
  // Ref to preserve scroll position when toggling sections
  const breakdownButtonRef = useRef<HTMLButtonElement>(null);

  // Handler to toggle breakdown while preserving scroll position
  const handleToggleBreakdown = useCallback(() => {
    // Capture current scroll position
    const currentScrollY = window.scrollY || window.pageYOffset;
    
    // Toggle the state
    setShowDetailedBreakdown(prev => !prev);

    // Restore scroll position immediately after render completes
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo(0, currentScrollY);
      });
    });
  }, []);

  // Update inputs when use case changes
  const handleUseCaseChange = useCallback((newUseCase: UseCase) => {
    // Capture current scroll position
    const scrollY = window.scrollY;
    
    setUseCase(newUseCase);
    const defaults = useCaseDefaults[newUseCase];
    setInputTokens(defaults.inputTokensPerCall);
    setOutputTokens(defaults.outputTokensPerCall);
    setCallsPerMonth(defaults.callsPerMonth);
    
    // Restore scroll position after state update
    requestAnimationFrame(() => {
      window.scrollTo(0, scrollY);
    });
  }, []);

  // Get unique providers
  const allProviders = useMemo(
    () => Array.from(new Set(pricingData.map((m) => m.provider))),
    []
  );

  // Top providers to show by default (rest hidden behind "Show More")
  const topProviders = ['OpenAI', 'Anthropic', 'Google', 'Mistral'];
  const otherProviders = allProviders.filter(p => !topProviders.includes(p));
  const visibleProviders = showAllProviders ? allProviders : topProviders.filter(p => allProviders.includes(p));

  // Filter and calculate costs
  const calculatedModels = useMemo(() => {
    const inputs: CalculationInputs = {
      inputTokensPerCall: inputTokens,
      outputTokensPerCall: outputTokens,
      callsPerMonth,
    };

    let models = pricingData;

    // Filter by selected providers if any are selected
    if (selectedProviders.size > 0) {
      models = models.filter((m) => selectedProviders.has(m.provider));
    }

    // Calculate costs and sort by total cost
    return models
      .map((model) => calculateCost(model, inputs))
      .sort((a, b) => a.totalCost - b.totalCost);
  }, [inputTokens, outputTokens, callsPerMonth, selectedProviders]);

  // Best budget model for the current use case (only when no providers selected)
  const bestBudgetModel = useMemo(() => {
    if (selectedProviders.size > 0) {
      return calculatedModels[0]; // Use cheapest from selected providers
    }

    // When no providers selected, find best budget model for this use case
    const inputs: CalculationInputs = {
      inputTokensPerCall: inputTokens,
      outputTokensPerCall: outputTokens,
      callsPerMonth,
    };

    const qualityTiers = useCaseQualityMap[useCase] || useCaseQualityMap['general'];
    const budgetModelIds = qualityTiers.budget;
    
    // Filter to only budget-tier models for this use case
    const budgetModels = pricingData
      .filter((m) => budgetModelIds.includes(m.id))
      .map((model) => calculateCost(model, inputs))
      .sort((a, b) => a.totalCost - b.totalCost);

    return budgetModels[0] || calculatedModels[0]; // Fallback to cheapest overall
  }, [inputTokens, outputTokens, callsPerMonth, selectedProviders, useCase, calculatedModels]);

  // Toggle provider filter
  const toggleProvider = (provider: string) => {
    // Capture current scroll position
    const scrollY = window.scrollY;
    
    setSelectedProviders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(provider)) {
        newSet.delete(provider);
        // Remove all models from this provider
        setSelectedModels((prevModels) => 
          prevModels.filter((m) => m.provider !== provider)
        );
      } else {
        newSet.add(provider);
        // Auto-select first model from this provider
        const firstModel = pricingData.find((m) => m.provider === provider);
        if (firstModel) {
          setSelectedModels((prevModels) => [
            ...prevModels,
            { provider, modelId: firstModel.id }
          ]);
        }
      }
      return newSet;
    });
    
    // Restore scroll position after state update
    requestAnimationFrame(() => {
      window.scrollTo(0, scrollY);
    });
  };

  // Handle model selection for a provider
  const handleModelSelection = (provider: string, modelId: string) => {
    // Capture current scroll position
    const scrollY = window.scrollY;
    
    setSelectedModels((prev) => {
      const filtered = prev.filter((m) => m.provider !== provider);
      return [...filtered, { provider, modelId }];
    });
    
    // Restore scroll position after state update
    requestAnimationFrame(() => {
      window.scrollTo(0, scrollY);
    });
  };

  // Calculate multi-provider total cost
  const multiProviderTotalCost = useMemo(() => {
    if (selectedModels.length === 0) return null;
    
    const inputs: CalculationInputs = {
      inputTokensPerCall: inputTokens,
      outputTokensPerCall: outputTokens,
      callsPerMonth,
    };

    let total = 0;
    const breakdown: { provider: string; model: string; cost: number }[] = [];

    // Group by unique modelId to avoid duplicates
    const uniqueSelections = selectedModels.reduce((acc, selection) => {
      acc[selection.modelId] = selection;
      return acc;
    }, {} as Record<string, ProviderModelSelection>);

    // Calculate cost for each unique selection
    Object.values(uniqueSelections).forEach((selection) => {
      const model = pricingData.find((m) => m.id === selection.modelId);
      if (model) {
        const calculated = calculateCost(model, inputs);
        total += calculated.totalCost;
        breakdown.push({
          provider: model.provider,
          model: model.name,
          cost: calculated.totalCost,
        });
      }
    });

    return { total, breakdown };
  }, [selectedModels, inputTokens, outputTokens, callsPerMonth]);

  // Scroll to waitlist
  const scrollToWaitlist = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative z-50 w-full max-w-7xl mx-auto px-4">
      {/* Section Header */}
      <div className="relative z-50 text-center mb-8">
        <h2
          className="text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-[2.5rem] lg:text-[2.75rem] xl:text-[2.75rem] mb-4"
          style={{ fontFamily: 'var(--font-meriva)' }}
        >
          <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
            Calculate your LLM API costs
          </span>
        </h2>
        <p className="text-base sm:text-lg md:text-lg text-zinc-300 max-w-2xl mx-auto">
          Adjust parameters to see real-time cost comparisons across providers
        </p>
      </div>

      {/* Sidebar + Main Content Grid */}
      <div className="relative z-50 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 mb-8">
        {/* SIDEBAR - Input Controls */}
        <div className="relative z-50 rounded-xl p-5 border border-zinc-800/50 bg-zinc-900/95 h-fit lg:sticky lg:top-4">
          <div className="space-y-4">
            {/* Use Case Dropdown */}
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Use Case
              </label>
              <select
                value={useCase}
                onChange={(e) => handleUseCaseChange(e.target.value as UseCase)}
                className="w-full pl-3 pr-9 py-2 text-sm rounded-lg bg-[#0A0A0B] border border-zinc-700 text-white focus:outline-none focus:border-purple-500 transition-colors appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns%3d%22http%3a%2f%2fwww.w3.org%2f2000%2fsvg%22%20viewBox%3d%220%200%2020%2020%22%20fill%3d%22none%22%3e%3cpath%20d%3d%22M7%207l3%203%203-3%22%20stroke%3d%22%239CA3AF%22%20stroke-width%3d%221.5%22%20stroke-linecap%3d%22round%22%20stroke-linejoin%3d%22round%22%2f%3e%3c%2fsvg%3e')] bg-[length:1.25rem] bg-[center_right_0.5rem] bg-no-repeat"
              >
                {Object.entries(useCaseDefaults).map(([key, value]) => (
                  <option key={key} value={key}>
                    {key.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </option>
                ))}
              </select>
            </div>

            {/* Monthly Calls Input */}
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Monthly API Calls
              </label>
              <input
                type="number"
                value={callsPerMonth}
                onChange={(e) => setCallsPerMonth(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                max="10000000"
                className="w-full px-3 py-2 text-sm rounded-lg bg-[#0A0A0B] border border-zinc-700 text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            {/* Tokens Per Call */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Input Tokens
                </label>
                <input
                  type="number"
                  value={inputTokens}
                  onChange={(e) => setInputTokens(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  max="100000"
                  className="w-full px-3 py-2 text-sm rounded-lg bg-[#0A0A0B] border border-zinc-700 text-white focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Output Tokens
                </label>
                <input
                  type="number"
                  value={outputTokens}
                  onChange={(e) => setOutputTokens(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  max="100000"
                  className="w-full px-3 py-2 text-sm rounded-lg bg-[#0A0A0B] border border-zinc-700 text-white focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>

            {/* Compact Slider */}
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                {callsPerMonth.toLocaleString()} calls/mo
              </label>
              <input
                type="range"
                min="1000"
                max="500000"
                step="1000"
                value={callsPerMonth}
                onChange={(e) => setCallsPerMonth(parseInt(e.target.value))}
                className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider-purple"
              />
              <div className="flex justify-between text-[10px] text-zinc-300 mt-0.5">
                <span>1K</span>
                <span>500K</span>
              </div>
            </div>

            {/* Provider Selection */}
            <div className="pt-3 border-t border-zinc-800/50">
              <label className="block text-xs font-medium text-zinc-300 mb-2">
                Providers
              </label>
              <div className="space-y-2">
                {visibleProviders.map((provider) => {
                  const isSelected = selectedProviders.has(provider);
                  const providerModels = pricingData.filter((m) => m.provider === provider);
                  const providerColor = providerModels[0]?.color;
                  const selectedModel = selectedModels.find((m) => m.provider === provider);
                  
                  return (
                    <div key={provider} className="space-y-1">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleProvider(provider)}
                          className="w-3.5 h-3.5 rounded border-zinc-600 text-purple-600 focus:ring-purple-500 focus:ring-offset-0 bg-zinc-800"
                        />
                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: providerColor }}
                        />
                        <span className="text-sm text-white">{provider}</span>
                      </label>
                      
                      {/* Inline Model Dropdown */}
                      {isSelected && (
                        <div className="ml-6 pl-2 border-l-2 border-zinc-700/50">
                          <select
                            value={selectedModel?.modelId || ''}
                            onChange={(e) => handleModelSelection(provider, e.target.value)}
                            className="w-full pl-2 pr-8 py-1.5 text-xs rounded bg-zinc-800/50 border border-zinc-700/50 text-zinc-300 focus:outline-none focus:border-purple-500 transition-colors appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns%3d%22http%3a%2f%2fwww.w3.org%2f2000%2fsvg%22%20viewBox%3d%220%200%2020%2020%22%20fill%3d%22none%22%3e%3cpath%20d%3d%22M7%207l3%203%203-3%22%20stroke%3d%22%239CA3AF%22%20stroke-width%3d%221.5%22%20stroke-linecap%3d%22round%22%20stroke-linejoin%3d%22round%22%2f%3e%3c%2fsvg%3e')] bg-[length:1rem] bg-[center_right_0.375rem] bg-no-repeat"
                          >
                            {providerModels.map((model) => (
                              <option key={model.id} value={model.id}>
                                {model.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Show More/Less Button */}
              {otherProviders.length > 0 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowAllProviders(!showAllProviders);
                  }}
                  className="w-full mt-3 px-3 py-1.5 text-xs font-medium text-purple-300 hover:text-purple-200 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  {showAllProviders ? (
                    <>
                      <ChevronUp className="w-3 h-3" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3 h-3" />
                      Show {otherProviders.length} More
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Compact Note */}
            <div className="pt-3 border-t border-zinc-800/50">
              <p className="text-[10px] text-zinc-300 leading-relaxed">
                * More providers coming soon
              </p>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT - Bento Grid */}
        <div className="relative z-50 space-y-5">
          {/* ROW 1: Setup Summary (Full Width) */}
          {calculatedModels.length > 0 && (
            <div className="relative z-50 rounded-xl border border-zinc-700/50 hover:border-purple-500/50 transition-colors bg-zinc-900/95 p-5">
              <h3 className="text-xl font-bold text-white mb-2">
                {selectedProviders.size >= 2 
                  ? 'Your Multi-Provider Setup' 
                  : selectedProviders.size === 1 
                    ? 'Your Current Setup' 
                    : 'Best Budget Setup'}
              </h3>
              <p className="text-sm text-zinc-300 mb-4">
                {selectedProviders.size >= 2
                  ? 'Current configuration and monthly costs for your selected providers'
                  : selectedProviders.size === 1
                    ? 'Your current configuration and estimated monthly costs'
                    : 'Most cost-effective option for your use case'}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <div className="text-xs text-zinc-300 mb-1">Use Case</div>
                  <div className="text-base text-white font-semibold">
                    {useCase.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-zinc-300 mb-1">Monthly Volume</div>
                  <div className="text-base text-white font-semibold">
                    {callsPerMonth.toLocaleString()} calls
                  </div>
                </div>
                <div>
                  <div className="text-xs text-zinc-300 mb-1">Avg Tokens/Call</div>
                  <div className="text-base text-white font-semibold">
                    {inputTokens} in / {outputTokens} out
                  </div>
                </div>
                <div>
                  <div className="text-xs text-zinc-300 mb-1">
                    {selectedProviders.size > 0 ? 'Selected Providers' : 'All Providers'}
                  </div>
                  <div className="text-base text-white font-semibold">
                    {selectedProviders.size > 0 
                      ? `${selectedProviders.size} selected`
                      : `${calculatedModels.length} models`}
                  </div>
                </div>
              </div>

              {/* Cost Summary */}
              {multiProviderTotalCost && multiProviderTotalCost.breakdown.length > 0 ? (
                <div className="mt-5 pt-5 border-t border-zinc-700/50">
                  <div className="text-xs text-zinc-300 mb-3">Multi-Provider Cost Breakdown:</div>
                  <div className="space-y-2 mb-4">
                    {multiProviderTotalCost.breakdown.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="text-zinc-300">
                          {item.provider} {item.model}
                        </span>
                        <span className="text-white font-semibold">
                          {formatCurrency(item.cost)}/mo
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="h-px bg-zinc-700 my-3" />
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-xs text-zinc-300 mb-1">Total Monthly Cost</div>
                      <div className="text-3xl font-bold text-purple-400">
                        {formatCurrency(multiProviderTotalCost.total)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-zinc-300 mb-1">Estimated Yearly</div>
                      <div className="text-2xl font-bold text-white">
                        {formatCurrency(multiProviderTotalCost.total * 12)}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-5 pt-5 border-t border-zinc-700/50 flex justify-between items-center">
                  <div>
                    <div className="text-xs text-zinc-300 mb-1">Best Monthly Cost</div>
                    <div className="text-3xl font-bold text-green-400">
                      {formatCurrency(bestBudgetModel?.totalCost || 0)}
                    </div>
                    <div className="text-xs text-zinc-300 mt-1">
                      with {bestBudgetModel?.provider} {bestBudgetModel?.name}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-zinc-300 mb-1">Estimated Yearly</div>
                    <div className="text-2xl font-bold text-white">
                      {formatCurrency((bestBudgetModel?.totalCost || 0) * 12)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Use InsightsPanel for now - will render sections inline in bento grid */}
          <InsightsPanel
            models={calculatedModels}
            inputs={{ inputTokensPerCall: inputTokens, outputTokensPerCall: outputTokens, callsPerMonth }}
            useCase={useCase}
            selectedProviders={Array.from(selectedProviders)}
            selectedModels={selectedModels}
            multiProviderTotalCost={multiProviderTotalCost}
            bestBudgetModel={bestBudgetModel}
          />

          {/* ROW: Visual Comparison (Full Width) */}
          {calculatedModels.length > 0 && (
            <div className="relative z-50 rounded-lg border border-zinc-700/50 hover:border-purple-500/50 transition-colors bg-zinc-900/95 p-4 sm:p-5">
              {/* Mobile: Heading left, button top-right, Desktop: Side by side */}
              <div className="flex items-start justify-between mb-3 gap-2">
                <div className="text-left flex-1">
                  <h3 className="text-base sm:text-lg font-bold text-white mb-1">Visual Comparison</h3>
                  <p className="text-xs text-zinc-300">
                    <span className="sm:hidden">Cost difference between providers<br />for your usage</span>
                    <span className="hidden sm:inline">Cost difference between providers for your usage ({callsPerMonth.toLocaleString()} calls/month)</span>
                  </p>
                </div>
                
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setShow3DModal(true);
                  }}
                  className="view-3d-button relative group flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-zinc-900 border border-purple-500/30 rounded-full overflow-hidden transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50 flex-shrink-0 cursor-pointer animate-pulse-subtle"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-40 group-hover:opacity-80 blur transition-opacity duration-500" />
                  <div className="relative flex items-center gap-1">
                    <span className="text-white text-xs sm:text-sm">✧</span>
                    <span className="font-bold text-white text-xs sm:text-sm whitespace-nowrap" style={{ fontFamily: 'var(--font-source-sans-3)' }}>3D View</span>
                  </div>
                </button>
              </div>
              <div className="rounded-lg border border-zinc-800/50 bg-[#1A1A1D] p-2 sm:p-4 relative z-10">
                <CostChart models={calculatedModels} maxModels={8} />
              </div>
            </div>
          )}

          {/* ROW: Detailed Breakdown (Collapsible) */}
          <div className="relative z-50 rounded-lg border border-zinc-700/50 hover:border-purple-500/50 transition-colors bg-zinc-900/95">
            <button
              ref={breakdownButtonRef}
              type="button"
              onClick={handleToggleBreakdown}
              className="relative z-50 w-full px-5 py-4 flex items-center justify-between text-left hover:bg-zinc-900/50 transition-colors rounded-lg cursor-pointer"
            >
              <div className="relative z-50">
                <h3 className="relative z-50 text-lg font-bold text-white mb-0.5 flex items-center gap-2">
                  <span className="relative z-50">Detailed Breakdown</span>
                  {showDetailedBreakdown ? <ChevronUp className="relative z-50 w-4 h-4" /> : <ChevronDown className="relative z-50 w-4 h-4" />}
                </h3>
                <p className="relative z-50 text-xs text-zinc-300">
                  Full breakdown of monthly costs for all {calculatedModels.length} models
                </p>
              </div>
              <span className="relative z-50 text-xs font-medium text-purple-300">
                {showDetailedBreakdown ? 'Hide' : 'Show'}
              </span>
            </button>
            
            {showDetailedBreakdown && (
              <div className="relative z-50 px-5 pb-5">
                <ComparisonTable models={calculatedModels} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-50 text-center py-12 px-4">
        <h2
          className="relative z-50 text-[19px] sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4 whitespace-nowrap overflow-hidden"
          style={{ fontFamily: 'var(--font-meriva)' }}
        >
          <span className="relative z-50 bg-gradient-to-r from-purple-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
            reGuard tracks all this automatically
          </span>
        </h2>
        
        <p className="relative z-50 text-base sm:text-lg md:text-lg lg:text-xl text-zinc-300 mb-8 mx-auto">
          Real-time insights, instant alerts, and automated savings - all on autopilot
        </p>
        
        {/* Mobile: Left-aligned in centered container like first fold, Desktop: Flex wrap */}
        <div className="relative z-50 mb-10 flex justify-center">
          {/* Mobile layout: Left-aligned in centered container (EXACTLY like first fold) */}
          <div className="relative z-50 flex flex-col items-start gap-3 sm:hidden text-sm text-zinc-300/90">
            <div className="relative z-50 flex items-center gap-2 whitespace-nowrap">
              <CheckCircle2 className="relative z-50 h-4 w-4 text-purple-400 flex-shrink-0" />
              <span className="relative z-50">Multi-Provider LLM Tracking</span>
            </div>
            <div className="relative z-50 flex items-center gap-2 whitespace-nowrap">
              <CheckCircle2 className="relative z-50 h-4 w-4 text-purple-400 flex-shrink-0" />
              <span className="relative z-50">Flat Pricing Model</span>
            </div>
            <div className="relative z-50 flex items-center gap-2 whitespace-nowrap">
              <CheckCircle2 className="relative z-50 h-4 w-4 text-purple-400 flex-shrink-0" />
              <span className="relative z-50">Unlimited API Call Tracking</span>
            </div>
            <div className="relative z-50 flex items-center gap-2 whitespace-nowrap">
              <CheckCircle2 className="relative z-50 h-4 w-4 text-purple-400 flex-shrink-0" />
              <span className="relative z-50">Smart Caching (Save 30-50%)</span>
            </div>
          </div>
          
          {/* Desktop layout: Horizontal flex wrap */}
          <div className="relative z-50 hidden sm:flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm sm:text-base text-zinc-300/90">
            <div className="relative z-50 flex items-center gap-2 whitespace-nowrap">
              <CheckCircle2 className="relative z-50 h-4 w-4 text-purple-400 flex-shrink-0" />
              <span className="relative z-50">Multi-Provider LLM Tracking</span>
            </div>
            <div className="relative z-50 flex items-center gap-2 whitespace-nowrap">
              <CheckCircle2 className="relative z-50 h-4 w-4 text-purple-400 flex-shrink-0" />
              <span className="relative z-50">Flat Pricing Model</span>
            </div>
            <div className="relative z-50 flex items-center gap-2 whitespace-nowrap">
              <CheckCircle2 className="relative z-50 h-4 w-4 text-purple-400 flex-shrink-0" />
              <span className="relative z-50">Unlimited API Call Tracking</span>
            </div>
            <div className="relative z-50 flex items-center gap-2 whitespace-nowrap">
              <CheckCircle2 className="relative z-50 h-4 w-4 text-purple-400 flex-shrink-0" />
              <span className="relative z-50">Smart Caching (Save 30-50%)</span>
            </div>
          </div>
        </div>
        
        <div className="relative z-50 flex justify-center">
          <ReGuardButton onClick={scrollToWaitlist}>
            Join Waitlist - Get Early Access
          </ReGuardButton>
        </div>
      </div>

      {/* Divider */}
      <div className="relative z-50 w-full border-t border-zinc-800/30 my-6"></div>

      {/* Copyright */}
      <div className="relative z-50 text-center pt-4 pb-8">
        <p className="relative z-50 text-sm text-zinc-500">
          © 2025 reGuard. All rights reserved.
        </p>
      </div>

      {/* 3D Visualization Modal */}
      <CostVisualization3DModal
        open={show3DModal}
        onOpenChange={setShow3DModal}
        data={calculatedModels}
      />

      {/* Slider Custom Styles */}
      <style jsx>{`
        .slider-purple::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #a855f7;
          cursor: pointer;
          border: 2px solid #fff;
        }

        .slider-purple::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #a855f7;
          cursor: pointer;
          border: 2px solid #fff;
        }

        /* Stop pulse animation on hover */
        .view-3d-button:hover {
          animation: none !important;
        }
      `}</style>
    </div>
  );
}

