import * as React from "react"
import type { QueueChannelMetric } from "../types"

interface QueuesMetricsCardsProps {
  metrics: QueueChannelMetric[]
  isLoading: boolean
}

export const QueuesMetricsCards: React.FC<QueuesMetricsCardsProps> = ({ metrics, isLoading }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <div
          key={metric.id}
          className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-[#7c8ea2] tracking-wider uppercase">
              {metric.title}
            </span>
            {metric.badge && (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#eefaf3] text-[#059669] border border-[#a7f3d0]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
                {metric.badge}
              </span>
            )}
          </div>

          <div>
            {isLoading ? (
              <div className="h-8 w-16 bg-slate-200 rounded animate-pulse my-1" />
            ) : (
              <div className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
                {metric.value}
              </div>
            )}
            <div className="flex items-center gap-1.5 mt-2">
              <span className="bg-slate-100 text-slate-700 font-mono text-[11px] px-2 py-0.5 rounded border border-slate-200">
                {metric.channelChip}
              </span>
              {metric.subtext && (
                <span className="text-xs text-slate-500">{metric.subtext}</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
