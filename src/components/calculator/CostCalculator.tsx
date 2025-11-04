"use client";

import { useState, useMemo, useCallback } from "react";
import { pricingData, useCaseDefaults } from "@/lib/pricing-data";
import { calculateCost, CalculationInputs, formatCurrency } from "@/lib/calculator-utils";
import { ComparisonTable } from "./ComparisonTable";
import { InsightsPanel } from "./InsightsPanel";
import { CostChart } from "./CostChart";
import { ReGuardButton } from "@/components/ui/reguard-button";
import { CheckCircle2 } from "lucide-react";

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
    <div className="w-full max-w-6xl mx-auto px-4">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2
          className="text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl lg:text-5xl mb-4"
          style={{ fontFamily: 'var(--font-meriva)' }}
        >
          <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
            Calculate your LLM API costs
          </span>
        </h2>
        <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
          Adjust parameters to see real-time cost comparisons across providers
        </p>
      </div>

      {/* Calculator Card */}
      <div className="rounded-xl p-6 sm:p-8 border border-zinc-800/50 bg-[#1A1A1D] mb-8">
        {/* Input Form */}
        <div className="space-y-6 mb-8">
          {/* Use Case Dropdown */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Use Case
            </label>
            <select
              value={useCase}
              onChange={(e) => handleUseCaseChange(e.target.value as UseCase)}
              className="w-full px-4 py-3 rounded-lg bg-[#0A0A0B] border border-zinc-700 text-white focus:outline-none focus:border-purple-500 transition-colors"
            >
              {Object.entries(useCaseDefaults).map(([key, value]) => (
                <option key={key} value={key}>
                  {key.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} - {value.description}
                </option>
              ))}
            </select>
          </div>

          {/* Number Inputs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Monthly API Calls */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Monthly API Calls
              </label>
              <input
                type="number"
                value={callsPerMonth}
                onChange={(e) => setCallsPerMonth(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                max="10000000"
                className="w-full px-4 py-3 rounded-lg bg-[#0A0A0B] border border-zinc-700 text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            {/* Input Tokens */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Input Tokens / Call
              </label>
              <input
                type="number"
                value={inputTokens}
                onChange={(e) => setInputTokens(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                max="100000"
                className="w-full px-4 py-3 rounded-lg bg-[#0A0A0B] border border-zinc-700 text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            {/* Output Tokens */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Output Tokens / Call
              </label>
              <input
                type="number"
                value={outputTokens}
                onChange={(e) => setOutputTokens(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                max="100000"
                className="w-full px-4 py-3 rounded-lg bg-[#0A0A0B] border border-zinc-700 text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>

          {/* Calls Per Month Slider */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Adjust Monthly Calls: {callsPerMonth.toLocaleString()}
            </label>
            <input
              type="range"
              min="1000"
              max="500000"
              step="1000"
              value={callsPerMonth}
              onChange={(e) => setCallsPerMonth(parseInt(e.target.value))}
              className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider-purple"
            />
            <div className="flex justify-between text-xs text-zinc-500 mt-1">
              <span>1K</span>
              <span>500K</span>
            </div>
          </div>

          {/* Provider Filter with Model Selection */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-3">
              Select Providers & Models (for multi-provider comparison)
            </label>
            <div className="space-y-3">
              {allProviders.map((provider) => {
                const isSelected = selectedProviders.has(provider);
                const providerModels = pricingData.filter((m) => m.provider === provider);
                const providerColor = providerModels[0]?.color;
                const selectedModel = selectedModels.find((m) => m.provider === provider);
                
                return (
                  <div key={provider} className="border border-zinc-700/50 rounded-lg p-3 bg-zinc-900/30">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleProvider(provider)}
                        className="w-4 h-4 rounded border-zinc-600 text-purple-600 focus:ring-purple-500 focus:ring-offset-0 bg-zinc-800"
                      />
                      <div className="flex items-center gap-2 flex-1">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: providerColor }}
                        />
                        <span className="font-medium text-white">{provider}</span>
                        <span className="text-xs text-zinc-500">({providerModels.length} models)</span>
                      </div>
                    </label>
                    
                    {/* Model Selection Dropdown - Only show when provider is selected */}
                    {isSelected && (
                      <div className="mt-3 ml-7">
                        <label className="block text-xs text-zinc-400 mb-2">
                          Currently using:
                        </label>
                        <select
                          value={selectedModel?.modelId || ''}
                          onChange={(e) => handleModelSelection(provider, e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
                        >
                          {providerModels.map((model) => (
                            <option key={model.id} value={model.id}>
                              {model.name} - ${model.inputCostPerMillion}/M in, ${model.outputCostPerMillion}/M out
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pricing Note */}
          <div className="pt-4 border-t border-zinc-800/50 space-y-1">
            <p className="text-xs text-zinc-500">
              * Anthropic Sonnet 4.5 pricing shown for ≤200K context. Prices are $6.00 input / $22.50 output for &gt;200K context.
            </p>
            <p className="text-xs text-zinc-500">
              * More providers coming soon: Hugging Face, LiteLLM (103+ providers), Replicate, and more!
            </p>
          </div>
        </div>
      </div>

      {/* Current Setup Summary */}
      {calculatedModels.length > 0 && (
        <div className="mb-8">
          <div className="rounded-xl border border-zinc-700/50 hover:border-purple-500/50 transition-colors bg-zinc-900/95 p-6">
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              {selectedProviders.size >= 2 ? 'Your Multi-Provider Setup' : 'Your Current Setup'}
            </h3>
            <p className="text-sm text-zinc-400 mb-4">
              {selectedProviders.size >= 2
                ? 'Current configuration and monthly costs for your selected providers'
                : 'Your current configuration and estimated monthly costs'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <div className="text-xs text-zinc-400 mb-1">Use Case</div>
                <div className="text-white font-semibold">
                  {useCase.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </div>
              </div>
              <div>
                <div className="text-xs text-zinc-400 mb-1">Monthly Volume</div>
                <div className="text-white font-semibold">
                  {callsPerMonth.toLocaleString()} calls
                </div>
              </div>
              <div>
                <div className="text-xs text-zinc-400 mb-1">Avg Tokens/Call</div>
                <div className="text-white font-semibold">
                  {inputTokens} in / {outputTokens} out
                </div>
              </div>
              <div>
                <div className="text-xs text-zinc-400 mb-1">
                  {selectedProviders.size > 0 ? 'Selected Providers' : 'All Providers'}
                </div>
                <div className="text-white font-semibold">
                  {selectedProviders.size > 0 
                    ? `${selectedProviders.size} selected`
                    : `${calculatedModels.length} models`}
                </div>
              </div>
            </div>

            {/* Multi-Provider Cost Breakdown */}
            {multiProviderTotalCost && multiProviderTotalCost.breakdown.length > 0 ? (
              <div className="mt-6 pt-6 border-t border-zinc-700/50">
                <div className="text-xs text-zinc-400 mb-3">Multi-Provider Cost Breakdown:</div>
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
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <div className="text-xs text-zinc-400 mb-1">Total Monthly Cost</div>
                    <div className="text-3xl font-bold text-purple-400">
                      {formatCurrency(multiProviderTotalCost.total)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-zinc-400 mb-1">Estimated Yearly</div>
                    <div className="text-2xl font-bold text-white">
                      {formatCurrency(multiProviderTotalCost.total * 12)}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-6 pt-6 border-t border-zinc-700/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="text-xs text-zinc-400 mb-1">Best Monthly Cost</div>
                  <div className="text-3xl font-bold text-green-400">
                    {formatCurrency(calculatedModels[0]?.totalCost || 0)}
                  </div>
                  <div className="text-xs text-zinc-400 mt-1">
                    with {calculatedModels[0]?.provider} {calculatedModels[0]?.name}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-zinc-400 mb-1">Estimated Yearly</div>
                  <div className="text-2xl font-bold text-white">
                    {formatCurrency((calculatedModels[0]?.totalCost || 0) * 12)}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Insights Panel */}
      <div className="mb-8">
        <InsightsPanel
          models={calculatedModels}
          inputs={{ inputTokensPerCall: inputTokens, outputTokensPerCall: outputTokens, callsPerMonth }}
          useCase={useCase}
          selectedProviders={Array.from(selectedProviders)}
          selectedModels={selectedModels}
          multiProviderTotalCost={multiProviderTotalCost}
        />
      </div>

      {/* Cost Chart */}
      {calculatedModels.length > 0 && (
        <div className="mb-8">
          <div className="rounded-lg border border-zinc-700/50 hover:border-purple-500/50 transition-colors bg-zinc-900/95 p-6">
            <h3 className="text-2xl font-bold text-white mb-2">Visual Comparison</h3>
            <p className="text-sm text-zinc-400 mb-6">
              Quick visual comparison showing the cost difference between providers for your usage ({callsPerMonth.toLocaleString()} calls/month)
            </p>
            <div className="rounded-lg border border-zinc-800/50 bg-[#1A1A1D] p-6">
              <CostChart models={calculatedModels} maxModels={8} />
            </div>
          </div>
        </div>
      )}

      {/* Results Table */}
      <div className="mb-8">
        <div className="rounded-lg border border-zinc-700/50 hover:border-purple-500/50 transition-colors bg-zinc-900/95 p-6">
          <h3 className="text-2xl font-bold text-white mb-2">Detailed Breakdown</h3>
          <p className="text-sm text-zinc-400 mb-6">
            Full breakdown of monthly costs for all provider models matching your usage
          </p>
          <ComparisonTable models={calculatedModels} />
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center py-12">
        <h2
          className="text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl lg:text-5xl mb-4"
          style={{ fontFamily: 'var(--font-meriva)' }}
        >
          <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
            reGuard tracks all this automatically
          </span>
        </h2>
        
        <p className="text-lg sm:text-xl text-zinc-300 mb-8 mx-auto whitespace-nowrap">
          Real-time insights, instant alerts, and automated savings - all on autopilot
        </p>
        
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-10 text-sm sm:text-base text-zinc-300/90">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-purple-400 flex-shrink-0" />
            <span>Multi-provider LLM tracking</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-purple-400 flex-shrink-0" />
            <span>Flat pricing model</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-purple-400 flex-shrink-0" />
            <span>Unlimited API call tracking</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-purple-400 flex-shrink-0" />
            <span>Smart caching (save 30-50%)</span>
          </div>
        </div>
        
        <div className="flex justify-center">
          <ReGuardButton onClick={scrollToWaitlist}>
            Join Waitlist - Get Early Access
          </ReGuardButton>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full border-t border-zinc-800/30 my-6"></div>

      {/* Copyright */}
      <div className="text-center pt-4">
        <p className="text-sm text-zinc-500">
          © 2025 reGuard. All rights reserved.
        </p>
      </div>

      {/* Slider Custom Styles */}
      <style jsx>{`
        .slider-purple::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #a855f7;
          cursor: pointer;
          border: 2px solid #fff;
        }

        .slider-purple::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #a855f7;
          cursor: pointer;
          border: 2px solid #fff;
        }
      `}</style>
    </div>
  );
}

