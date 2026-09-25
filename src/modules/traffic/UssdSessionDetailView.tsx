import * as React from "react"
import type { UssdSessionRecord } from "./UssdSessionsView"

export interface UssdSessionDetailViewProps {
  session: UssdSessionRecord
  onBack: () => void
}

/**
 * Format Ghanaian phone numbers into standard MSISDN (e.g. 0241234567 -> 233241234567)
 */
export const formatUssdMsisdn = (num: string): string => {
  const clean = (num || "").trim()
  if (clean.startsWith("0") && clean.length === 10) {
    return `233${clean.substring(1)}`
  }
  return clean
}

export function UssdSessionDetailView({ session, onBack }: UssdSessionDetailViewProps) {
  // Sync page title with active session ID in App Header
  React.useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("pave_set_page_title", { detail: session.id })
    )
    const prevDocTitle = document.title
    document.title = `${session.id} | Pave360 VAS`

    return () => {
      window.dispatchEvent(
        new CustomEvent("pave_set_page_title", { detail: null })
      )
      document.title = prevDocTitle
    }
  }, [session.id])

  const formattedMsisdn = React.useMemo(() => {
    return formatUssdMsisdn(session.msisdn)
  }, [session.msisdn])

  return (
    <div className="font-sans select-none pb-12 pt-1">
      {/* Exact card layout matching user specifications and inbound detail view */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-8 shadow-[0_1px_3px_rgba(0,0,0,0.02)] max-w-3xl space-y-6">
        {/* Title: Session ID */}
        <h1 className="text-xl sm:text-[22px] font-bold text-[#0c1a2e] tracking-tight">
          {session.id}
        </h1>

        {/* Row 1: MSISDN & Star Code */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <span className="text-[12.5px] text-[#64748b] block font-normal mb-1">
              MSISDN
            </span>
            <span className="text-[15px] font-bold text-[#0c1a2e] block font-mono">
              {formattedMsisdn}
            </span>
          </div>

          <div>
            <span className="text-[12.5px] text-[#64748b] block font-normal mb-1">
              Star Code
            </span>
            <span className="text-[15px] font-bold text-[#0c1a2e] block font-mono">
              {session.starCode || "*714#"}
            </span>
          </div>
        </div>

        {/* Row 2: Kind & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <span className="text-[12.5px] text-[#64748b] block font-normal mb-1">
              Kind
            </span>
            <span className="text-[15px] font-bold text-[#0c1a2e] block">
              {session.kind || "USSN"}
            </span>
          </div>

          <div>
            <span className="text-[12.5px] text-[#64748b] block font-normal mb-1">
              Status
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#eefaf3] text-[#059669] border border-[#a7f3d0]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
              {session.status || "Delivered"}
            </span>
          </div>
        </div>

        {/* Row 3: Text */}
        <div>
          <span className="text-[12.5px] text-[#64748b] block font-normal mb-1">
            Text
          </span>
          <span className="text-[15px] font-bold text-[#0c1a2e] block select-text">
            {session.text}
          </span>
        </div>

        {/* Row 4: Subscriber Ack & When */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <span className="text-[12.5px] text-[#64748b] block font-normal mb-1">
              Subscriber Ack
            </span>
            <span className="text-[14px] text-[#0c1a2e] font-medium block">
              {session.ackRequested ? "Requested (delvrpt=1)" : "Not requested (delvrpt=0)"}
            </span>
          </div>

          <div>
            <span className="text-[12.5px] text-[#64748b] block font-normal mb-1">
              When
            </span>
            <span className="text-[14px] font-mono text-[#0c1a2e] font-medium block">
              {session.when}
            </span>
          </div>
        </div>

        {/* Row 5: Notes */}
        <div>
          <span className="text-[12.5px] text-[#64748b] block font-normal mb-1">
            Notes
          </span>
          <p className="text-[14px] text-[#0c1a2e] font-normal leading-relaxed">
            USSD Center session notification sent via HTTP-XML /SCBL/ussn. Handset delivery confirmed.
          </p>
        </div>

        {/* Row 6: Back Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-1.5 text-[13px] font-semibold text-[#1e293b] bg-white border border-[#e2e8f0] rounded-lg hover:bg-slate-50 transition-colors shadow-xs cursor-pointer inline-flex items-center justify-center"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  )
}

export default UssdSessionDetailView
