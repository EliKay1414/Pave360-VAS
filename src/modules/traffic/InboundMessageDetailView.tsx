import * as React from "react"

export interface InboundMessageDetailViewProps {
  message: {
    id: string
    from: string
    to: string
    keyword: string
    body: string
    status: string
    received?: string
    notes?: string
  }
  onBack: () => void
}

/**
 * Format Ghanaian phone numbers into standard MSISDN (e.g. 0241234567 -> 233241234567)
 * matching screenshot media_1790347132272.png
 */
export const formatInboundMsisdn = (num: string): string => {
  const clean = num.trim()
  if (clean.startsWith("0") && clean.length === 10) {
    return `233${clean.substring(1)}`
  }
  return clean
}

/**
 * Generate compliance / routing notes based on keyword and body
 * matching screenshot media_1790347132272.png
 */
export const getInboundNotes = (keyword: string, body: string, customNotes?: string): string => {
  if (customNotes) return customNotes
  const kw = (keyword || body.trim().split(/\s+/)[0] || "").toUpperCase()
  if (kw === "STOP") {
    return "Keyword STOP recorded for compliance handling."
  }
  if (kw === "START") {
    return "Keyword START opt-in recorded for recipient subscription."
  }
  if (kw === "HELP") {
    return "Keyword HELP recorded and customer care auto-reply triggered."
  }
  return `Keyword ${kw || "MO"} recorded for compliance handling.`
}

export function InboundMessageDetailView({ message, onBack }: InboundMessageDetailViewProps) {
  // Sync page title with active message ID in App Header
  React.useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("pave_set_page_title", { detail: message.id })
    )
    const prevDocTitle = document.title
    document.title = `${message.id} | Pave360 VAS`

    return () => {
      window.dispatchEvent(
        new CustomEvent("pave_set_page_title", { detail: null })
      )
      document.title = prevDocTitle
    }
  }, [message.id])

  const formattedFrom = React.useMemo(() => {
    return formatInboundMsisdn(message.from)
  }, [message.from])

  const notes = React.useMemo(() => {
    return getInboundNotes(message.keyword, message.body, message.notes)
  }, [message.keyword, message.body, message.notes])

  const displayStatus = message.status === "Processed" ? "Forwarded" : message.status || "Forwarded"

  return (
    <div className="font-sans select-none pb-12 pt-1">
      {/* Exact card layout matching user screenshot media_1790347132272.png */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-8 shadow-[0_1px_3px_rgba(0,0,0,0.02)] max-w-3xl space-y-6">
        {/* Title: Message ID */}
        <h1 className="text-xl sm:text-[22px] font-bold text-[#0c1a2e] tracking-tight">
          {message.id}
        </h1>

        {/* Row 1: From & To */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <span className="text-[12.5px] text-[#64748b] block font-normal mb-1">
              From
            </span>
            <span className="text-[15px] font-bold text-[#0c1a2e] block">
              {formattedFrom}
            </span>
          </div>

          <div>
            <span className="text-[12.5px] text-[#64748b] block font-normal mb-1">
              To
            </span>
            <span className="text-[15px] font-bold text-[#0c1a2e] block">
              {message.to}
            </span>
          </div>
        </div>

        {/* Row 2: Keyword & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <span className="text-[12.5px] text-[#64748b] block font-normal mb-1">
              Keyword
            </span>
            <span className="text-[15px] font-bold text-[#0c1a2e] block">
              {message.keyword}
            </span>
          </div>

          <div>
            <span className="text-[12.5px] text-[#64748b] block font-normal mb-1">
              Status
            </span>
            <span className="text-[15px] font-bold text-[#0c1a2e] block">
              {displayStatus}
            </span>
          </div>
        </div>

        {/* Row 3: Body */}
        <div>
          <span className="text-[12.5px] text-[#64748b] block font-normal mb-1">
            Body
          </span>
          <span className="text-[15px] font-bold text-[#0c1a2e] block select-text">
            {message.body}
          </span>
        </div>

        {/* Row 4: Notes */}
        <div>
          <span className="text-[12.5px] text-[#64748b] block font-normal mb-1">
            Notes
          </span>
          <p className="text-[14px] text-[#0c1a2e] font-normal leading-relaxed">
            {notes}
          </p>
        </div>

        {/* Row 5: Back Button */}
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

export default InboundMessageDetailView
