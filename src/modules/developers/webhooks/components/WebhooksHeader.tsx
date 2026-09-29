import * as React from "react"
import { RotateCw } from "lucide-react"

interface WebhooksHeaderProps {
  onCreateClick: () => void
  onRefresh?: () => void
  isFetching?: boolean
}

export function WebhooksHeader({ onCreateClick, onRefresh, isFetching }: WebhooksHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
      <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
        Signed outbound callbacks for delivery and inbound events.
      </p>

      <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={isFetching}
            className="p-2 border border-slate-200/90 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer shrink-0 disabled:opacity-50"
            title="Refresh webhooks from gateway"
            aria-label="Refresh webhooks"
          >
            <RotateCw className={`h-4 w-4 ${isFetching ? "animate-spin text-[#005944]" : ""}`} />
          </button>
        )}

        <button
          type="button"
          onClick={onCreateClick}
          className="h-9 px-4 bg-[#005944] hover:bg-[#004837] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer inline-flex items-center justify-center shrink-0"
        >
          Create webhook
        </button>
      </div>
    </div>
  )
}
