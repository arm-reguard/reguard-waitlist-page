"use client";

import { useState, useEffect } from "react";
import { CalculatedModel, formatCurrency } from "@/lib/calculator-utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";

interface CostChartProps {
  models: CalculatedModel[];
  maxModels?: number;
}

export function CostChart({ models, maxModels = 8 }: CostChartProps) {
  // Detect mobile screen size
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Initial check
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640); // sm breakpoint
    };
    
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Take top N models
  const displayModels = models.slice(0, maxModels);

  // Get unique providers for legend
  const uniqueProviders = Array.from(
    new Set(displayModels.map((m) => m.provider))
  ).map((provider) => {
    const model = displayModels.find((m) => m.provider === provider);
    return {
      provider,
      color: model?.color || "#888",
    };
  });

  // Format data for chart with full names
  const chartData = displayModels.map((model) => ({
    fullName: `${model.provider} - ${model.name}`,
    shortName: model.name.length > 25 ? model.name.substring(0, 23) + "..." : model.name,
    provider: model.provider,
    cost: parseFloat(model.totalCost.toFixed(2)),
    color: model.color,
    isCheapest: model.id === models[0]?.id,
  }));

  // Mobile-specific responsive config
  const chartMargins = isMobile 
    ? { top: 10, right: 5, left: 50, bottom: 10 }
    : { top: 10, right: 30, left: 120, bottom: 10 };
  
  const yAxisWidth = isMobile ? 45 : 110;

  // Custom Y-axis tick that shows provider dot + model name
  const CustomYAxisTick = (props: any) => {
    const { x, y, payload } = props;
    const data = chartData.find((d) => d.fullName === payload.value);
    
    if (!data) return null;

    // Mobile responsive sizes
    const circleRadius = isMobile ? 2.5 : 4;
    const xOffset = isMobile ? -8 : -18;
    const circleX = isMobile ? -4 : -10;

    return (
      <g transform={`translate(${x},${y})`}>
        {/* Provider color dot */}
        <circle cx={circleX} cy={0} r={circleRadius} fill={data.color} />
        {/* Provider name */}
        <text
          x={xOffset}
          y={-2}
          textAnchor="end"
          fill="#A1A1AA"
          fontSize={isMobile ? 7 : 10}
          fontWeight="500"
        >
          {data.provider}
        </text>
        {/* Model name */}
        <text
          x={xOffset}
          y={isMobile ? 8 : 10}
          textAnchor="end"
          fill="#FFFFFF"
          fontSize={isMobile ? 8 : 11}
        >
          {data.shortName}
        </text>
      </g>
    );
  };

  // Custom tooltip - smaller on mobile
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-2 sm:p-3 shadow-lg">
          <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
            <div
              className="w-2 h-2 sm:w-3 sm:h-3 rounded-full"
              style={{ backgroundColor: data.color }}
            />
            <p className="text-white font-semibold text-[10px] sm:text-sm">
              {data.provider}
            </p>
          </div>
          <p className="text-zinc-300 text-[9px] sm:text-xs mb-1 sm:mb-2">{data.fullName.split(' - ')[1]}</p>
          <p className="text-purple-400 font-bold text-xs sm:text-lg">
            {formatCurrency(payload[0].value)}/month
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[450px] md:h-[550px] relative z-10">
      {/* Provider Legend */}
      <div className="mb-4 flex flex-wrap gap-3 justify-center text-xs">
        {uniqueProviders.map(({ provider, color }) => (
          <div key={provider} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-zinc-300">{provider}</span>
          </div>
        ))}
      </div>

      <ResponsiveContainer width="100%" height="100%" className="focus:outline-none [&_svg]:focus:outline-none [&_svg]:outline-none relative z-20">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={chartMargins}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#27272A" />
          <XAxis
            type="number"
            stroke="#A1A1AA"
            tick={{ fill: "#A1A1AA", fontSize: isMobile ? 9 : 11 }}
            tickFormatter={(value) => `$${value}`}
          />
          <YAxis
            type="category"
            dataKey="fullName"
            stroke="#A1A1AA"
            width={yAxisWidth}
            tick={<CustomYAxisTick />}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#27272A" }} />
          <Bar dataKey="cost" radius={[0, 8, 8, 0]}>
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                opacity={entry.isCheapest ? 1 : 0.85}
                stroke={entry.isCheapest ? "#10B981" : "transparent"}
                strokeWidth={entry.isCheapest ? 2 : 0}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

