import * as React from "react"
import type { QueueChannelMetric } from "../types"

interface QueuesMetricsCardsProps {
  metrics: QueueChannelMetric[]
  isLoading: boolean
}

export const QueuesMetricsCards: React.FC<QueuesMetricsCardsProps> = ({ metrics, isLoading }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
      {isLoading
        ? Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={`metric-skel-${idx}`}
              className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-[118px] animate-pulse"
            >
              <div className="flex items-center justify-between">
                <div className="h-3 w-16 bg-slate-200 rounded" />
                <div className="h-3 w-10 bg-slate-200 rounded" />
              </div>
              <div className="h-7 w-20 bg-slate-200 rounded my-2" />
              <div className="h-5 w-full bg-slate-200 rounded" />
            </div>
          ))
        : metrics.map((metric) => (
            <div
              key={metric.id}
              className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-[118px]"
            >
              {/* Top row: Title and Badge / Dot */}
              <div className="flex items-center justify-between gap-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate">
                  {metric.title}
                </span>

                {metric.badgeType === "green-dot" && (
                  <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                )}

                {metric.badgeType === "blue" && metric.badge && (
                  <span className="bg-[#eff6ff] text-[#2563eb] text-[10px] font-semibold px-2 py-0.5 rounded border border-[#bfdbfe] shrink-0">
                    {metric.badge}
                  </span>
                )}

                {metric.badgeType === "gray" && metric.badge && (
                  <span className="bg-slate-100 text-slate-600 text-[10px] font-medium px-2 py-0.5 rounded border border-slate-200/60 shrink-0">
                    {metric.badge}
                  </span>
                )}
              </div>

              {/* Middle row: Big Metric Value */}
              <div className="my-2">
                <div className="text-xl lg:text-2xl font-bold text-slate-900 tracking-tight leading-none font-mono">
                  {metric.value}
                </div>
              </div>

              {/* Bottom row: Monospace Channel Tag or Subtext */}
              <div>
                {metric.channelChip ? (
                  <div className="bg-[#f8fafc] border border-slate-200/80 rounded px-2.5 py-1 text-[11px] font-mono text-slate-600 truncate">
                    {metric.channelChip}
                  </div>
                ) : metric.subtext ? (
                  <span className="text-xs text-slate-500 font-medium">
                    {metric.subtext}
                  </span>
                ) : null}
              </div>
            </div>
          ))}
    </div>
  )
}
