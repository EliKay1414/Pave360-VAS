import * as React from "react"
import { RotateCw } from "lucide-react"

interface SmppServerHeaderProps {
  isRunning: boolean
  listeningPort: string | number
  onRefresh: () => void
  isFetching: boolean
}

export const SmppServerHeader: React.FC<SmppServerHeaderProps> = ({
  isRunning,
  listeningPort,
  onRefresh,
  isFetching,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
      <div>
        <p className="text-[13.5px] text-[#5b6e82] font-normal leading-normal">
          Inbound ESME connection listener, active binds, and throughput metrics.
        </p>
      </div>

      <div className="flex items-center gap-3 self-start sm:self-auto shrink-0">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200/90 rounded-lg shadow-2xs text-xs font-medium text-slate-700">
          <span className={`h-2 w-2 rounded-full ${isRunning ? "bg-[#10b981] animate-pulse" : "bg-slate-400"}`} />
          <span>{isRunning ? "Listening" : "Stopped"} on port <strong className="font-mono text-slate-900">{listeningPort}</strong></span>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={isFetching}
          className="p-2 border border-slate-200/90 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer shrink-0 disabled:opacity-50"
          title="Refresh server status"
          aria-label="Refresh status"
        >
          <RotateCw className={`h-4 w-4 ${isFetching ? "animate-spin text-[#005944]" : ""}`} />
        </button>
      </div>
    </div>
  )
}
