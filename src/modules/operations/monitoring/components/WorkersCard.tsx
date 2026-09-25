import type { WorkerItem } from "../types"

interface WorkersCardProps {
  workers: WorkerItem[]
}

export function WorkersCard({ workers }: WorkersCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs flex flex-col">
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-5">
        WORKERS
      </h3>

      <div className="divide-y divide-slate-100 flex-1">
        {workers.map((worker) => (
          <div
            key={worker.name}
            className="grid grid-cols-12 items-center py-3 first:pt-0 last:pb-0"
          >
            <span className="col-span-6 text-sm font-semibold text-slate-800 truncate pr-2">
              {worker.name}
            </span>

            <div className="col-span-3 sm:col-span-4 flex items-center">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {worker.status}
              </span>
            </div>

            <div className="col-span-3 sm:col-span-2 text-right text-xs text-slate-500 font-mono">
              {worker.heartbeat}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
