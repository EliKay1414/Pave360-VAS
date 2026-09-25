import * as React from "react"
import { MessageDetailRecord, resolveMessageRecord } from "./messageData"

export interface MessageDetailViewProps {
  message: Partial<MessageDetailRecord> & { id: string }
  onBack: () => void
}

export function MessageDetailView({ message: initialMessage, onBack }: MessageDetailViewProps) {
  // Dynamically resolve full record with all fields, lifecycles, and DLR reports
  const record = React.useMemo(() => {
    return resolveMessageRecord(initialMessage)
  }, [initialMessage])

  // Sync page title with active message ID in App Header
  React.useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("pave_set_page_title", { detail: record.id })
    )
    const prevDocTitle = document.title
    document.title = `${record.id} | Pave360 VAS`

    return () => {
      window.dispatchEvent(
        new CustomEvent("pave_set_page_title", { detail: null })
      )
      document.title = prevDocTitle
    }
  }, [record.id])

  // Status Badge Helper matching screenshots
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "Delivered":
      case "Processed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#eefaf3] text-[#059669] border border-[#a7f3d0]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
            {status}
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

  return (
    <div className="space-y-6 font-sans select-none pb-12">
      {/* 1. Header Action Row: Title, Status Badge, Route info, and Back button */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pt-1">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-[22px] font-bold text-[#0c1a2e] tracking-tight">
              {record.id}
            </h1>
            {renderStatusBadge(record.status)}
          </div>
          <p className="text-[13px] text-[#64748b] font-normal">
            {record.from} → {record.to} · {record.encoding} · {record.segments} segment(s)
          </p>
        </div>

        {/* Back Button matching screenshot */}
        <div>
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-1.5 text-[13px] font-semibold text-[#1e293b] bg-white border border-[#e2e8f0] rounded-lg hover:bg-slate-50 transition-colors shadow-xs cursor-pointer inline-flex items-center justify-center shrink-0"
          >
            Back
          </button>
        </div>
      </div>

      {/* 2. Main Two-Column Layout (Body + Lifecycle vs Delivery) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: BODY + LIFECYCLE (2 columns wide) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-7">
          {/* BODY Section */}
          <div>
            <h3 className="text-[11px] font-bold text-[#7c8ea2] uppercase tracking-wider mb-3">
              BODY
            </h3>
            <p className="text-[14px] text-pave-darkteal leading-relaxed select-text font-normal">
              {record.body}
            </p>
          </div>

          {/* LIFECYCLE Section */}
          <div>
            <h3 className="text-[11px] font-bold text-[#7c8ea2] uppercase tracking-wider mb-5">
              LIFECYCLE
            </h3>
            <div className="space-y-4">
              {record.lifecycle && record.lifecycle.length > 0 ? (
                record.lifecycle.map((event, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs">
                    <span
                      className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${
                        event.dotColor || "bg-[#059669]"
                      }`}
                    />
                    <div className="space-y-0.5">
                      <div className="font-bold text-[13.5px] text-pave-darkteal">
                        {event.title}
                      </div>
                      <div className="text-[12px] text-[#64748b]">
                        {event.timestamp} · {event.description}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400">No lifecycle events recorded.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: DELIVERY Section (1 column wide) */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.02)] h-fit space-y-4">
          <h3 className="text-[11px] font-bold text-[#7c8ea2] uppercase tracking-wider mb-4">
            DELIVERY
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <span className="text-[12px] text-[#7c8ea2] block font-medium">Carrier</span>
              <span className="text-[13.5px] font-bold text-pave-darkteal block mt-0.5">
                {record.carrier}
              </span>
            </div>

            <div>
              <span className="text-[12px] text-[#7c8ea2] block font-medium">Connection</span>
              <span className="text-[13.5px] font-bold text-pave-darkteal block mt-0.5">
                {record.connection}
              </span>
            </div>

            <div>
              <span className="text-[12px] text-[#7c8ea2] block font-medium">
                Carrier message ID
              </span>
              <span className="text-[13.5px] font-bold text-pave-darkteal font-mono block mt-0.5">
                {record.carrierMsgId}
              </span>
            </div>

            <div>
              <span className="text-[12px] text-[#7c8ea2] block font-medium">Attempts</span>
              <span className="text-[13.5px] font-bold text-pave-darkteal block mt-0.5">
                {record.attempts}
              </span>
            </div>

            <div>
              <span className="text-[12px] text-[#7c8ea2] block font-medium">
                Client reference
              </span>
              <span className="text-[13.5px] font-bold text-pave-darkteal block mt-0.5">
                {record.clientReference || "—"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Card: DELIVERY REPORTS Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.02)] mt-6">
        <h3 className="text-[11px] font-bold text-[#7c8ea2] uppercase tracking-wider mb-4">
          DELIVERY REPORTS
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-white">
                <th className="pb-3 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                  STATUS
                </th>
                <th className="pb-3 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                  CARRIER ID
                </th>
                <th className="pb-3 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                  ERROR
                </th>
                <th className="pb-3 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                  LATENCY
                </th>
                <th className="pb-3 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                  RECEIVED
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {record.dlrReports && record.dlrReports.length > 0 ? (
                record.dlrReports.map((dlr, idx) => (
                  <tr key={idx}>
                    <td className="py-3.5 whitespace-nowrap text-[13.5px] font-medium text-pave-darkteal">
                      {dlr.status}
                    </td>
                    <td className="py-3.5 whitespace-nowrap text-[13.5px] font-mono text-pave-darkteal">
                      {dlr.carrierId}
                    </td>
                    <td className="py-3.5 whitespace-nowrap text-[13.5px] font-mono text-[#64748b]">
                      {dlr.error}
                    </td>
                    <td className="py-3.5 whitespace-nowrap text-[13.5px] font-mono text-[#64748b]">
                      {dlr.latency}
                    </td>
                    <td className="py-3.5 whitespace-nowrap text-[13.5px] font-mono text-[#64748b]">
                      {dlr.received}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-xs text-slate-400">
                    No delivery reports recorded for this message.
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

export default MessageDetailView
