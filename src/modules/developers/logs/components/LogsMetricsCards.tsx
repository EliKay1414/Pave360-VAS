import { BarChart2, CheckCircle2, AlertTriangle, Clock } from "lucide-react"

export function LogsMetricsCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {/* Card 1: 24H API VOLUME */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
            24H API VOLUME
          </span>
          <div className="p-1.5 rounded-lg bg-blue-50 text-[#0070f3]">
            <BarChart2 className="h-4 w-4" />
          </div>
        </div>
        <div className="my-2.5 flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-[28px] font-extrabold text-[#0c1a2e] tracking-tight">
            2
          </span>
          <span className="text-xs font-medium text-slate-500">reqs</span>
        </div>
        <span className="text-xs text-[#64748b]">
          Total requests logged over past 24 hours
        </span>
      </div>

      {/* Card 2: SUCCESS RATE */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
            SUCCESS RATE
          </span>
          <div className="p-1.5 rounded-lg bg-emerald-50 text-[#059669]">
            <CheckCircle2 className="h-4 w-4" />
          </div>
        </div>
        <div className="my-2.5 flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-[28px] font-extrabold text-[#059669] tracking-tight">
            50.0%
          </span>
        </div>
        <span className="text-xs text-[#64748b]">
          HTTP 2xx response ratio past 24h
        </span>
      </div>

      {/* Card 3: ERROR RATE */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
            ERROR RATE
          </span>
          <div className="p-1.5 rounded-lg bg-red-50 text-[#dc2626]">
            <AlertTriangle className="h-4 w-4" />
          </div>
        </div>
        <div className="my-2.5 flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-[28px] font-extrabold text-[#dc2626] tracking-tight">
            50.0%
          </span>
        </div>
        <span className="text-xs text-[#64748b]">
          HTTP 4xx/5xx response ratio past 24h
        </span>
      </div>

      {/* Card 4: LATENCY (AVG / P95) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
            LATENCY (AVG / P95)
          </span>
          <div className="p-1.5 rounded-lg bg-amber-50 text-[#d97706]">
            <Clock className="h-4 w-4" />
          </div>
        </div>
        <div className="my-2.5 flex items-baseline flex-wrap gap-1.5">
          <span className="text-2xl sm:text-[28px] font-extrabold text-[#0c1a2e] tracking-tight">
            4918.5
          </span>
          <span className="text-xs font-medium text-slate-500">ms avg</span>
          <span className="text-xs font-semibold text-[#d97706] ml-1">
            7676 ms P95
          </span>
        </div>
        <span className="text-xs text-[#64748b]">
          Server pipeline execution duration
        </span>
      </div>
    </div>
  )
}
