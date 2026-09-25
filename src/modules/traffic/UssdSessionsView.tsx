import * as React from "react"
import { X, RotateCw } from "lucide-react"
import { UssdSessionDetailView } from "./UssdSessionDetailView"

export interface UssdSessionRecord {
  id: string
  kind: "USSN" | "USSR" | "USSD" | string
  msisdn: string
  starCode: string
  status: "Delivered" | "Sent" | "Failed" | string
  text: string
  when: string
  ackRequested?: boolean
}

export interface UssdSessionsViewProps {
  initialNotifyOpen?: boolean
}

const STORAGE_KEY = "pave360_vas_ussd_sessions"

export function UssdSessionsView({ initialNotifyOpen = false }: UssdSessionsViewProps) {
  const [sessions, setSessions] = React.useState<UssdSessionRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) return parsed
      }
    } catch {
      // Fallback
    }
    // Default empty array matching screenshot media_1790349806394.png
    return []
  })

  // Selected Session for Detail View (matching Inbound MO behavior)
  const [selectedSession, setSelectedSession] = React.useState<UssdSessionRecord | null>(null)

  // Modal State
  const [isModalOpen, setIsModalOpen] = React.useState(initialNotifyOpen)

  // Form Fields matching screenshot media_1790349812923.png & media_1790350194535.png
  const [msisdn, setMsisdn] = React.useState("0241234567")
  const [messageText, setMessageText] = React.useState("")
  const [waitAck, setWaitAck] = React.useState(false)
  const [isSending, setIsSending] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  // Check URL query parameters and pathname on mount
  React.useEffect(() => {
    const isNotifyPath =
      window.location.pathname.endsWith("/notify") ||
      window.location.search.includes("notify")
    if (isNotifyPath) {
      setIsModalOpen(true)
    }

    const params = new URLSearchParams(window.location.search)
    const sessionIdParam = params.get("sessionId") || params.get("id")
    if (sessionIdParam) {
      const found = sessions.find((s) => s.id === sessionIdParam)
      if (found) {
        setSelectedSession(found)
      } else {
        setSelectedSession({
          id: sessionIdParam,
          kind: "USSN",
          msisdn: "0241234567",
          starCode: "*714#",
          status: "Delivered",
          text: "USSD notification session.",
          when: "2026-09-25 15:30:12",
          ackRequested: true,
        })
      }
    }
  }, [sessions])

  // Handle browser back/forward buttons
  React.useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search)
      const sessionIdParam = params.get("sessionId") || params.get("id")
      if (sessionIdParam) {
        const found = sessions.find((s) => s.id === sessionIdParam)
        setSelectedSession(
          found || {
            id: sessionIdParam,
            kind: "USSN",
            msisdn: "0241234567",
            starCode: "*714#",
            status: "Delivered",
            text: "USSD notification session.",
            when: "2026-09-25 15:30:12",
            ackRequested: true,
          }
        )
      } else {
        setSelectedSession(null)
      }

      if (window.location.pathname.endsWith("/notify")) {
        setIsModalOpen(true)
      } else if (!params.get("notify")) {
        setIsModalOpen(false)
      }
    }
    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [sessions])

  // Save sessions to localStorage
  const saveSessions = (updated: UssdSessionRecord[]) => {
    setSessions(updated)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch {
      // Ignore
    }
  }

  // Open / Close Detail View
  const handleOpenDetail = (session: UssdSessionRecord) => {
    setSelectedSession(session)
    const url = new URL(window.location.href)
    url.searchParams.set("sessionId", session.id)
    window.history.pushState({}, "", url.toString())
  }

  const handleBackFromDetail = () => {
    setSelectedSession(null)
    const url = new URL(window.location.href)
    url.searchParams.delete("sessionId")
    url.searchParams.delete("id")
    window.history.pushState({}, "", url.pathname + (url.search ? url.search : ""))
  }

  // Open / Close Notify Modal
  const handleOpenNotifyModal = () => {
    setErrorMessage(null)
    setIsModalOpen(true)
    const currentPath = window.location.pathname
    if (!currentPath.endsWith("/notify")) {
      window.history.pushState({}, "", "/ussd/notify")
    }
  }

  const handleCloseNotifyModal = () => {
    setIsModalOpen(false)
    setErrorMessage(null)
    if (window.location.pathname.endsWith("/notify")) {
      window.history.pushState({}, "", "/traffic/ussd-sessions")
    }
  }

  // Handle Send Notification Submit
  const handleSendSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const rawMsisdn = msisdn.trim()
    const rawMsg = messageText.trim()

    // Validate inputs
    // "Let this USSD notfy display when a wrong imput is entered. Now, when the right imputs are entered, let the modal detail link behind those IDs be displayed"
    // Screenshot media_1790350194535.png shows:
    // MSISDN = "clientId", Message = "clientId" -> Error: "No enabled USSD HTTP connection. Create one under Connections (protocol USSD HTTP; System ID = clientId; System type = starCode)."
    const digitsOnly = rawMsisdn.replace(/^\+/, "")
    const isInvalidMsisdn =
      !rawMsisdn ||
      rawMsisdn.toLowerCase() === "clientid" ||
      /[a-zA-Z]/.test(rawMsisdn) ||
      !/^\+?\d{9,15}$/.test(rawMsisdn) ||
      digitsOnly.length < 9

    if (isInvalidMsisdn || !rawMsg) {
      // Wrong input: Display exact error matching cropped screenshot media_1790350194535.png
      const systemIdDisplay = rawMsisdn || "clientId"
      setErrorMessage(
        `No enabled USSD HTTP connection. Create one under Connections (protocol USSD HTTP; System ID = ${systemIdDisplay}; System type = starCode).`
      )
      return
    }

    // Right input: Proceed with sending
    setErrorMessage(null)
    setIsSending(true)

    const now = new Date()
    const pad = (n: number) => n.toString().padStart(2, "0")
    const when = `${now.getUTCFullYear()}-${pad(now.getUTCMonth() + 1)}-${pad(
      now.getUTCDate()
    )} ${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())}:${pad(
      now.getUTCSeconds()
    )}`

    const randomHex = () =>
      Math.random().toString(16).substring(2, 10)
    const newId = `ussn_${randomHex()}${randomHex()}`

    // Standardize Ghanaian phone number (e.g. 0241234567 -> 233241234567)
    let formattedNum = rawMsisdn
    if (rawMsisdn.startsWith("0") && rawMsisdn.length === 10) {
      formattedNum = `233${rawMsisdn.substring(1)}`
    }

    const newSession: UssdSessionRecord = {
      id: newId,
      kind: "USSN",
      msisdn: formattedNum,
      starCode: "*714#",
      status: "Delivered",
      text: rawMsg,
      when,
      ackRequested: waitAck,
    }

    setTimeout(() => {
      saveSessions([newSession, ...sessions])
      setIsSending(false)
      handleCloseNotifyModal()
      setMessageText("")
      setWaitAck(false)
    }, 250)
  }

  // Handle Clear sessions
  const handleClearSessions = () => {
    if (window.confirm("Clear all simulated USSD sessions?")) {
      saveSessions([])
    }
  }

  // If a session is selected, display the detail view matching Inbound Message Detail
  if (selectedSession) {
    return (
      <UssdSessionDetailView
        session={selectedSession}
        onBack={handleBackFromDetail}
      />
    )
  }

  return (
    <div className="space-y-4 font-sans select-none pb-8">
      {/* 1. USSD Center Status Banner Card matching screenshot media_1790349806394.png */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-0.5">
            <span className="text-[12px] text-[#64748b] font-medium block">
              USSD Center
            </span>
            <h3 className="text-base font-bold text-[#0c1a2e]">
              Simulated
            </h3>
            <p className="text-[12.5px] text-[#64748b] font-normal pt-0.5">
              Simulated — notifications are stored locally and are not sent to a USSD Center.
            </p>
          </div>

          {/* Simulated Status Badge */}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#eefaf3] text-[#059669] border border-[#a7f3d0] shrink-0">
            <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
            Simulated
          </span>
        </div>
      </div>

      {/* 2. Subheader Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <p className="text-[13.5px] text-[#5b6e82] font-normal leading-normal">
          USSD Center sessions. Separate from SMS — notifications use HTTP-XML /SCBL/ussn.
        </p>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          {sessions.length > 0 && (
            <button
              type="button"
              onClick={handleClearSessions}
              className="px-3 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Clear sessions
            </button>
          )}

          {/* Send Notification Button matching screenshot */}
          <button
            type="button"
            onClick={handleOpenNotifyModal}
            className="px-4 py-2 bg-[#005944] hover:bg-[#004837] text-white text-[13px] font-semibold rounded-lg shadow-xs transition-colors cursor-pointer inline-flex items-center gap-2"
          >
            <span>Send notification</span>
          </button>
        </div>
      </div>

      {/* 3. USSD Sessions Data Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden mt-3">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-white">
                <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                  ID
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                  KIND
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                  MSISDN
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                  STAR CODE
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                  STATUS
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                  TEXT
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                  WHEN
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sessions.length > 0 ? (
                sessions.map((session) => (
                  <tr key={session.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* ID with clickable detail link matching Inbound Messages */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleOpenDetail(session)}
                        className="font-mono text-xs font-semibold text-[#0070f3] hover:underline cursor-pointer text-left"
                      >
                        {session.id}
                      </button>
                    </td>

                    {/* Kind */}
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-slate-700">
                      {session.kind}
                    </td>

                    {/* MSISDN */}
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-slate-800">
                      {session.msisdn}
                    </td>

                    {/* Star Code */}
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-xs font-semibold text-slate-900">
                      {session.starCode}
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#eefaf3] text-[#059669] border border-[#a7f3d0]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
                        {session.status}
                      </span>
                    </td>

                    {/* Text */}
                    <td className="px-6 py-4 text-xs text-slate-800 max-w-xs truncate select-text">
                      {session.text}
                    </td>

                    {/* When */}
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-slate-600">
                      {session.when}
                    </td>
                  </tr>
                ))
              ) : (
                /* Empty state matching screenshot media_1790349806394.png */
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-20 text-center text-[13.5px] text-[#5b6e82] font-normal"
                  >
                    No USSD sessions yet. Create a USSD HTTP connection, then send a notification.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. USSD notification (USSN) Modal matching screenshot media_1790350194535.png */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-[1px] animate-in fade-in-0 duration-150 font-sans">
          <div className="relative w-full max-w-115 bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-6 space-y-4">
            {/* Header matching cropped screenshot */}
            <div className="flex items-center justify-between pb-1">
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                USSD notification (USSN)
              </h3>
              <button
                type="button"
                onClick={handleCloseNotifyModal}
                className="border border-slate-300 rounded-md h-7 w-7 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <X className="h-3.5 w-3.5 stroke-[2.2]" />
              </button>
            </div>

            {/* Error Notification Alert matching cropped screenshot media_1790350194535.png */}
            {errorMessage && (
              <div className="bg-[#fef2f2] border border-[#fecaca] text-[#b91c1c] text-[12.5px] leading-relaxed p-3.5 rounded-lg select-text animate-in fade-in-50 duration-150">
                {errorMessage}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSendSubmit} className="space-y-4">
              {/* MSISDN */}
              <div>
                <label
                  htmlFor="ussn-msisdn"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  MSISDN
                </label>
                <input
                  id="ussn-msisdn"
                  type="text"
                  required
                  placeholder="0241234567"
                  value={msisdn}
                  onChange={(e) => {
                    setMsisdn(e.target.value)
                    if (errorMessage) setErrorMessage(null)
                  }}
                  className="w-full h-10 px-3.5 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-[#005944] text-slate-900 placeholder:text-slate-400 font-mono"
                />
              </div>

              {/* Message (max 174 characters) */}
              <div>
                <label
                  htmlFor="ussn-message"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Message (max 174 characters)
                </label>
                <textarea
                  id="ussn-message"
                  rows={4}
                  maxLength={174}
                  required
                  value={messageText}
                  onChange={(e) => {
                    setMessageText(e.target.value)
                    if (errorMessage) setErrorMessage(null)
                  }}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-[#005944] text-slate-900 resize-y min-h-22.5"
                />
              </div>

              {/* Checkbox: Wait for subscriber ack (delvrpt=1) */}
              <div className="flex items-center gap-2 pt-0.5">
                <input
                  type="checkbox"
                  id="wait-ack"
                  checked={waitAck}
                  onChange={(e) => setWaitAck(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-[#005944] focus:ring-[#005944] cursor-pointer"
                />
                <label
                  htmlFor="wait-ack"
                  className="text-xs text-slate-700 select-none cursor-pointer"
                >
                  Wait for subscriber ack (delvrpt=1)
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={handleCloseNotifyModal}
                  className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSending}
                  className="px-4 py-2 bg-[#005944] hover:bg-[#004837] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5"
                >
                  {isSending && <RotateCw className="h-3.5 w-3.5 animate-spin" />}
                  <span>Send</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export const VasUssdSessionsView = UssdSessionsView
export default UssdSessionsView
