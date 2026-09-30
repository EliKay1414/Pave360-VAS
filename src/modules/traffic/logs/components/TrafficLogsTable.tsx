import * as React from "react"
import type { MessageTrafficLog } from "../types"

interface TrafficLogsTableProps {
  logs: MessageTrafficLog[]
  onSelectMessage: (log: MessageTrafficLog) => void
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "Delivered":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#eefaf3] text-[#059669] border border-[#a7f3d0]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
          Delivered
        </span>
      )
    case "Failed":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#fef2f2] text-[#dc2626] border border-[#fecaca]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#ef4444]" />
          Failed
        </span>
      )
    case "Accepted":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Accepted
        </span>
      )
    case "Submitted":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
          Submitted
        </span>
      )
    case "Queued":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
          <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
          Queued
        </span>
      )
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
          <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
          {status}
        </span>
      )
  }
}

export function TrafficLogsTable({ logs, onSelectMessage }: TrafficLogsTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden mt-4">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-white">
              <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                MESSAGE ID
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                CATEGORY
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                FROM
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                TO
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                STATUS
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                ENCODING
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                CARRIER
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase text-right">
                CREATED (UTC)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {logs.length > 0 ? (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                  {/* Message ID */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => onSelectMessage(log)}
                      className="font-mono text-xs font-semibold text-[#0070f3] hover:underline cursor-pointer text-left"
                    >
                      {log.id}
                    </button>
                  </td>

                  {/* Category */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                      {log.category}
                    </span>
                  </td>

                  {/* From */}
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900 text-sm">
                    {log.from}
                  </td>

                  {/* To */}
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-slate-700">
                    {log.to}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={log.status} />
                  </td>

                  {/* Encoding */}
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-600">
                    {log.encoding} • {log.segments} seg
                  </td>

                  {/* Carrier */}
                  <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-slate-800">
                    {log.carrier}
                  </td>

                  {/* Created (UTC) */}
                  <td className="px-6 py-4 whitespace-nowrap text-right font-mono text-xs text-slate-600">
                    {log.createdUtc}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-slate-400 text-sm">
                  No message logs found matching your filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Table Pagination / Record Count Footer */}
      <div className="px-6 py-4 border-t border-slate-100 bg-white flex items-center justify-between text-xs text-slate-500">
        <span>
          Showing page 1 • {logs.length} total records
        </span>
      </div>
    </div>
  )
}
