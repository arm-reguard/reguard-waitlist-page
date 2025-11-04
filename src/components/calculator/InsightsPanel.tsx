"use client";

import { CalculatedModel, formatCurrency, getSmartRecommendations, getProviderRecommendations, calculateCost } from "@/lib/calculator-utils";
import { CalculationInputs } from "@/lib/calculator-utils";
import { pricingData, useCaseQualityMap } from "@/lib/pricing-data";

interface ProviderModelSelection {
  provider: string;
  modelId: string;
}

interface InsightsPanelProps {
  models: CalculatedModel[];
  inputs: CalculationInputs;
  useCase: string;
  selectedProviders: string[];
  selectedModels?: ProviderModelSelection[];
  multiProviderTotalCost?: { total: number; breakdown: { provider: string; model: string; cost: number }[] } | null;
}

export function InsightsPanel({ models, inputs, useCase, selectedProviders, selectedModels = [], multiProviderTotalCost }: InsightsPanelProps) {
  if (models.length === 0) return null;

  const cheapestModel = models[0];
  const mostExpensiveModel = models[models.length - 1];
  const yearlyProjection = cheapestModel.totalCost * 12;
  const totalMonthlyCost = multiProviderTotalCost?.total || cheapestModel.totalCost;

  // Get smart recommendations (compare against user's current cost, not most expensive model)
  const smartRecommendations = getSmartRecommendations(useCase, models, inputs, totalMonthlyCost);

  // Get provider-specific recommendations if providers are selected
  const providerRecommendations = selectedProviders.length > 0 
    ? getProviderRecommendations(selectedProviders, models, useCase, selectedModels)
    : [];

  const hasHighVolume = inputs.callsPerMonth > 100000;
  const hasLargeContext = (inputs.inputTokensPerCall + inputs.outputTokensPerCall) > 1500;

  return (
    <div className="space-y-4">
      {/* ORDER CHANGES BASED ON PROVIDER SELECTION:
          - No providers: Smart Recommendations first
          - 1 provider: Provider-Specific Optimization first, then Smart Recommendations
          - 2+ providers: Provider-Specific Optimization first, then Multi-Provider Routing, then Smart Recommendations
      */}
      
      {/* 1. Provider-Specific Optimization - Show FIRST when ANY providers selected */}
      {selectedProviders.length > 0 && providerRecommendations.length > 0 && (
        <div className="rounded-lg p-6 border border-zinc-700/50 hover:border-purple-500/50 transition-colors bg-zinc-900/95">
          <h3 className="text-lg font-semibold text-white mb-2">
            Provider-Specific Optimization
          </h3>
          <p className="text-sm text-zinc-400 mb-4">
            Recommended model switches within each provider to reduce costs
          </p>
          <div className="space-y-3">
            {providerRecommendations.map((rec) => (
              <div key={rec.provider} className="bg-zinc-900/30 rounded p-3">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: rec.recommendedModel.color }}
                      />
                      <h4 className="font-semibold text-white">{rec.provider}</h4>
                    </div>
                    {rec.currentModel && (
                      <p className="text-xs text-zinc-400 mt-1">
                        Currently: {rec.currentModel.name} ({formatCurrency(rec.currentModel.totalCost)}/mo)
                      </p>
                    )}
                  </div>
                  {rec.shouldSwitch && rec.savings > 0 && (
                    <div className="text-right">
                      <div className="text-sm font-bold text-green-400">
                        -{formatCurrency(rec.savings)}
                      </div>
                      <div className="text-xs text-zinc-400">
                        ({rec.savingsPercentage.toFixed(0)}% less)
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-sm text-zinc-300 mb-1">
                  {rec.shouldSwitch ? (
                    <>Switch to: <span className="font-medium text-white">{rec.recommendedModel.name}</span></>
                  ) : (
                    <>Already using optimal model: <span className="font-medium text-white">{rec.recommendedModel.name}</span></>
                  )}
                </p>
                <p className="text-xs text-zinc-400">{rec.reason}</p>
              </div>
            ))}
            
            {/* Total Savings Summary */}
            {providerRecommendations.some(r => r.shouldSwitch) && (
              <div className="mt-4 pt-4 border-t border-zinc-700/50">
                <div className="flex justify-between items-center">
                  <span className="text-white font-semibold">Total Potential Savings:</span>
                  <span className="text-xl font-bold text-green-400">
                    {formatCurrency(providerRecommendations.reduce((sum, r) => sum + (r.shouldSwitch ? r.savings : 0), 0))}/month
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. Smart Multi-Provider Routing - Show SECOND when 2+ PROVIDERS selected */}
      {selectedProviders.length >= 2 && (
        <div className="rounded-lg p-6 border border-zinc-700/50 hover:border-purple-500/50 transition-colors bg-zinc-900/95">
          <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
            Smart Multi-Provider Routing Strategy
          </h3>
          <p className="text-sm text-zinc-400 mb-4">
            Optimize costs by routing different task types to appropriate models based on complexity
          </p>
          
          <div className="space-y-4">
            {/* High-Value Tasks */}
            <div className="bg-zinc-900/50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="text-2xl">⭐</div>
                <div className="flex-1">
                  <p className="text-white font-semibold mb-1">High-Value Tasks (20% of volume)</p>
                  <p className="text-sm text-zinc-400 mb-2">
                    Complex reasoning, creative content, mission-critical work
                  </p>
                  {(() => {
                    const qualityTiers = useCaseQualityMap[useCase] || useCaseQualityMap['general'];
                    // Get ALL premium models from selected providers
                    const allPremiumModels = models
                      .filter(m => selectedProviders.includes(m.provider) && qualityTiers.premium.includes(m.id))
                      .sort((a, b) => b.totalCost - a.totalCost);
                    
                    // Ensure diversity: show at least one premium model per selected provider
                    const diverseModels: typeof allPremiumModels = [];
                    const usedProviders = new Set<string>();
                    
                    // First pass: Add cheapest premium model from each provider
                    selectedProviders.forEach(provider => {
                      const providerPremium = allPremiumModels.find(m => m.provider === provider && !usedProviders.has(provider));
                      if (providerPremium) {
                        diverseModels.push(providerPremium);
                        usedProviders.add(provider);
                      }
                    });
                    
                    // Second pass: Fill remaining slots with other premium models (up to 5 total)
                    allPremiumModels.forEach(model => {
                      if (diverseModels.length < 5 && !diverseModels.includes(model)) {
                        diverseModels.push(model);
                      }
                    });
                    
                    return diverseModels.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {diverseModels.map((model) => (
                          <span key={model.id} className="text-sm text-green-400">
                            → {model.provider} {model.name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-yellow-400">Consider adding a premium model for best results</p>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Routine Tasks */}
            <div className="bg-zinc-900/50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="text-2xl">⚡</div>
                <div className="flex-1">
                  <p className="text-white font-semibold mb-1">Routine Tasks (60% of volume)</p>
                  <p className="text-sm text-zinc-400 mb-2">
                    Standard queries, everyday content, normal customer support
                  </p>
                  {(() => {
                    const qualityTiers = useCaseQualityMap[useCase] || useCaseQualityMap['general'];
                    // Get ALL balanced models from selected providers
                    const allBalancedModels = models
                      .filter(m => selectedProviders.includes(m.provider) && qualityTiers.balanced.includes(m.id))
                      .sort((a, b) => a.totalCost - b.totalCost); // Sort cheapest first
                    
                    // Ensure diversity: show at least one balanced model per provider
                    const diverseModels: typeof allBalancedModels = [];
                    const usedProviders = new Set<string>();
                    
                    selectedProviders.forEach(provider => {
                      const providerBalanced = allBalancedModels.find(m => m.provider === provider && !usedProviders.has(provider));
                      if (providerBalanced) {
                        diverseModels.push(providerBalanced);
                        usedProviders.add(provider);
                      }
                    });
                    
                    // Fill remaining slots (up to 5 total)
                    allBalancedModels.forEach(model => {
                      if (diverseModels.length < 5 && !diverseModels.includes(model)) {
                        diverseModels.push(model);
                      }
                    });
                    
                    return diverseModels.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {diverseModels.map((model) => (
                          <span key={model.id} className="text-sm text-green-400">
                            → {model.provider} {model.name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-zinc-400">Use your mid-tier models here</p>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Bulk/Simple Tasks */}
            <div className="bg-zinc-900/50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="text-2xl">🚀</div>
                <div className="flex-1">
                  <p className="text-white font-semibold mb-1">Bulk/Simple Tasks (20% of volume)</p>
                  <p className="text-sm text-zinc-400 mb-2">
                    Simple queries, classifications, basic responses, high volume
                  </p>
                  {(() => {
                    const qualityTiers = useCaseQualityMap[useCase] || useCaseQualityMap['general'];
                    // Get ALL budget models from selected providers
                    const allBudgetModels = models
                      .filter(m => selectedProviders.includes(m.provider) && qualityTiers.budget.includes(m.id))
                      .sort((a, b) => a.totalCost - b.totalCost); // Sort cheapest first
                    
                    // Ensure diversity: show at least one budget model per provider
                    const diverseModels: typeof allBudgetModels = [];
                    const usedProviders = new Set<string>();
                    
                    selectedProviders.forEach(provider => {
                      const providerBudget = allBudgetModels.find(m => m.provider === provider && !usedProviders.has(provider));
                      if (providerBudget) {
                        diverseModels.push(providerBudget);
                        usedProviders.add(provider);
                      }
                    });
                    
                    // Fill remaining slots (up to 5 total)
                    allBudgetModels.forEach(model => {
                      if (diverseModels.length < 5 && !diverseModels.includes(model)) {
                        diverseModels.push(model);
                      }
                    });
                    
                    return diverseModels.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {diverseModels.map((model) => (
                          <span key={model.id} className="text-sm text-green-400">
                            → {model.provider} {model.name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-zinc-400">Use your most cost-effective models here</p>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>

          {/* Estimated Routing Savings */}
          {multiProviderTotalCost && (() => {
            const qualityTiers = useCaseQualityMap[useCase] || useCaseQualityMap['general'];
            const allSelectedCalculated = selectedModels
              .map(sel => pricingData.find(m => m.id === sel.modelId))
              .filter((m): m is typeof pricingData[0] => m !== undefined)
              .map(m => calculateCost(m, inputs));
            
            const premiumModels = allSelectedCalculated.filter(m => qualityTiers.premium.includes(m.id));
            const balancedModels = allSelectedCalculated.filter(m => qualityTiers.balanced.includes(m.id));
            const budgetModels = allSelectedCalculated.filter(m => qualityTiers.budget.includes(m.id));
            
            const avgPremiumCost = premiumModels.length > 0 
              ? premiumModels.reduce((sum, m) => sum + m.totalCost, 0) / premiumModels.length 
              : 0;
            const avgBalancedCost = balancedModels.length > 0 
              ? balancedModels.reduce((sum, m) => sum + m.totalCost, 0) / balancedModels.length 
              : 0;
            const avgBudgetCost = budgetModels.length > 0 
              ? budgetModels.reduce((sum, m) => sum + m.totalCost, 0) / budgetModels.length 
              : 0;
            
            const routedCost = (0.20 * avgPremiumCost) + (0.60 * avgBalancedCost) + (0.20 * avgBudgetCost);
            const currentAvgCost = multiProviderTotalCost.total / selectedModels.length;
            const savings = currentAvgCost - routedCost;
            
            return savings > 0 ? (
              <div className="mt-4 pt-4 border-t border-zinc-700/50">
                <p className="text-white font-semibold flex items-center justify-between">
                  <span>Estimated savings with routing strategy:</span>
                  <span className="text-xl text-green-400">{formatCurrency(savings)}/month</span>
                </p>
                <p className="text-xs text-zinc-400 mt-1">
                  vs. using single model for all tasks
                </p>
              </div>
            ) : null;
          })()}
        </div>
      )}

      {/* 3. Smart Recommendations - Always show, but position changes based on provider selection */}
      {smartRecommendations.length > 0 && (
        <div className="rounded-lg p-6 border border-zinc-700/50 hover:border-purple-500/50 transition-colors bg-zinc-900/95">
          <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
            Smart Recommendations for {useCase.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
          </h3>
          <p className="text-sm text-zinc-400 mb-4">
            Best model options for your use case with savings estimates
          </p>
          
          <div className="space-y-4">
            {smartRecommendations.map((rec) => (
              <div key={rec.tier} className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-700/50">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {rec.tier === 'best-value' && <span className="text-xl">🏆</span>}
                    {rec.tier === 'balanced' && <span className="text-xl">⚖️</span>}
                    {rec.tier === 'premium' && <span className="text-xl">⭐</span>}
                    <div>
                      <h4 className="font-semibold text-white">
                        {rec.tier === 'best-value' && 'Best Value'}
                        {rec.tier === 'balanced' && 'Balanced'}
                        {rec.tier === 'premium' && 'Premium'}
                      </h4>
                      <p className="text-sm text-zinc-400">{rec.model.provider} {rec.model.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-white">{formatCurrency(rec.model.totalCost)}/mo</div>
                    {rec.savings > 0 && (
                      <div className="text-sm text-green-400">
                        Save {formatCurrency(rec.savings)}/mo
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-sm text-zinc-300 mt-2">{rec.reason}</p>
                {rec.tradeoffs && (
                  <p className="text-xs text-yellow-400/80 mt-2 flex items-start gap-1">
                    <span>⚠️</span>
                    <span>{rec.tradeoffs}</span>
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Usage Optimization Tips */}
      {(hasHighVolume || hasLargeContext) && (
        <div className="rounded-lg p-6 border border-zinc-700/50 hover:border-purple-500/50 transition-colors bg-zinc-900/95">
          <h3 className="text-lg font-semibold text-white mb-2">Usage Optimization Tips</h3>
          <p className="text-sm text-zinc-400 mb-3">
            Automatic optimizations that reduce costs without manual switching
          </p>
          <div className="space-y-2 text-sm text-zinc-300">
            {hasHighVolume && (
              <p className="flex items-start gap-2">
                <span className="text-yellow-500 mt-0.5">🔥</span>
                <span>
                  <strong className="text-white">High volume detected:</strong> With{' '}
                  {inputs.callsPerMonth.toLocaleString()} calls/month, caching can save you
                  30-50% automatically. Consider enterprise pricing for additional discounts.
                </span>
              </p>
            )}
            {hasLargeContext && (
              <p className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">📝</span>
                <span>
                  <strong className="text-white">Large context windows:</strong> Consider prompt
                  optimization to reduce token usage, or use a hybrid approach with cheaper models
                  for simple tasks.
                </span>
              </p>
            )}
            <p className="flex items-start gap-2">
              <span className="text-purple-500 mt-0.5">💡</span>
              <span>
                <strong className="text-white">Pro tip:</strong> Use a multi-tier strategy -
                premium models for 20% of high-value tasks, balanced models for 60% of routine work,
                and budget models for 20% of simple tasks.
              </span>
            </p>
            
            {/* Model-specific usage guidance - flows naturally with tips */}
            {(() => {
              const hasGPT5 = selectedModels?.some(m => m.modelId === 'openai-gpt5' || m.modelId === 'openai-gpt5-pro');
              const hasOpus = selectedModels?.some(m => m.modelId === 'anthropic-opus-41');
              
              return (
                <>
                  {hasGPT5 && (
                    <p className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">✨</span>
                      <span>
                        <strong className="text-white">GPT-5 / GPT-5 pro:</strong> Best for marketing copy, technical documentation, structured content, and data analysis. Excels at following specific formatting instructions.
                      </span>
                    </p>
                  )}
                  {hasOpus && (
                    <p className="flex items-start gap-2">
                      <span className="text-purple-400 mt-0.5">✨</span>
                      <span>
                        <strong className="text-white">Claude Opus 4.1:</strong> Best for long-form prose, creative writing, blog posts, and storytelling. Superior at maintaining consistent voice and narrative flow.
                      </span>
                    </p>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* 5. Combined Annual Projection & reGuard Savings */}
      <div className="rounded-lg p-6 border border-zinc-700/50 hover:border-purple-500/50 transition-colors bg-zinc-900/95">
        <h3 className="text-lg font-semibold text-purple-400 mb-2">
          Annual Projection
        </h3>
        <p className="text-sm text-zinc-400 mb-6">
          Your estimated yearly spending and how reGuard helps you save automatically
        </p>

        {/* Current Annual Cost */}
        <div className="bg-zinc-900/40 rounded-lg p-5 mb-6">
          <p className="text-sm text-zinc-400 mb-2">Current Annual Cost</p>
          <p className="text-3xl font-bold text-white mb-2">
            {multiProviderTotalCost 
              ? formatCurrency(multiProviderTotalCost.total * 12)
              : formatCurrency(yearlyProjection)
            }/year
          </p>
          <p className="text-sm text-zinc-300">
            {multiProviderTotalCost 
              ? 'With your multi-provider setup'
              : `With ${cheapestModel.provider} ${cheapestModel.name}`
            }
          </p>
          {smartRecommendations.length > 0 && smartRecommendations[0].savings > 0 && !multiProviderTotalCost && (
            <p className="text-sm text-green-400 mt-2">
              Compared to {formatCurrency(mostExpensiveModel.totalCost * 12)}/year with premium models
            </p>
          )}
        </div>

        {/* reGuard Savings Breakdown */}
        {(() => {
          const annualCost = totalMonthlyCost * 12;
          
          // Calculate realistic savings (all based on actual usage)
          const cachingSavings = Math.round(annualCost * 0.30); // 30% reduction from smart caching
          const routingSavings = Math.round(annualCost * 0.15); // 15% from optimized routing
          const optimizationSavings = Math.round(annualCost * 0.10); // 10% from usage optimization
          
          const totalSavings = cachingSavings + routingSavings + optimizationSavings;
          
          return (
            <>
              <div className="mb-6">
                <h4 className="text-green-400 font-semibold mb-3">
                  Your Annual Savings with reGuard
                </h4>
                <div className="grid md:grid-cols-2 gap-4 items-start">
                  <div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-white flex items-center gap-2">
                          <span className="text-purple-400 text-base">●</span>
                          Smart caching (30% avg):
                        </span>
                        <span className="text-green-400 font-semibold">
                          ${cachingSavings.toLocaleString()}/year
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-white flex items-center gap-2">
                          <span className="text-purple-400 text-base">●</span>
                          Auto model routing (15%):
                        </span>
                        <span className="text-green-400 font-semibold">
                          ${routingSavings.toLocaleString()}/year
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-white flex items-center gap-2">
                          <span className="text-purple-400 text-base">●</span>
                          Usage optimization (10%):
                        </span>
                        <span className="text-green-400 font-semibold">
                          ${optimizationSavings.toLocaleString()}/year
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col justify-center items-center bg-black/30 rounded-lg px-4 py-3 border border-green-500/20 h-full">
                    <p className="text-zinc-400 text-xs mb-1">Total Annual Savings</p>
                    <p className="text-3xl font-bold text-green-400 mb-0.5">
                      ${totalSavings.toLocaleString()}
                    </p>
                    <p className="text-zinc-300 text-xs">
                      From automated optimization
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional reGuard Features (non-repetitive) */}
              <div className="pt-6 border-t border-zinc-700/50">
                <h4 className="text-purple-400 font-semibold mb-4">
                  Even More with reGuard
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-white">
                    <span className="text-purple-400 text-base">●</span>
                    <span>Real-time cost tracking across all providers</span>
                  </div>
                  <div className="flex items-center gap-2 text-white">
                    <span className="text-purple-400 text-base">●</span>
                    <span>Budget alerts before you overspend</span>
                  </div>
                  <div className="flex items-center gap-2 text-white">
                    <span className="text-purple-400 text-base">●</span>
                    <span>Hard spending limits that actually work</span>
                  </div>
                  <div className="flex items-center gap-2 text-white">
                    <span className="text-purple-400 text-base">●</span>
                    <span>Unlimited API call tracking</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-zinc-700/50">
                <p className="text-sm text-zinc-400 text-center">
                  💡 <span className="text-white font-semibold">Flat pricing model</span> • No surprises, no per-call fees
                </p>
              </div>
            </>
          );
        })()}
      </div>
    </div>
  );
}
