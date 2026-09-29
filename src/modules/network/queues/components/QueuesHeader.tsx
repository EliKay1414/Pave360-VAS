import * as React from "react"
import { RotateCw } from "lucide-react"

interface QueuesHeaderProps {
  onRefresh: () => void
  isFetching: boolean
}

export const QueuesHeader: React.FC<QueuesHeaderProps> = ({ onRefresh, isFetching }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
      <p className="text-[13.5px] text-[#5b6e82] font-normal leading-normal">
        Real-time dispatch pipeline depth, Redis/RabbitMQ queue telemetry, and background worker fleet health.
      </p>

      <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
        <button
          type="button"
          onClick={onRefresh}
          disabled={isFetching}
          className="p-2 border border-slate-200/90 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer shrink-0 disabled:opacity-50"
          title="Refresh queue metrics"
          aria-label="Refresh queue metrics"
        >
          <RotateCw className={`h-4 w-4 ${isFetching ? "animate-spin text-[#005944]" : ""}`} />
        </button>
      </div>
    </div>
  )
}
