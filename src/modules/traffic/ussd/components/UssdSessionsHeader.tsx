import * as React from "react"
import { Send, RotateCw } from "lucide-react"

interface UssdSessionsHeaderProps {
  onOpenNotify: () => void
  onRefresh: () => void
  isFetching: boolean
}

export const UssdSessionsHeader: React.FC<UssdSessionsHeaderProps> = ({
  onOpenNotify,
  onRefresh,
  isFetching,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
      <div>
        <p className="text-[13.5px] text-[#5b6e82] font-normal leading-normal">
          Interactive USSD sessions and network-initiated flash push alerts across GSM shortcodes.
        </p>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
        <button
          type="button"
          onClick={onRefresh}
          disabled={isFetching}
          className="p-2 border border-slate-200/90 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer shrink-0 disabled:opacity-50"
          title="Refresh USSD sessions from gateway"
          aria-label="Refresh sessions"
        >
          <RotateCw className={`h-4 w-4 ${isFetching ? "animate-spin text-[#005944]" : ""}`} />
        </button>

        <button
          type="button"
          onClick={onOpenNotify}
          className="px-4 py-2 bg-[#005944] hover:bg-[#004837] text-white text-[13px] font-semibold rounded-lg shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5 shrink-0"
        >
          <Send className="h-4 w-4" />
          Send USSD notify
        </button>
      </div>
    </div>
  )
}
