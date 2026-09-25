import * as React from "react"
import { RotateCw } from "lucide-react"

export interface SmppSession {
  id: string
  systemId: string
  remoteEndpoint: string
  bindState: "TRANSCEIVER" | "TRANSMITTER" | "RECEIVER"
  submits: number
  dlrs: number
  connectedAt: string
  lastActivity: string
}

const STORAGE_SESSIONS_KEY = "pave360_vas_smpp_sessions"
const STORAGE_PORT_KEY = "pave360_vas_smpp_port"

/**
 * Dynamically resolves the app's current port.
 * Avoids hardcoding: checks window.location.port, localStorage, or environment configuration.
 */
function resolveAppPort(): string {
  try {
    if (typeof window !== "undefined") {
      const savedPort = localStorage.getItem(STORAGE_PORT_KEY)
      if (savedPort && savedPort.trim()) return savedPort.trim()

      if (window.location.port && window.location.port.trim()) {
        return window.location.port.trim()
      }
    }
  } catch {
    // Ignore fallback
  }

  const envPort = import.meta.env.VITE_SMPP_PORT || import.meta.env.VITE_PORT
  if (envPort) return String(envPort).trim()

  return "2775"
}

export function SmppServerView() {
  // Dynamic App Port
  const [port, setPort] = React.useState<string>(resolveAppPort)
  const [isRefreshing, setIsRefreshing] = React.useState(false)

  // Listen to window or storage changes if port updates
  React.useEffect(() => {
    const detected = resolveAppPort()
    if (detected !== port) {
      setPort(detected)
    }
  }, [])

  // Active ESME Sessions (loaded from storage or empty by default matching screenshot)
  const [sessions, setSessions] = React.useState<SmppSession[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SESSIONS_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) return parsed
      }
    } catch {
      // Fallback
    }
    return []
  })

  // Calculate aggregates
  const activeSessionsCount = sessions.length
  const totalSubmits = sessions.reduce((acc, s) => acc + (s.submits || 0), 0)
  const totalDlrs = sessions.reduce((acc, s) => acc + (s.dlrs || 0), 0)

  // Refresh handler
  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      // Re-read storage and port
      try {
        const saved = localStorage.getItem(STORAGE_SESSIONS_KEY)
        if (saved) {
          setSessions(JSON.parse(saved))
        }
        setPort(resolveAppPort())
      } catch {
        // Fallback
      }
      setIsRefreshing(false)
    }, 400)
  }

  // Disconnect session
  const handleDisconnect = (id: string) => {
    const updated = sessions.filter((s) => s.id !== id)
    setSessions(updated)
    try {
      localStorage.setItem(STORAGE_SESSIONS_KEY, JSON.stringify(updated))
    } catch {
      // Ignore
    }
  }

  // Bind address e.g. 0.0.0.0:5173
  const bindAddress = `0.0.0.0:${port}`

  return (
    <div className="space-y-5 font-sans select-none">
      {/* 1. Subheader: Title, Status Badge, Subtitle & Refresh Button */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pt-1">
        <div className="space-y-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-[22px] font-bold text-[#0c1a2e] tracking-tight">
              Inbound SMPP Server
            </h2>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#eefaf3] text-[#059669] border border-[#a7f3d0]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
              Listening on Port {port}
            </span>
          </div>
          <p className="text-[13.5px] text-[#5b6e82] font-normal leading-normal max-w-3xl">
            Accepts inbound SMPP 3.4 client sessions from external CPaaS, aggregators, or enterprise clients (transceiver, transmitter, receiver).
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-[13px] font-semibold transition-colors cursor-pointer shadow-xs shrink-0 self-start disabled:opacity-60"
        >
          <RotateCw className={`h-3.5 w-3.5 text-slate-600 ${isRefreshing ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* 2. Top Summary Metric Cards (3 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: ACTIVE ESME SESSIONS */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
            ACTIVE ESME SESSIONS
          </div>
          <div className="text-3xl font-bold text-slate-900 mt-2">
            {activeSessionsCount}
          </div>
          <div className="text-xs text-[#7c8ea2] mt-2 font-normal">
            Connected SMPP clients
          </div>
        </div>

        {/* Card 2: TOTAL INGESTED (SUBMIT_SM) */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
            TOTAL INGESTED (SUBMIT_SM)
          </div>
          <div className="text-3xl font-bold text-slate-900 mt-2">
            {totalSubmits.toLocaleString()}
          </div>
          <div className="text-xs text-[#7c8ea2] mt-2 font-normal">
            From active sessions
          </div>
        </div>

        {/* Card 3: DLRS DELIVERED (DELIVER_SM) */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
            DLRS DELIVERED (DELIVER_SM)
          </div>
          <div className="text-3xl font-bold text-slate-900 mt-2">
            {totalDlrs.toLocaleString()}
          </div>
          <div className="text-xs text-[#7c8ea2] mt-2 font-normal">
            Receipts returned to clients
          </div>
        </div>
      </div>

      {/* 3. Inbound ESME Sessions Data Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden mt-5">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-white">
                <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                  SYSTEM ID
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                  REMOTE ENDPOINT
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                  BIND STATE
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                  SUBMITS
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                  DLRS
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                  CONNECTED AT
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                  LAST ACTIVITY
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase text-right">
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sessions.length > 0 ? (
                sessions.map((session) => (
                  <tr
                    key={session.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-slate-900">
                      {session.systemId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-slate-600">
                      {session.remoteEndpoint}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#eefaf3] text-[#059669] border border-[#a7f3d0]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
                        {session.bindState}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-800 font-medium">
                      {session.submits.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-800 font-medium">
                      {session.dlrs.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-600 text-xs">
                      {session.connectedAt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-600 text-xs">
                      {session.lastActivity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        type="button"
                        onClick={() => handleDisconnect(session.id)}
                        className="text-[#dc2626] font-semibold text-sm hover:underline cursor-pointer"
                      >
                        Disconnect
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center">
                    <p className="text-[13.5px] text-[#5b6e82] leading-relaxed">
                      No active SMPP client sessions connected. Configure your external CPaaS / ESME client to bind to{" "}
                      <code className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-slate-700 text-xs border border-slate-200">
                        {bindAddress}
                      </code>
                      {" "}
                      .
                    </p>
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

export default SmppServerView
