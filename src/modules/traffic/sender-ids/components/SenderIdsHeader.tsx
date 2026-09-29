import * as React from "react"
import { Plus, RotateCw } from "lucide-react"

interface SenderIdsHeaderProps {
  onOpenRegister: () => void
  onRefresh: () => void
  isFetching: boolean
}

export const SenderIdsHeader: React.FC<SenderIdsHeaderProps> = ({
  onOpenRegister,
  onRefresh,
  isFetching,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
      <p className="text-[13.5px] text-[#5b6e82] font-normal leading-normal">
        Whitelisted sender headers for outbound SMS dispatch & compliance.
      </p>

      <div className="flex items-center gap-2 self-start sm:self-auto">
        <button
          type="button"
          onClick={onRefresh}
          disabled={isFetching}
          className="p-2 border border-slate-200/90 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer shrink-0 disabled:opacity-50"
          title="Refresh Sender IDs from live gateway"
          aria-label="Refresh sender IDs"
        >
          <RotateCw className={`h-4 w-4 ${isFetching ? "animate-spin text-[#005944]" : ""}`} />
        </button>

        <button
          type="button"
          onClick={onOpenRegister}
          className="px-4 py-2 bg-[#005944] hover:bg-[#004837] text-white text-[13px] font-semibold rounded-lg shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5 shrink-0"
        >
          <Plus className="h-4 w-4" />
          Register sender
        </button>
      </div>
    </div>
  )
}
