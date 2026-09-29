import * as React from "react"
import { RotateCw, Search } from "lucide-react"

interface InboundMoHeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onRefresh: () => void
  isFetching: boolean
}

export const InboundMoHeader: React.FC<InboundMoHeaderProps> = ({
  searchQuery,
  onSearchChange,
  onRefresh,
  isFetching,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
      <div>
        <p className="text-[13.5px] text-[#5b6e82] font-normal leading-normal">
          Mobile-originated messages (STOP/START/HELP and handset replies).
        </p>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
        <div className="relative w-48 sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Filter MSISDN or keyword..."
            className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200/90 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#005944] focus:ring-1 focus:ring-[#005944] transition-all"
          />
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={isFetching}
          className="p-2 border border-slate-200/90 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer shrink-0 disabled:opacity-50"
          title="Refresh inbound messages from gateway"
          aria-label="Refresh inbound messages"
        >
          <RotateCw className={`h-4 w-4 ${isFetching ? "animate-spin text-[#005944]" : ""}`} />
        </button>
      </div>
    </div>
  )
}
