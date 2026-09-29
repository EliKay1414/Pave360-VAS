import * as React from "react"
import type { BackgroundWorker } from "../types"

interface QueuesWorkersTableProps {
  workers: BackgroundWorker[]
  isLoading: boolean
}

export const QueuesWorkersTable: React.FC<QueuesWorkersTableProps> = ({ workers, isLoading }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
      <div className="px-6 pt-5 pb-3 border-b border-slate-100 flex items-center justify-between">
        <span className="text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
          BACKGROUND WORKERS FLEET
        </span>
        <span className="text-xs font-medium text-[#7c8ea2]">
          {workers.length} active process{workers.length !== 1 ? "es" : ""}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-white">
              <th className="px-6 py-3.5 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                WORKER INSTANCE
              </th>
              <th className="px-6 py-3.5 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                ASSIGNED ROLE
              </th>
              <th className="px-6 py-3.5 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                TARGET CHANNEL
              </th>
              <th className="px-6 py-3.5 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                STATUS
              </th>
              <th className="px-6 py-3.5 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase text-right">
                LAST HEARTBEAT
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              // Clean pulse skeleton rows while live data is loading
              Array.from({ length: 4 }).map((_, idx) => (
                <tr key={`worker-skel-${idx}`} className="animate-pulse">
                  <td className="px-6 py-3.5"><div className="h-4 w-32 bg-slate-200 rounded" /></td>
                  <td className="px-6 py-3.5"><div className="h-4 w-28 bg-slate-200 rounded" /></td>
                  <td className="px-6 py-3.5"><div className="h-4 w-24 bg-slate-200 rounded" /></td>
                  <td className="px-6 py-3.5"><div className="h-5 w-16 bg-slate-200 rounded-full" /></td>
                  <td className="px-6 py-3.5 text-right"><div className="h-4 w-20 bg-slate-200 rounded ml-auto" /></td>
                </tr>
              ))
            ) : workers.length > 0 ? (
              workers.map((worker) => (
                <tr key={worker.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-3.5 whitespace-nowrap font-mono text-xs font-semibold text-slate-900">
                    {worker.name}
                  </td>
                  <td className="px-6 py-3.5 whitespace-nowrap text-slate-700 text-xs">
                    {worker.role}
                  </td>
                  <td className="px-6 py-3.5 whitespace-nowrap">
                    <span className="bg-slate-50 text-slate-600 text-[11px] font-mono px-2 py-0.5 rounded border border-slate-200">
                      {worker.targetChannel}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 whitespace-nowrap">
                    {worker.status === "Healthy" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#eefaf3] text-[#059669] border border-[#a7f3d0]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
                        Healthy
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                        {worker.status}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-3.5 whitespace-nowrap text-right font-mono text-xs text-slate-600">
                    {worker.lastHeartbeat}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-400 text-sm">
                  No background workers active.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
