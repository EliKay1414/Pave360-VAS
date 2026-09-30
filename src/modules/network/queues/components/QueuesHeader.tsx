import * as React from "react"
import { RotateCw } from "lucide-react"

interface QueuesHeaderProps {
  onRefresh: () => void
  isFetching: boolean
  provider?: string
  workerBatchDelayMs?: number
  isHealthy?: boolean
}

export const QueuesHeader: React.FC<QueuesHeaderProps> = ({
  onRefresh,
  isFetching,
  provider = "InMemory",
  workerBatchDelayMs = 0,
  isHealthy = true,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 px-5 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      {/* Left: Engine Health, Provider, and Worker Batch Telemetry */}
      <div className="flex flex-wrap items-center gap-3 text-xs">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#eefaf3] text-[#059669] border border-[#a7f3d0]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
          <span>{isHealthy ? "Engine Healthy" : "Degraded Engine"}</span>
        </span>

        <span className="text-slate-300">|</span>

        <span className="text-slate-600">
          Provider: <span className="font-bold text-slate-800">{provider}</span>
        </span>

        <span className="text-slate-400">·</span>

        <span className="text-slate-600">
          Worker Batch: <span className="font-bold text-slate-800">{workerBatchDelayMs}ms</span>
        </span>
      </div>

      {/* Right: Refresh Button */}
      <button
        type="button"
        onClick={onRefresh}
        disabled={isFetching}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50 self-start sm:self-auto"
        title="Refresh queue metrics"
      >
        <RotateCw className={`h-3.5 w-3.5 text-slate-600 ${isFetching ? "animate-spin text-[#005944]" : ""}`} />
        <span>Refresh</span>
      </button>
    </div>
  )
}
