import * as React from "react"
import { RotateCw, Plus } from "lucide-react"

interface ConnectionsHeaderProps {
  onOpenCreate: () => void
  onRefresh: () => void
  isFetching: boolean
}

export const ConnectionsHeader: React.FC<ConnectionsHeaderProps> = ({
  onOpenCreate,
  onRefresh,
  isFetching,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
      <p className="text-[13.5px] text-[#5b6e82] font-normal leading-normal">
        Carrier interconnect bind sessions, credentials, and throughput throttles.
      </p>

      <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
        <button
          type="button"
          onClick={onRefresh}
          disabled={isFetching}
          className="p-2 border border-slate-200/90 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer shrink-0 disabled:opacity-50"
          title="Refresh connections from gateway"
          aria-label="Refresh connections"
        >
          <RotateCw className={`h-4 w-4 ${isFetching ? "animate-spin text-[#005944]" : ""}`} />
        </button>

        <button
          type="button"
          onClick={onOpenCreate}
          className="inline-flex items-center justify-center px-4 py-2 bg-[#005944] hover:bg-[#004837] text-white text-sm font-semibold rounded-lg shadow-xs transition-colors cursor-pointer shrink-0 gap-1.5"
        >
          <Plus className="h-4 w-4" />
          Create connection
        </button>
      </div>
    </div>
  )
}
