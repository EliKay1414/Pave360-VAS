import * as React from "react"
import { X, CheckCircle2, Clock, AlertTriangle } from "lucide-react"
import { MessageDetailView } from "./MessageDetailView"
import { resolveMessageRecord } from "./messageData"

export interface DeliveryReportRecord {
  id: string
  tenant: string
  carrier: string
  carrierMsgId: string
  status: "Delivered" | "Failed" | "Expired" | "Rejected" | "Accepted" | "Unknown" | string
  error: string
  latency: string
  received: string
  timeline?: {
    stage: string
    timestamp: string
    status: "done" | "failed" | "pending"
    detail?: string
  }[]
}

const STORAGE_KEY = "pave360_vas_delivery_reports"

/**
 * Exact items and order from user screenshot media_1790344470080.png
 */
export const DLR_STATUS_OPTIONS = [
  "All",
  "Delivered",
  "Failed",
  "Expired",
  "Rejected",
  "Accepted",
  "Unknown",
] as const

const INITIAL_REPORTS: DeliveryReportRecord[] = [
  // 1. Primary Delivered items from screenshots
  {
    id: "msg_5c10ee3518774ad7",
    tenant: "Pave360",
    carrier: "AT Ghana SMSC",
    carrierMsgId: "2078720061",
    status: "Delivered",
    error: "000",
    latency: "0 ms",
    received: "2026-09-24 13:29:09",
    timeline: [
      { stage: "submit_sm Ingested", timestamp: "2026-09-24 13:29:09.110", status: "done", detail: "SMPP bind TRX_01" },
      { stage: "Carrier Dispatch", timestamp: "2026-09-24 13:29:09.112", status: "done", detail: "Sent to AT Ghana SMSC" },
      { stage: "deliver_sm Handset Receipt", timestamp: "2026-09-24 13:29:09.115", status: "done", detail: "stat:DELIVRD err:000" },
    ],
  },
  {
    id: "msg_a2c621cb0ce14480",
    tenant: "Pave360",
    carrier: "AT Ghana SMSC",
    carrierMsgId: "2078493351",
    status: "Delivered",
    error: "000",
    latency: "0 ms",
    received: "2026-09-24 13:17:35",
    timeline: [
      { stage: "submit_sm Ingested", timestamp: "2026-09-24 13:17:35.200", status: "done", detail: "SMPP bind TRX_01" },
      { stage: "Carrier Dispatch", timestamp: "2026-09-24 13:17:35.202", status: "done", detail: "Sent to AT Ghana SMSC" },
      { stage: "deliver_sm Handset Receipt", timestamp: "2026-09-24 13:17:35.205", status: "done", detail: "stat:DELIVRD err:000" },
    ],
  },
  {
    id: "msg_5c6bc185992b4ed9",
    tenant: "Pave360",
    carrier: "AT Ghana SMSC",
    carrierMsgId: "2662416431",
    status: "Delivered",
    error: "000",
    latency: "0 ms",
    received: "2026-09-23 01:04:42",
    timeline: [
      { stage: "submit_sm Ingested", timestamp: "2026-09-23 01:04:42.010", status: "done", detail: "SMPP bind TRX_01" },
      { stage: "Carrier Dispatch", timestamp: "2026-09-23 01:04:42.012", status: "done", detail: "Sent to AT Ghana SMSC" },
      { stage: "deliver_sm Handset Receipt", timestamp: "2026-09-23 01:04:42.015", status: "done", detail: "stat:DELIVRD err:000" },
    ],
  },
  {
    id: "msg_98f608ceca5143ae",
    tenant: "Pave360",
    carrier: "AT Ghana SMSC",
    carrierMsgId: "2248774541",
    status: "Delivered",
    error: "000",
    latency: "0 ms",
    received: "2026-09-23 00:22:12",
  },
  {
    id: "msg_00621478c58b4590",
    tenant: "Pave360",
    carrier: "AT Ghana SMSC",
    carrierMsgId: "2048447391",
    status: "Delivered",
    error: "000",
    latency: "0 ms",
    received: "2026-09-23 00:21:50",
  },
  {
    id: "msg_ec70f5f3770d41aa",
    tenant: "Pave360",
    carrier: "AT Ghana SMSC",
    carrierMsgId: "2235574731",
    status: "Delivered",
    error: "000",
    latency: "0 ms",
    received: "2026-09-22 11:55:59",
  },
  {
    id: "msg_8d15fd56f5a94dde",
    tenant: "Pave360",
    carrier: "AT Ghana SMSC",
    carrierMsgId: "2035246991",
    status: "Delivered",
    error: "000",
    latency: "0 ms",
    received: "2026-09-22 11:55:47",
  },
  {
    id: "msg_7906f186a8734cce",
    tenant: "Pave360",
    carrier: "AT Ghana SMSC",
    carrierMsgId: "2648980491",
    status: "Delivered",
    error: "000",
    latency: "0 ms",
    received: "2026-09-22 11:55:31",
  },
  {
    id: "msg_e32a6069a2374c8d",
    tenant: "Pave360",
    carrier: "AT Ghana SMSC",
    carrierMsgId: "2235563641",
    status: "Delivered",
    error: "000",
    latency: "0 ms",
    received: "2026-09-22 11:55:19",
  },
  {
    id: "msg_0e1ed3408e644391",
    tenant: "Pave360",
    carrier: "AT Ghana SMSC",
    carrierMsgId: "2648910321",
    status: "Delivered",
    error: "000",
    latency: "0 ms",
    received: "2026-09-22 11:51:12",
  },
  {
    id: "msg_b6c391d469f54c70",
    tenant: "Pave360",
    carrier: "AT Ghana SMSC",
    carrierMsgId: "2235487941",
    status: "Delivered",
    error: "000",
    latency: "0 ms",
    received: "2026-09-22 11:50:38",
  },
  {
    id: "msg_7ad55daa3d244a4b",
    tenant: "Pave360",
    carrier: "AT Ghana SMSC",
    carrierMsgId: "2835155911",
    status: "Delivered",
    error: "000",
    latency: "0 ms",
    received: "2026-09-22 11:50:24",
  },
  {
    id: "msg_4d3ace1560764877",
    tenant: "Pave360",
    carrier: "AT Ghana SMSC",
    carrierMsgId: "2648883631",
    status: "Delivered",
    error: "000",
    latency: "0 ms",
    received: "2026-09-22 11:49:28",
  },
  {
    id: "msg_3145cd9edb3b46ec",
    tenant: "Pave360",
    carrier: "AT Ghana SMSC",
    carrierMsgId: "2034982861",
    status: "Delivered",
    error: "000",
    latency: "0 ms",
    received: "2026-09-22 11:39:43",
  },
  {
    id: "msg_c2e4db3467e7400d",
    tenant: "Pave360",
    carrier: "AT Ghana SMSC",
    carrierMsgId: "2235277971",
    status: "Delivered",
    error: "000",
    latency: "0 ms",
    received: "2026-09-22 11:37:57",
  },
  {
    id: "msg_6fd1b667c1ce4bee",
    tenant: "Pave360",
    carrier: "AT Ghana SMSC",
    carrierMsgId: "2234996370",
    status: "Delivered",
    error: "000",
    latency: "60000 ms",
    received: "2026-09-22 11:32:49",
    timeline: [
      { stage: "submit_sm Ingested", timestamp: "2026-09-22 11:31:49.000", status: "done", detail: "SMPP bind TRX_01" },
      { stage: "Carrier Dispatch", timestamp: "2026-09-22 11:31:49.120", status: "done", detail: "Sent to AT Ghana SMSC" },
      { stage: "Carrier Retry Buffer", timestamp: "2026-09-22 11:32:19.000", status: "done", detail: "Handset buffered 60s" },
      { stage: "deliver_sm Handset Receipt", timestamp: "2026-09-22 11:32:49.000", status: "done", detail: "stat:DELIVRD err:000" },
    ],
  },

  // 2. Failed items
  {
    id: "msg_6437a53e536e439b",
    tenant: "Pave360",
    carrier: "AT Ghana SMSC",
    carrierMsgId: "2234961657",
    status: "Failed",
    error: "011",
    latency: "0 ms",
    received: "2026-09-22 11:17:36",
    timeline: [
      { stage: "submit_sm Ingested", timestamp: "2026-09-22 11:17:36.100", status: "done", detail: "SMPP bind TRX_01" },
      { stage: "Carrier Dispatch", timestamp: "2026-09-22 11:17:36.105", status: "done", detail: "Sent to AT Ghana SMSC" },
      { stage: "SMSC DLR Failure", timestamp: "2026-09-22 11:17:36.110", status: "failed", detail: "stat:UNDELIV err:011 Subscriber Absent" },
    ],
  },

  // 3. Expired item (matching Expired status in dropdown)
  {
    id: "msg_88fe2109ba431100",
    tenant: "Pave360",
    carrier: "Telecel Ghana Core",
    carrierMsgId: "2990182736",
    status: "Expired",
    error: "003",
    latency: "86400 ms",
    received: "2026-09-25 12:44:50",
    timeline: [
      { stage: "submit_sm Ingested", timestamp: "2026-09-24 12:44:50.000", status: "done", detail: "SMPP bind TRX_TLC" },
      { stage: "Carrier Validity Timeout", timestamp: "2026-09-25 12:44:50.000", status: "failed", detail: "stat:EXPIRED err:003 Validity period elapsed" },
    ],
  },

  // 4. Rejected item (matching Rejected status in dropdown)
  {
    id: "msg_7721ba99ce112233",
    tenant: "Pave360",
    carrier: "AT Ghana SMSC",
    carrierMsgId: "2198301144",
    status: "Rejected",
    error: "025",
    latency: "2 ms",
    received: "2026-09-25 12:44:00",
    timeline: [
      { stage: "submit_sm Ingested", timestamp: "2026-09-25 12:44:00.000", status: "done", detail: "SMPP bind TRX_01" },
      { stage: "SMSC Barred Check", timestamp: "2026-09-25 12:44:00.002", status: "failed", detail: "stat:REJECTD err:025 Blacklisted MSISDN" },
    ],
  },

  // 5. Accepted item (matching Accepted status in dropdown)
  {
    id: "msg_9c41eb89a42111fe",
    tenant: "Pave360",
    carrier: "MTN Ghana SMSC",
    carrierMsgId: "2881029381",
    status: "Accepted",
    error: "000",
    latency: "12 ms",
    received: "2026-09-25 12:45:10",
    timeline: [
      { stage: "submit_sm Ingested", timestamp: "2026-09-25 12:45:09.988", status: "done", detail: "SMPP bind TRX_MTN" },
      { stage: "SMSC Acknowledged", timestamp: "2026-09-25 12:45:10.000", status: "done", detail: "stat:ACCEPTD err:000" },
    ],
  },

  // 6. Unknown item (matching Unknown status in dropdown)
  {
    id: "msg_4497cd22ef990011",
    tenant: "Pave360",
    carrier: "AT Ghana SMSC",
    carrierMsgId: "2000000000",
    status: "Unknown",
    error: "999",
    latency: "0 ms",
    received: "2026-09-25 12:35:45",
    timeline: [
      { stage: "submit_sm Ingested", timestamp: "2026-09-25 12:35:45.000", status: "done", detail: "SMPP bind TRX_01" },
      { stage: "DLR Query Pending", timestamp: "2026-09-25 12:35:45.050", status: "pending", detail: "stat:UNKNOWN err:999 Network state indeterminate" },
    ],
  },
]

export function DeliveryReportsView() {
  const [reports] = React.useState<DeliveryReportRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch {
      // Fallback
    }
    return INITIAL_REPORTS
  })

  // Filter States
  const [statusFilter, setStatusFilter] = React.useState<string>("All")
  const [idFilter, setIdFilter] = React.useState<string>("")
  const [submittedQuery, setSubmittedQuery] = React.useState<string>("")

  // Modal State for Retry Timeline
  const [selectedReport, setSelectedReport] = React.useState<DeliveryReportRecord | null>(null)

  // Direct reactive filtering communicating directly with table
  const filteredReports = React.useMemo(() => {
    return reports.filter((item) => {
      // 1. Status Filter Check
      if (statusFilter !== "All") {
        if (item.status.toLowerCase() !== statusFilter.toLowerCase()) {
          return false
        }
      }

      // 2. ID Filter Check (Message ID or Carrier Msg ID)
      const query = (submittedQuery || idFilter).trim().toLowerCase()
      if (query) {
        const matchMsg = item.id.toLowerCase().includes(query)
        const matchCarrierMsg = item.carrierMsgId.toLowerCase().includes(query)
        if (!matchMsg && !matchCarrierMsg) {
          return false
        }
      }

      return true
    })
  }, [reports, statusFilter, idFilter, submittedQuery])

  const handleFilterSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setSubmittedQuery(idFilter.trim())
  }

  // Status Badge Renderer matching exact styling
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

  // Check URL query param for direct message linking
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const idParam = params.get("messageId") || params.get("id")
    if (idParam) {
      const found = reports.find((r) => r.id === idParam || r.carrierMsgId === idParam)
      if (found) {
        setSelectedReport(found)
      } else {
        setSelectedReport({
          id: idParam,
          tenant: "Pave360",
          carrier: "AT Ghana SMSC",
          carrierMsgId: "2078720061",
          status: "Delivered",
          error: "000",
          latency: "0 ms",
          received: "2026-09-24 13:29:09",
        })
      }
    }
  }, [reports])

  // Handle browser back/forward buttons
  React.useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search)
      const idParam = params.get("messageId") || params.get("id")
      if (idParam) {
        const found = reports.find((r) => r.id === idParam || r.carrierMsgId === idParam)
        setSelectedReport(
          found || {
            id: idParam,
            tenant: "Pave360",
            carrier: "AT Ghana SMSC",
            carrierMsgId: "2078720061",
            status: "Delivered",
            error: "000",
            latency: "0 ms",
            received: "2026-09-24 13:29:09",
          }
        )
      } else {
        setSelectedReport(null)
      }
    }
    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [reports])

  const handleOpenReport = (report: DeliveryReportRecord) => {
    setSelectedReport(report)
    const url = new URL(window.location.href)
    url.searchParams.set("messageId", report.id)
    window.history.pushState({}, "", url.toString())
  }

  const handleBackFromDetail = () => {
    setSelectedReport(null)
    const url = new URL(window.location.href)
    url.searchParams.delete("messageId")
    url.searchParams.delete("id")
    window.history.pushState({}, "", url.pathname + (url.search ? url.search : ""))
  }

  // If a report/message is selected, render the dedicated MessageDetailView matching the screenshots
  if (selectedReport) {
    return (
      <MessageDetailView
        message={{
          id: selectedReport.id,
          carrier: selectedReport.carrier,
          carrierMsgId: selectedReport.carrierMsgId,
          status: selectedReport.status,
          createdUtc: selectedReport.received,
          errorReason: selectedReport.error !== "000" ? selectedReport.error : undefined,
          dlrReports: [
            {
              status: selectedReport.status,
              carrierId: selectedReport.carrierMsgId,
              error: selectedReport.error,
              latency: selectedReport.latency,
              received: selectedReport.received,
            },
          ],
        }}
        onBack={handleBackFromDetail}
      />
    )
  }

  return (
    <div className="space-y-4 font-sans select-none pb-8">
      {/* 1. Subheader: Page Description */}
      <p className="text-[13.5px] text-[#5b6e82] font-normal leading-normal pt-1">
        Carrier delivery receipts (DLRs) for this tenant. Simulated SMPP writes a Delivered DLR after submit. Live SMSC deliver_sm will land here once Inetlab is wired. Open a message ID for the retry timeline.
      </p>

      {/* 2. Top Filter Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] mt-3">
        <form onSubmit={handleFilterSubmit} className="flex flex-col sm:flex-row items-end gap-3">
          {/* Status Select: In exact order from media_1790344470080.png */}
          <div className="w-full sm:w-auto">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="dlr-status">
              Status
            </label>
            <select
              id="dlr-status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto min-w-50 h-10 px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-[#005944] text-slate-900 cursor-pointer"
            >
              {DLR_STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Message or carrier ID Input */}
          <div className="w-full flex-1">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="dlr-search-id">
              Message or carrier ID
            </label>
            <input
              id="dlr-search-id"
              type="text"
              placeholder="msg_... or sim_..."
              value={idFilter}
              onChange={(e) => {
                setIdFilter(e.target.value)
                setSubmittedQuery(e.target.value.trim())
              }}
              className="w-full h-10 px-3.5 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-[#005944] placeholder:text-slate-400 text-slate-900"
            />
          </div>

          {/* Deep Green Filter Button */}
          <button
            type="submit"
            className="w-full sm:w-auto h-10 px-6 py-2 bg-[#005944] hover:bg-[#004837] text-white text-sm font-semibold rounded-lg shadow-xs transition-colors cursor-pointer shrink-0"
          >
            Filter
          </button>
        </form>
      </div>

      {/* 3. Delivery Reports Data Table Card */}
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
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Message ID (Clickable to open message detail) */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleOpenReport(report)}
                        className="font-mono text-xs font-semibold text-[#0070f3] hover:underline cursor-pointer text-left"
                      >
                        {report.id}
                      </button>
                    </td>

                    {/* Tenant */}
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-slate-900 text-sm">
                      {report.tenant}
                    </td>

                    {/* Carrier */}
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-slate-800">
                      {report.carrier}
                    </td>

                    {/* Carrier Msg ID */}
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-slate-700">
                      {report.carrierMsgId}
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderStatusBadge(report.status)}
                    </td>

                    {/* Error Code */}
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-slate-600">
                      {report.error}
                    </td>

                    {/* Latency */}
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-slate-700">
                      {report.latency}
                    </td>

                    {/* Received Timestamp */}
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
    </div>
  )
}

export default DeliveryReportsView
