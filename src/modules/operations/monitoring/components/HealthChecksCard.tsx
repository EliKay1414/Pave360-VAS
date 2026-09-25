import type { HealthCheckItem } from "../types"

interface HealthChecksCardProps {
  checks: HealthCheckItem[]
}

export function HealthChecksCard({ checks }: HealthChecksCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs flex flex-col">
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-5">
        HEALTH CHECKS
      </h3>

      <div className="divide-y divide-slate-100 flex-1">
        {checks.map((item) => (
          <div
            key={item.name}
            className="grid grid-cols-12 items-center py-3.5 first:pt-0 last:pb-0"
          >
            <span className="col-span-5 text-sm font-semibold text-slate-800">
              {item.name}
            </span>

            <div className="col-span-5 flex items-center">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {item.status}
              </span>
            </div>

            <div className="col-span-2 text-right text-slate-400 text-sm">
              —
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
