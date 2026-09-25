import type { AlertEvent } from "../types"

interface EventsTableProps {
  events: AlertEvent[]
  onAcknowledge?: (id: string) => void
  onResolve?: (id: string) => void
}

export function EventsTable({
  events,
  onAcknowledge,
  onResolve,
}: EventsTableProps) {
  const getSeverityBadge = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Critical
          </span>
        )
      case "warning":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Warning
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            {severity}
          </span>
        )
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200/60">
            Open
          </span>
        )
      case "acknowledged":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200/60">
            Acknowledged
          </span>
        )
      case "resolved":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            Resolved
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-50 text-slate-700 border border-slate-200/60">
            {status}
          </span>
        )
    }
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="px-6 pt-5 pb-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          EVENTS
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-t border-b border-slate-200/80 bg-slate-50/50">
              <th className="py-3 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                WHEN
              </th>
              <th className="py-3 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                SEVERITY
              </th>
              <th className="py-3 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                TITLE
              </th>
              <th className="py-3 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                STATUS
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {events.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="py-14 text-center text-xs text-slate-500 font-normal"
                >
                  No alerts.
                </td>
              </tr>
            ) : (
              events.map((evt) => (
                <tr
                  key={evt.id}
                  className="hover:bg-slate-50/60 transition-colors"
                >
                  <td className="py-3.5 px-6 text-sm text-slate-600 font-mono whitespace-nowrap">
                    {evt.when}
                  </td>
                  <td className="py-3.5 px-6 text-sm">
                    {getSeverityBadge(evt.severity)}
                  </td>
                  <td className="py-3.5 px-6 text-sm font-medium text-slate-800">
                    {evt.title}
                  </td>
                  <td className="py-3.5 px-6 text-sm">
                    <div className="flex items-center gap-3">
                      {getStatusBadge(evt.status)}
                      {evt.status.toLowerCase() === "open" && onAcknowledge && (
                        <button
                          type="button"
                          onClick={() => onAcknowledge(evt.id)}
                          className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
                        >
                          Acknowledge
                        </button>
                      )}
                      {evt.status.toLowerCase() === "acknowledged" && onResolve && (
                        <button
                          type="button"
                          onClick={() => onResolve(evt.id)}
                          className="text-xs text-emerald-600 hover:text-emerald-800 underline cursor-pointer"
                        >
                          Resolve
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
