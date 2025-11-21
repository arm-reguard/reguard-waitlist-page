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
  bestBudgetModel?: CalculatedModel; // Best budget model for the use case (when no providers selected)
}

export function InsightsPanel({ models, inputs, useCase, selectedProviders, selectedModels = [], multiProviderTotalCost, bestBudgetModel }: InsightsPanelProps) {
  if (models.length === 0) return null;

  const cheapestModel = models[0];
  const mostExpensiveModel = models[models.length - 1];
  
  // Use bestBudgetModel for annual projection when no providers selected, otherwise use cheapestModel
  const displayModel = selectedProviders.length === 0 && bestBudgetModel ? bestBudgetModel : cheapestModel;
  const yearlyProjection = displayModel.totalCost * 12;
  const totalMonthlyCost = multiProviderTotalCost?.total || displayModel.totalCost;

  // Get smart recommendations (compare against user's current cost, not most expensive model)
  const smartRecommendations = getSmartRecommendations(useCase, models, inputs, totalMonthlyCost);

  // Get provider-specific recommendations if providers are selected
  const providerRecommendations = selectedProviders.length > 0 
    ? getProviderRecommendations(selectedProviders, models, useCase, selectedModels)
    : [];

  const hasHighVolume = inputs.callsPerMonth >= 100000;
  const hasLargeContext = (inputs.inputTokensPerCall + inputs.outputTokensPerCall) > 1500;

  return (
    <>
      {/* BENTO GRID LAYOUT - Conditional based on provider selection */}
      
      {/* ROW 2: Provider Optimization + Routing Strategy (when 2+ providers) OR just Provider Opt (when 1 provider) */}
      {selectedProviders.length >= 2 && providerRecommendations.length > 0 ? (
        // 2+ providers: Show both side by side
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Provider-Specific Optimization */}
          <div className="rounded-lg p-4 border border-zinc-700/50 hover:border-purple-500/50 transition-colors bg-zinc-900/95">
            <h3 className="text-base font-semibold text-white mb-1.5">
              Provider-Specific Optimization
            </h3>
            <p className="text-xs text-zinc-300 mb-3">
              Recommended model switches to reduce costs
            </p>
            <div className="space-y-2.5">
              {providerRecommendations.map((rec) => (
                <div key={rec.provider} className="bg-zinc-900/30 rounded p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: rec.recommendedModel.color }}
                        />
                        <h4 className="font-semibold text-white text-sm">{rec.provider}</h4>
                      </div>
                      {rec.currentModel && (
                        <p className="text-xs text-zinc-300">
                          Currently: {rec.currentModel.name}
                        </p>
                      )}
                    </div>
                    {rec.shouldSwitch && rec.savings > 0 && (
                      <div className="text-right flex-shrink-0 ml-2">
                        <div className="text-sm font-bold text-green-400">
                          -{formatCurrency(rec.savings)}
                        </div>
                        <div className="text-xs text-zinc-300">
                          ({rec.savingsPercentage.toFixed(0)}%)
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-zinc-300 mb-1">
                    {rec.shouldSwitch ? (
                      <>→ <span className="font-medium text-white">{rec.recommendedModel.name}</span></>
                    ) : (
                      <>✓ <span className="font-medium text-white">{rec.recommendedModel.name}</span></>
                    )}
                  </p>
                  <p className="text-xs text-zinc-300 leading-relaxed">{rec.reason}</p>
                </div>
              ))}
              
              {/* Total Savings Summary */}
              {providerRecommendations.some(r => r.shouldSwitch) && (
                <div className="mt-3 pt-3 border-t border-zinc-700/50">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white font-semibold">Total Savings:</span>
                    <span className="text-lg font-bold text-green-400">
                      {formatCurrency(providerRecommendations.reduce((sum, r) => sum + (r.shouldSwitch ? r.savings : 0), 0))}/mo
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Smart Multi-Provider Routing Strategy */}
          <div className="rounded-lg p-4 border border-zinc-700/50 hover:border-purple-500/50 transition-colors bg-zinc-900/95">
            <h3 className="text-base font-semibold text-white mb-1.5">
              Smart Multi-Provider Routing
            </h3>
            <p className="text-xs text-zinc-300 mb-3">
              Route tasks to optimal models based on complexity
            </p>
          
          <div className="space-y-2.5">
            {/* High-Value Tasks */}
            <div className="bg-zinc-900/50 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <div className="text-xl flex-shrink-0">⭐</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-semibold mb-1">High-Value (20%)</p>
                  <p className="text-xs text-zinc-300 mb-2 leading-relaxed">
                    Complex reasoning, creative content
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
                      <div className="flex flex-wrap gap-1.5">
                        {diverseModels.slice(0, 3).map((model) => (
                          <span key={model.id} className="text-xs text-green-400">
                            → {model.provider} {model.name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-yellow-400">Consider premium models</p>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Routine Tasks */}
            <div className="bg-zinc-900/50 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <div className="text-xl flex-shrink-0">⚡</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-semibold mb-1">Routine (60%)</p>
                  <p className="text-xs text-zinc-300 mb-2 leading-relaxed">
                    Standard queries, everyday content
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
                      <div className="flex flex-wrap gap-1.5">
                        {diverseModels.slice(0, 3).map((model) => (
                          <span key={model.id} className="text-xs text-green-400">
                            → {model.provider} {model.name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-zinc-300">Mid-tier models</p>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Bulk/Simple Tasks */}
            <div className="bg-zinc-900/50 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <div className="text-xl flex-shrink-0">🚀</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-semibold mb-1">Bulk/Simple (20%)</p>
                  <p className="text-xs text-zinc-300 mb-2 leading-relaxed">
                    Simple queries, classifications
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
                      <div className="flex flex-wrap gap-1.5">
                        {diverseModels.slice(0, 3).map((model) => (
                          <span key={model.id} className="text-xs text-green-400">
                            → {model.provider} {model.name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-zinc-300">Budget models</p>
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
              <div className="mt-3 pt-3 border-t border-zinc-700/50">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white font-semibold">Routing Savings:</span>
                  <span className="text-lg font-bold text-green-400">{formatCurrency(savings)}/mo</span>
                </div>
                <p className="text-xs text-zinc-300 mt-1">
                  vs. single model
                </p>
              </div>
            ) : null;
          })()}
          </div>
        </div>
      ) : selectedProviders.length === 1 && providerRecommendations.length > 0 ? (
        // 1 provider: Show only Provider Optimization (full width)
        <div className="rounded-lg p-5 border border-zinc-700/50 hover:border-purple-500/50 transition-colors bg-zinc-900/95">
          <h3 className="text-lg font-semibold text-white mb-1.5">
            Provider-Specific Optimization
          </h3>
          <p className="text-xs text-zinc-300 mb-3">
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
                      <p className="text-xs text-zinc-300 mt-1">
                        Currently: {rec.currentModel.name} ({formatCurrency(rec.currentModel.totalCost)}/mo)
                      </p>
                    )}
                  </div>
                  {rec.shouldSwitch && rec.savings > 0 && (
                    <div className="text-right">
                      <div className="text-sm font-bold text-green-400">
                        -{formatCurrency(rec.savings)}
                      </div>
                      <div className="text-xs text-zinc-300">
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
                <p className="text-xs text-zinc-300">{rec.reason}</p>
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
      ) : null}

      {/* ROW 3: Smart Recommendations + Annual Projection (Side by Side) */}
      {smartRecommendations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Smart Recommendations */}
          <div className="rounded-lg p-4 border border-zinc-700/50 hover:border-purple-500/50 transition-colors bg-zinc-900/95">
            <h3 className="text-base font-semibold text-white mb-1.5">
              Smart Recommendations
            </h3>
            <p className="text-xs text-zinc-300 mb-3">
              Best budget models for {useCase.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </p>
            
            <div className="space-y-2.5">
              {smartRecommendations.map((rec) => (
                <div key={rec.tier} className="bg-zinc-900/50 rounded-lg p-3 border border-zinc-700/50">
                  <div className="flex items-start justify-between mb-1.5">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {rec.tier === 'best-value' && <span className="text-lg flex-shrink-0">🏆</span>}
                      {rec.tier === 'balanced' && <span className="text-lg flex-shrink-0">⚖️</span>}
                      {rec.tier === 'premium' && <span className="text-lg flex-shrink-0">⭐</span>}
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-white text-sm">
                          {rec.tier === 'best-value' && 'Best Value'}
                          {rec.tier === 'balanced' && 'Balanced'}
                          {rec.tier === 'premium' && 'Premium'}
                        </h4>
                        <p className="text-xs text-zinc-300 truncate">{rec.model.provider} {rec.model.name}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-3">
                      <div className="text-sm font-bold text-white">{formatCurrency(rec.model.totalCost)}/mo</div>
                      {rec.savings > 0 && (
                        <div className="text-xs text-green-400">
                          Save {formatCurrency(rec.savings)}
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-zinc-300 mt-1.5 leading-relaxed">{rec.reason}</p>
                  {rec.tradeoffs && (
                    <p className="text-xs text-yellow-400/80 mt-1.5 flex items-start gap-1 leading-relaxed">
                      <span>⚠️</span>
                      <span>{rec.tradeoffs}</span>
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Annual Projection */}
          <div className="rounded-lg p-4 border border-zinc-700/50 hover:border-purple-500/50 transition-colors bg-zinc-900/95">
            <h3 className="text-base font-semibold text-purple-400 mb-1.5">
              Annual Projection
            </h3>
            <p className="text-xs text-zinc-300 mb-3">
              Yearly spending + reGuard savings
            </p>

            {/* Current Annual Cost */}
            <div className="bg-zinc-900/40 rounded-lg p-3.5 mb-3">
              <p className="text-xs text-zinc-300 mb-1">Current Annual Cost</p>
              <p className="text-2xl font-bold text-white mb-1">
                {multiProviderTotalCost 
                  ? formatCurrency(multiProviderTotalCost.total * 12)
                  : formatCurrency(yearlyProjection)
                }/yr
              </p>
              <p className="text-xs text-zinc-300 truncate">
                {multiProviderTotalCost 
                  ? 'Multi-provider setup'
                  : `${displayModel.provider} ${displayModel.name}`
                }
              </p>
            </div>

            {/* reGuard Savings Breakdown */}
            {(() => {
              const annualCost = totalMonthlyCost * 12;
              const cachingSavings = Math.round(annualCost * 0.30);
              const routingSavings = Math.round(annualCost * 0.15);
              const optimizationSavings = Math.round(annualCost * 0.10);
              const totalSavings = cachingSavings + routingSavings + optimizationSavings;
              
              return (
                <>
                  <div className="mb-3">
                    <h4 className="text-green-400 font-semibold text-sm mb-2.5">
                      Your Annual Savings
                    </h4>
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-white flex items-center gap-1.5">
                          <span className="text-purple-400">●</span>
                          Smart caching (30%):
                        </span>
                        <span className="text-green-400 font-semibold">
                          ${cachingSavings.toLocaleString()}/yr
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-white flex items-center gap-1.5">
                          <span className="text-purple-400">●</span>
                          Auto routing (15%):
                        </span>
                        <span className="text-green-400 font-semibold">
                          ${routingSavings.toLocaleString()}/yr
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-white flex items-center gap-1.5">
                          <span className="text-purple-400">●</span>
                          Optimization (10%):
                        </span>
                        <span className="text-green-400 font-semibold">
                          ${optimizationSavings.toLocaleString()}/yr
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-2.5 pt-2.5 border-t border-zinc-700/50 bg-black/20 rounded px-3 py-2.5 text-center">
                      <p className="text-xs text-zinc-300 mb-1">Total Savings</p>
                      <p className="text-2xl font-bold text-green-400 mb-1">
                        ${totalSavings.toLocaleString()}
                      </p>
                      <p className="text-xs text-zinc-300">
                        From reGuard's automated optimization
                      </p>
                    </div>
                  </div>

                  {/* Additional reGuard Features */}
                  <div className="pt-3 border-t border-zinc-700/50">
                    <h4 className="text-purple-400 font-semibold text-sm mb-2">
                      Even More with reGuard
                    </h4>
                    <div className="grid grid-cols-1 gap-1.5 text-xs">
                      <div className="flex items-center gap-1.5 text-white">
                        <span className="text-purple-400">●</span>
                        <span>Real-time cost tracking</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-white">
                        <span className="text-purple-400">●</span>
                        <span>Budget alerts</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-white">
                        <span className="text-purple-400">●</span>
                        <span>Hard spending limits</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-white">
                        <span className="text-purple-400">●</span>
                        <span>Unlimited API tracking</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-2.5 border-t border-zinc-700/50">
                    <p className="text-xs text-zinc-300 text-center leading-relaxed">
                      💡 <span className="text-white font-semibold">Flat pricing model</span> • No surprises, no per-call fees
                    </p>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* ROW 4: Usage Optimization Tips (Full Width, Conditional) */}
      {(hasHighVolume || hasLargeContext) && (
        <div className="rounded-lg p-5 border border-zinc-700/50 hover:border-purple-500/50 transition-colors bg-zinc-900/95">
          <h3 className="text-lg font-semibold text-white mb-1.5">Usage Optimization Tips</h3>
          <p className="text-xs text-zinc-300 mb-3">
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
            
            {/* Model-specific usage guidance */}
            {(() => {
              const hasGPT5 = selectedModels?.some(m => m.modelId === 'openai-gpt5' || m.modelId === 'openai-gpt5-pro');
              const hasOpus = selectedModels?.some(m => m.modelId === 'anthropic-opus-41');
              
              return (
                <>
                  {hasGPT5 && (
                    <p className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">✨</span>
                      <span>
                        <strong className="text-white">GPT-5.1 / GPT-5 pro:</strong> Best for marketing copy, technical documentation, structured content, and data analysis. Excels at following specific formatting instructions.
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
    </>
  );
}
