import { ModelPricing, pricingData, useCaseQualityMap, QualityTier } from './pricing-data';

export interface CalculationInputs {
  inputTokensPerCall: number;
  outputTokensPerCall: number;
  callsPerMonth: number;
}

export interface CalculatedModel extends ModelPricing {
  inputCost: number;
  outputCost: number;
  totalCost: number;
}

export interface Recommendation {
  tier: 'best-value' | 'balanced' | 'premium';
  model: CalculatedModel;
  reason: string;
  savings: number;
  savingsPercentage: number;
  tradeoffs?: string;
}

export function calculateCost(
  model: ModelPricing,
  inputs: CalculationInputs
): CalculatedModel {
  const totalInputTokens = inputs.inputTokensPerCall * inputs.callsPerMonth;
  const totalOutputTokens = inputs.outputTokensPerCall * inputs.callsPerMonth;

  const inputCost = (totalInputTokens / 1_000_000) * model.inputCostPerMillion;
  const outputCost = (totalOutputTokens / 1_000_000) * model.outputCostPerMillion;
  const totalCost = inputCost + outputCost;

  return {
    ...model,
    inputCost,
    outputCost,
    totalCost
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

export function calculateSavings(
  cheapest: CalculatedModel,
  expensive: CalculatedModel
): { amount: number; percentage: number } {
  const amount = expensive.totalCost - cheapest.totalCost;
  const percentage = (amount / expensive.totalCost) * 100;
  return { amount, percentage };
}

// Smart recommendation engine - FIX: Diversify across providers for better recommendations
export function getSmartRecommendations(
  useCase: string,
  calculatedModels: CalculatedModel[],
  inputs: CalculationInputs,
  currentCost?: number // User's current monthly cost (multi-provider total or cheapest model)
): Recommendation[] {
  const recommendations: Recommendation[] = [];
  
  // Get quality tiers for this use case
  const qualityTiers = useCaseQualityMap[useCase] || useCaseQualityMap['general'];
  
  // Use current cost if provided, otherwise use cheapest model as baseline
  const baselineCost = currentCost || calculatedModels[0].totalCost;
  
  // Helper function to get best model from a tier, prioritizing provider diversity
  const getBestFromTier = (tierModels: string[], usedProviders: string[]): CalculatedModel | null => {
    const availableModels = calculatedModels.filter(m => tierModels.includes(m.id));
    
    // First try to find a model from a provider we haven't used yet
    const unusedProviderModel = availableModels.find(m => !usedProviders.includes(m.provider));
    if (unusedProviderModel) return unusedProviderModel;
    
    // Otherwise return the cheapest available model
    return availableModels.length > 0 ? availableModels[0] : null;
  };
  
  const usedProviders: string[] = [];
  
  // Budget/Best Value recommendation
  const budgetModel = getBestFromTier(qualityTiers.budget, usedProviders);
  if (budgetModel) {
    usedProviders.push(budgetModel.provider);
    const savings = baselineCost - budgetModel.totalCost;
    const savingsPercentage = baselineCost > 0 ? (savings / baselineCost) * 100 : 0;
    
    recommendations.push({
      tier: 'best-value',
      model: budgetModel,
      reason: getReasonForTier(useCase, 'budget'),
      savings: Math.max(0, savings), // Only show positive savings
      savingsPercentage: Math.max(0, savingsPercentage),
      tradeoffs: savings > baselineCost * 0.7 ? 'May have slightly lower quality for complex tasks' : undefined
    });
  }
  
  // Balanced recommendation
  const balancedModel = getBestFromTier(qualityTiers.balanced, usedProviders);
  if (balancedModel && balancedModel.id !== budgetModel?.id) {
    usedProviders.push(balancedModel.provider);
    const savings = baselineCost - balancedModel.totalCost;
    const savingsPercentage = baselineCost > 0 ? (savings / baselineCost) * 100 : 0;
    
    recommendations.push({
      tier: 'balanced',
      model: balancedModel,
      reason: getReasonForTier(useCase, 'balanced'),
      savings: Math.max(0, savings),
      savingsPercentage: Math.max(0, savingsPercentage),
      tradeoffs: undefined
    });
  }
  
  // Premium recommendation
  const premiumModel = getBestFromTier(qualityTiers.premium, usedProviders);
  if (premiumModel && premiumModel.id !== balancedModel?.id && premiumModel.id !== budgetModel?.id) {
    const savings = baselineCost - premiumModel.totalCost;
    const savingsPercentage = baselineCost > 0 ? (savings / baselineCost) * 100 : 0;
    
    recommendations.push({
      tier: 'premium',
      model: premiumModel,
      reason: getReasonForTier(useCase, 'premium'),
      savings: Math.max(0, savings),
      savingsPercentage: Math.max(0, savingsPercentage),
      tradeoffs: undefined
    });
  }
  
  return recommendations;
}

function getReasonForTier(useCase: string, tier: 'budget' | 'balanced' | 'premium'): string {
  const reasons: Record<string, Record<string, string>> = {
    'content-generation': {
      budget: 'Great for drafts and routine content',
      balanced: 'Ideal for most blog posts and marketing materials',
      premium: 'Best for high-stakes content and creative work'
    },
    'chatbot': {
      budget: 'Perfect for simple FAQs and basic support',
      balanced: 'Handles most customer conversations smoothly',
      premium: 'For complex support and nuanced interactions'
    },
    'code-assistant': {
      budget: 'Good for code formatting and simple tasks',
      balanced: 'Reliable for everyday coding and debugging',
      premium: 'Best for complex algorithms and architecture'
    },
    'data-analysis': {
      budget: 'Suitable for basic data summaries',
      balanced: 'Handles most analysis and reporting needs',
      premium: 'For complex reasoning and insights'
    },
    'general': {
      budget: 'Cost-effective for routine tasks',
      balanced: 'Well-rounded for daily AI assistance',
      premium: 'Maximum capability for any task'
    },
    'translation': {
      budget: 'Great for informal translations',
      balanced: 'Professional quality for most content',
      premium: 'Nuanced translations for sensitive content'
    },
    'summarization': {
      budget: 'Efficient for straightforward summaries',
      balanced: 'Captures key points accurately',
      premium: 'Best for complex documents requiring nuance'
    }
  };
  
  return reasons[useCase]?.[tier] || `${tier === 'budget' ? 'Cost-effective' : tier === 'balanced' ? 'Balanced quality and cost' : 'Highest quality'} option for ${useCase}`;
}

// Provider-specific recommendations
export interface ProviderRecommendation {
  provider: string;
  currentModel?: CalculatedModel;
  recommendedModel: CalculatedModel;
  savings: number;
  savingsPercentage: number;
  shouldSwitch: boolean;
  reason: string;
}

interface ProviderModelSelection {
  provider: string;
  modelId: string;
}

export function getProviderRecommendations(
  selectedProviders: string[],
  calculatedModels: CalculatedModel[],
  useCase: string,
  selectedModels?: ProviderModelSelection[]
): ProviderRecommendation[] {
  const recommendations: ProviderRecommendation[] = [];
  const qualityTiers = useCaseQualityMap[useCase] || useCaseQualityMap['general'];
  
  // Categorize use cases by quality requirements
  // CRITICAL: Never downgrade from premium (requires highest quality)
  const criticalUseCases = ['code-assistant', 'data-analysis'];
  
  // HIGH QUALITY: Can downgrade from premium to balanced, but never to budget
  const highQualityUseCases = ['content-generation', 'translation'];
  
  // MODERATE: Can downgrade more flexibly (chatbot, summarization, general)
  const isCritical = criticalUseCases.includes(useCase);
  const requiresHighQuality = highQualityUseCases.includes(useCase);
  
  selectedProviders.forEach(provider => {
    const providerModels = calculatedModels.filter(m => m.provider === provider);
    if (providerModels.length === 0) return;
    
    // Find the user's currently selected model for this provider
    const selectedModel = selectedModels?.find(sel => sel.provider === provider);
    const currentModel = selectedModel 
      ? providerModels.find(m => m.id === selectedModel.modelId)
      : providerModels[providerModels.length - 1]; // Fallback to most expensive if not found
    
    if (!currentModel) return;
    
    // Determine current model's quality tier
    let currentTier: 'budget' | 'balanced' | 'premium' | null = null;
    if (qualityTiers.premium.includes(currentModel.id)) currentTier = 'premium';
    else if (qualityTiers.balanced.includes(currentModel.id)) currentTier = 'balanced';
    else if (qualityTiers.budget.includes(currentModel.id)) currentTier = 'budget';
    
    // Check if current model needs upgrade recommendation
    let recommendedModel: CalculatedModel;
    let savings: number;
    let savingsPercentage: number;
    let shouldSwitch: boolean;
    let reason: string;
    
    // CRITICAL use cases need highest quality - recommend premium tier
    if (isCritical && (currentTier === 'budget' || currentTier === null)) {
      // Budget/unclassified for critical task → MUST UPGRADE to balanced/premium
      const upgradeOptions = providerModels.filter(m => 
        qualityTiers.balanced.includes(m.id) || qualityTiers.premium.includes(m.id)
      ).sort((a, b) => a.totalCost - b.totalCost);
      
      recommendedModel = upgradeOptions[0] || currentModel;
      savings = currentModel.totalCost - recommendedModel.totalCost;
      savingsPercentage = currentModel.totalCost > 0 ? (savings / currentModel.totalCost) * 100 : 0;
      shouldSwitch = recommendedModel.id !== currentModel.id;
      
      const modelIssue = currentTier === null ? `${currentModel.name} is not suitable` : `${currentModel.name} is insufficient quality`;
      reason = shouldSwitch ? `⚠️ Upgrade required - ${modelIssue} for ${useCase}` : `Already using the best model for ${useCase}`;
      
    } else if (isCritical && currentTier === 'balanced') {
      // Balanced for critical task → SUGGEST premium upgrade for best quality
      const premiumOptions = providerModels.filter(m => qualityTiers.premium.includes(m.id))
        .sort((a, b) => a.totalCost - b.totalCost);
      
      if (premiumOptions.length > 0) {
        recommendedModel = premiumOptions[0];
        savings = currentModel.totalCost - recommendedModel.totalCost; // Negative = cost increase
        savingsPercentage = currentModel.totalCost > 0 ? (savings / currentModel.totalCost) * 100 : 0;
        shouldSwitch = true;
        reason = `💡 Consider premium model - ${recommendedModel.name} offers higher quality for ${useCase}`;
      } else {
        // No premium available from this provider
        recommendedModel = currentModel;
        savings = 0;
        savingsPercentage = 0;
        shouldSwitch = false;
        reason = `Already using an optimal model for ${useCase}`;
      }
      
    } else if ((requiresHighQuality) && (currentTier === 'budget' || currentTier === null)) {
      // Budget/unclassified for high-quality task → RECOMMEND balanced/premium
      const upgradeOptions = providerModels.filter(m => 
        qualityTiers.balanced.includes(m.id) || qualityTiers.premium.includes(m.id)
      ).sort((a, b) => a.totalCost - b.totalCost);
      
      recommendedModel = upgradeOptions[0] || currentModel;
      savings = currentModel.totalCost - recommendedModel.totalCost;
      savingsPercentage = currentModel.totalCost > 0 ? (savings / currentModel.totalCost) * 100 : 0;
      shouldSwitch = recommendedModel.id !== currentModel.id;
      
      const modelIssue = currentTier === null ? `${currentModel.name} is not suitable` : `${currentModel.name} may not provide sufficient quality`;
      reason = shouldSwitch ? `⚠️ Upgrade recommended - ${modelIssue} for ${useCase}` : `Already using the best model for ${useCase}`;
      
    } else {
      // Current model is appropriate → look for cost savings
      let suitableIds: string[];
      
      if (isCritical) {
        if (currentTier === 'premium') {
          suitableIds = qualityTiers.premium; // Stay premium, find cheaper premium
        } else if (currentTier === 'balanced') {
          suitableIds = [...qualityTiers.balanced]; // Stay balanced, find cheaper balanced
        } else {
          suitableIds = [...qualityTiers.budget]; // Budget stays budget (rare for critical)
        }
      } else if (requiresHighQuality) {
        if (currentTier === 'premium') {
          suitableIds = [...qualityTiers.premium, ...qualityTiers.balanced];
        } else if (currentTier === 'balanced') {
          suitableIds = [...qualityTiers.balanced, ...qualityTiers.budget];
        } else {
          suitableIds = [...qualityTiers.budget];
        }
      } else {
        // MODERATE use cases
        if (currentTier === 'premium') {
          suitableIds = [...qualityTiers.premium, ...qualityTiers.balanced];
        } else if (currentTier === 'balanced') {
          suitableIds = [...qualityTiers.balanced, ...qualityTiers.budget];
        } else {
          suitableIds = [...qualityTiers.budget];
        }
      }
      
      // Find cheaper models in suitable tiers
      const suitableModels = providerModels.filter(m => 
        suitableIds.includes(m.id) && m.totalCost < currentModel.totalCost
      ).sort((a, b) => a.totalCost - b.totalCost);
      
      recommendedModel = suitableModels[0] || currentModel;
      savings = currentModel.totalCost - recommendedModel.totalCost;
      savingsPercentage = currentModel.totalCost > 0 ? (savings / currentModel.totalCost) * 100 : 0;
      
      // For critical use cases, require higher savings threshold (15% vs 10%)
      const savingsThreshold = isCritical ? 0.15 : 0.10;
      shouldSwitch = savings > currentModel.totalCost * savingsThreshold && recommendedModel.id !== currentModel.id;
      reason = getSwitchReason(provider, useCase, savingsPercentage, recommendedModel.id === currentModel.id);
    }
    
    recommendations.push({
      provider,
      currentModel,
      recommendedModel,
      savings,
      savingsPercentage,
      shouldSwitch,
      reason
    });
  });
  
  return recommendations;
}

function getSwitchReason(provider: string, useCase: string, savingsPercentage: number, isSameModel: boolean): string {
  if (isSameModel) {
    return `Already using an optimal model for ${useCase}`;
  } else if (savingsPercentage < 10) {
    return `Minimal savings available - current model is well-suited`;
  } else if (savingsPercentage < 30) {
    return `Good savings possible while maintaining similar quality`;
  } else if (savingsPercentage < 60) {
    return `Significant cost reduction with comparable quality`;
  } else {
    return `Major cost savings possible for ${useCase}`;
  }
}

