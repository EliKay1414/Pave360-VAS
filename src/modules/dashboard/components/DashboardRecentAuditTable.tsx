import * as React from "react"
import type { VasMetricData } from "../types"

interface DashboardRecentAuditTableProps {
  recentAuditActivity: VasMetricData["recentAuditActivity"]
}

export function DashboardRecentAuditTable({ recentAuditActivity }: DashboardRecentAuditTableProps) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
      <span className="block text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase mb-4">
        RECENT AUDIT ACTIVITY
      </span>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
              <th className="pb-3 pr-4 font-bold">WHEN</th>
              <th className="pb-3 pr-4 font-bold">ACTION</th>
              <th className="pb-3 pr-4 font-bold">ENTITY</th>
              <th className="pb-3 pr-4 font-bold">SUMMARY</th>
              <th className="pb-3 font-bold">USER</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/70 text-xs">
            {recentAuditActivity.map((audit) => (
              <tr
                key={audit.id}
                className="hover:bg-slate-50/50 transition-colors"
              >
                <td className="py-3.5 pr-4 whitespace-nowrap text-[#64748b] font-medium">
                  {audit.when}
                </td>
                <td className="py-3.5 pr-4 whitespace-nowrap font-extrabold text-[#0c1a2e]">
                  {audit.action}
                </td>
                <td className="py-3.5 pr-4 whitespace-nowrap text-[#64748b] font-medium">
                  {audit.entity}
                </td>
                <td className="py-3.5 pr-4 text-[#475569] font-medium">
                  {audit.summary}
                </td>
                <td className="py-3.5 whitespace-nowrap text-[#64748b] font-medium">
                  {audit.user}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
