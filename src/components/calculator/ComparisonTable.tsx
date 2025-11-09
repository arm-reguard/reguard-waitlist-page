"use client";

import { CalculatedModel } from "@/lib/calculator-utils";
import { formatCurrency } from "@/lib/calculator-utils";
import { useState } from "react";

interface ComparisonTableProps {
  models: CalculatedModel[];
}

export function ComparisonTable({ models }: ComparisonTableProps) {
  const [showAll, setShowAll] = useState(false);
  
  // Toggle show all with scroll position preservation
  const toggleShowAll = () => {
    const scrollY = window.scrollY;
    setShowAll(!showAll);
    requestAnimationFrame(() => {
      window.scrollTo(0, scrollY);
    });
  };
  
  // Get relevant models (already filtered by parent component if needed)
  const relevantModels = models;
  const displayModels = showAll ? relevantModels : relevantModels.slice(0, 10);
  const cheapestModel = relevantModels[0];
  const hasMore = relevantModels.length > 10;

  return (
    <div className="w-full">
      <div className="rounded-lg overflow-hidden border border-zinc-800/50">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#1A1A1D] border-b border-zinc-800/50 sticky top-0 z-10">
              <tr>
                <th className="text-left py-3 px-3 sm:py-4 sm:px-6 text-xs sm:text-sm font-semibold text-zinc-300">
                  Provider & Model
                </th>
                <th className="hidden sm:table-cell text-right py-4 px-3 sm:px-4 text-sm font-semibold text-zinc-300">
                  Input Cost
                </th>
                <th className="hidden sm:table-cell text-right py-4 px-3 sm:px-4 text-sm font-semibold text-zinc-300">
                  Output Cost
                </th>
                <th className="text-right py-3 px-2 sm:py-4 sm:px-6 text-xs sm:text-sm font-semibold text-zinc-300 whitespace-nowrap">
                  Total/Month
                </th>
              </tr>
            </thead>
            <tbody className="bg-[#0A0A0B]">
              {displayModels.map((model) => {
                const isCheapest = model.id === cheapestModel?.id;
                return (
                  <tr
                    key={model.id}
                    className={`border-b border-zinc-800/30 hover:bg-zinc-900/30 transition-colors ${
                      isCheapest ? 'bg-green-950/20' : ''
                    }`}
                  >
                    <td className="py-3 px-3 sm:py-4 sm:px-6">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div
                          className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: model.color }}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-white flex items-center gap-1.5 sm:gap-2 flex-wrap text-sm sm:text-base">
                            <span className="truncate">{model.provider}</span>
                            {isCheapest && (
                              <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/30 whitespace-nowrap">
                                BEST VALUE
                              </span>
                            )}
                          </div>
                          <div className="text-xs sm:text-sm text-zinc-300 truncate">{model.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell py-4 px-3 sm:px-4 text-right text-sm text-zinc-300 whitespace-nowrap">
                      {formatCurrency(model.inputCost)}
                    </td>
                    <td className="hidden sm:table-cell py-4 px-3 sm:px-4 text-right text-sm text-zinc-300 whitespace-nowrap">
                      {formatCurrency(model.outputCost)}
                    </td>
                    <td className="py-3 px-2 sm:py-4 sm:px-6 text-right text-sm sm:text-base md:text-lg font-bold text-white whitespace-nowrap">
                      {formatCurrency(model.totalCost)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Show More Button */}
      {hasMore && (
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={toggleShowAll}
            className="px-6 py-2 rounded-full text-sm font-medium text-purple-300 hover:text-purple-200 transition-colors cursor-pointer"
            style={{
              background: "rgba(139, 92, 246, 0.15)",
              border: "1px solid rgba(167, 139, 250, 0.3)",
            }}
          >
            {showAll ? 'Show Less' : `Show ${relevantModels.length - 10} More Models`}
          </button>
        </div>
      )}
    </div>
  );
}

