import { Zap, RotateCw, BookOpen } from "lucide-react"

interface LogsHeaderBannerProps {
  isRefreshing: boolean
  onRefresh: () => void
}

export function LogsHeaderBanner({ isRefreshing, onRefresh }: LogsHeaderBannerProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 shrink-0">
            <Zap className="h-5 w-5 fill-purple-600/20" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#0c1a2e] tracking-tight">
              Developer API Logs &amp; Inspector
            </h2>
            <p className="text-xs text-[#64748b] mt-0.5">
              Real-time HTTP request &amp; response telemetry for external and tenant API traffic
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={onRefresh}
            className="px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            <RotateCw
              className={`h-3.5 w-3.5 text-slate-500 ${
                isRefreshing ? "animate-spin" : ""
              }`}
            />
            <span>Refresh</span>
          </button>

          <a
            href="/developers/documentation"
            className="px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            <BookOpen className="h-3.5 w-3.5 text-slate-500" />
            <span>Swagger Docs</span>
          </a>
        </div>
      </div>
    </div>
  )
}
