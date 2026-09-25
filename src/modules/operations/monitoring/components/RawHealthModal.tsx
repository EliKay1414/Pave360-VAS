import { useState } from "react"
import { X, Copy, Check } from "lucide-react"
import type { HealthCheckItem, WorkerItem, CarrierConnectionItem, MonitoringOverview } from "../types"

interface RawHealthModalProps {
  isOpen: boolean
  onClose: () => void
  overview: MonitoringOverview
  checks: HealthCheckItem[]
  workers: WorkerItem[]
  connections: CarrierConnectionItem[]
}

export function RawHealthModal({
  isOpen,
  onClose,
  overview,
  checks,
  workers,
  connections,
}: RawHealthModalProps) {
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const healthPayload = {
    status: overview.overallStatus.toLowerCase(),
    timestamp: new Date().toISOString(),
    open_alerts: overview.openAlerts,
    metrics: {
      last_15_min: {
        total: overview.last15MinTotal,
        delivered: overview.last15MinDelivered,
        failed: overview.last15MinFailed,
      },
      sms_submit_queue: overview.smsSubmitQueue,
      side_queues: overview.sideQueues,
    },
    checks: checks.reduce<Record<string, { status: string }>>((acc, item) => {
      acc[item.name] = { status: item.status.toLowerCase() }
      return acc
    }, {}),
    workers: workers.reduce<Record<string, { status: string; last_heartbeat: string }>>((acc, worker) => {
      acc[worker.name] = {
        status: worker.status.toLowerCase(),
        last_heartbeat: worker.heartbeat,
      }
      return acc
    }, {}),
    carrier_connections: connections.map((c) => ({
      carrier: c.carrier,
      connection: c.connection,
      status: c.status,
      enabled: c.enabled === "Yes" || c.enabled === true,
      last_status: c.lastStatus,
    })),
  }

  const jsonString = JSON.stringify(healthPayload, null, 2)

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-100 text-emerald-800">
                GET
              </span>
              <h3 className="text-base font-bold text-slate-800">/health</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Live JSON response payload from the health check endpoint
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-950 font-mono text-xs text-slate-200 select-all">
          <pre className="whitespace-pre">{jsonString}</pre>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Copied JSON</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy JSON</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
