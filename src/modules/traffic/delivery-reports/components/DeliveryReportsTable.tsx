import * as React from "react"
import type { DeliveryReportRecord } from "../types"

interface DeliveryReportsTableProps {
  reports: DeliveryReportRecord[]
  isLoading: boolean
  onOpenReport: (report: DeliveryReportRecord) => void
}

export const DeliveryReportsTable: React.FC<DeliveryReportsTableProps> = ({
  reports,
  isLoading,
  onOpenReport,
}) => {
  const renderStatusBadge = (status: string) => {
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
      case "Expired":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Expired
          </span>
        )
      case "Rejected":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            Rejected
          </span>
        )
      case "Accepted":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Accepted
          </span>
        )
      case "Unknown":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
            Unknown
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

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden mt-5">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-white">
              <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                MESSAGE
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                TENANT
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                CARRIER
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                CARRIER MSG ID
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                STATUS
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                ERROR
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                LATENCY
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase text-right">
                RECEIVED
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, idx) => (
                <tr key={`dlr-skel-${idx}`} className="animate-pulse">
                  <td className="px-6 py-4"><div className="h-4 w-32 bg-slate-200 rounded" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-20 bg-slate-200 rounded" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-28 bg-slate-200 rounded" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-24 bg-slate-200 rounded" /></td>
                  <td className="px-6 py-4"><div className="h-5 w-20 bg-slate-200 rounded-full" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-12 bg-slate-200 rounded" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-14 bg-slate-200 rounded" /></td>
                  <td className="px-6 py-4 text-right"><div className="h-4 w-24 bg-slate-200 rounded ml-auto" /></td>
                </tr>
              ))
            ) : reports.length > 0 ? (
              reports.map((report, idx) => (
                <tr key={report.id ? `${report.id}-${idx}` : `report-${idx}`} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => onOpenReport(report)}
                      className="font-mono text-xs font-semibold text-[#0070f3] hover:underline cursor-pointer text-left"
                    >
                      {report.id}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold text-slate-900 text-sm">
                    {report.tenant}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-slate-800">
                    {report.carrier}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-slate-700">
                    {report.carrierMsgId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderStatusBadge(report.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-slate-600">
                    {report.error}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-slate-700">
                    {report.latency}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right font-mono text-xs text-slate-600">
                    {report.received}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-slate-400 text-sm">
                  No delivery reports found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
