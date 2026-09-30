import * as React from "react"
import type { BackgroundWorker } from "../types"

interface QueuesWorkersTableProps {
  workers: BackgroundWorker[]
  isLoading: boolean
}

export const QueuesWorkersTable: React.FC<QueuesWorkersTableProps> = ({ workers, isLoading }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
      {/* Table Card Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">
          ACTIVE BACKGROUND WORKERS
        </span>
        <span className="text-xs font-medium text-slate-500">
          {workers.length} Workers Online
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-white">
              <th className="px-6 py-3.5 text-[11px] font-bold text-slate-400 tracking-wider uppercase">
                WORKER NAME
              </th>
              <th className="px-6 py-3.5 text-[11px] font-bold text-slate-400 tracking-wider uppercase">
                PIPELINE ROLE
              </th>
              <th className="px-6 py-3.5 text-[11px] font-bold text-slate-400 tracking-wider uppercase">
                TARGET CHANNEL
              </th>
              <th className="px-6 py-3.5 text-[11px] font-bold text-slate-400 tracking-wider uppercase">
                STATUS
              </th>
              <th className="px-6 py-3.5 text-[11px] font-bold text-slate-400 tracking-wider uppercase text-right">
                LAST HEARTBEAT
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, idx) => (
                <tr key={`worker-skel-${idx}`} className="animate-pulse">
                  <td className="px-6 py-3.5"><div className="h-4 w-36 bg-slate-200 rounded" /></td>
                  <td className="px-6 py-3.5"><div className="h-4 w-44 bg-slate-200 rounded" /></td>
                  <td className="px-6 py-3.5"><div className="h-5 w-24 bg-slate-200 rounded" /></td>
                  <td className="px-6 py-3.5"><div className="h-5 w-16 bg-slate-200 rounded-full" /></td>
                  <td className="px-6 py-3.5 text-right"><div className="h-4 w-16 bg-slate-200 rounded ml-auto" /></td>
                </tr>
              ))
            ) : workers.length > 0 ? (
              workers.map((worker, idx) => (
                <tr key={worker.id ? `${worker.id}-${idx}` : `worker-${idx}`} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-3.5 whitespace-nowrap font-mono text-xs font-medium text-slate-900">
                    {worker.name}
                  </td>
                  <td className="px-6 py-3.5 whitespace-nowrap text-xs text-slate-700">
                    {worker.role}
                  </td>
                  <td className="px-6 py-3.5 whitespace-nowrap">
                    <span className="inline-block bg-[#f8fafc] border border-slate-200/80 rounded px-2.5 py-0.5 font-mono text-[11px] text-slate-600">
                      {worker.targetChannel}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 whitespace-nowrap">
                    {worker.status === "Healthy" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#eefaf3] text-[#059669] border border-[#a7f3d0]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
                        Healthy
                      </span>
                    ) : worker.status === "Stale" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#fffbeb] text-[#d97706] border border-[#fde68a]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#f59e0b]" />
                        Stale
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
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
                  No background workers online.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
