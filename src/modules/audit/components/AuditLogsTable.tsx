import type { AuditLogRecord } from "../types"

interface AuditLogsTableProps {
  logs: AuditLogRecord[]
}

export function AuditLogsTable({ logs }: AuditLogsTableProps) {
  const getActionBadge = (action: string) => {
    if (action.startsWith("auth.")) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-blue-50 text-blue-700 border border-blue-200/60">
          {action}
        </span>
      )
    }

    if (action.startsWith("apikey.") || action.includes("created")) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
          {action}
        </span>
      )
    }

    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-slate-100 text-slate-700 border border-slate-200/60">
        {action}
      </span>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200/80 bg-white">
              <th className="py-3.5 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                TIMESTAMP (UTC)
              </th>
              <th className="py-3.5 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                ACTION
              </th>
              <th className="py-3.5 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                TENANT
              </th>
              <th className="py-3.5 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                ACTOR
              </th>
              <th className="py-3.5 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                ENTITY
              </th>
              <th className="py-3.5 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                SUMMARY
              </th>
              <th className="py-3.5 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                IP ADDRESS
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {logs.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="py-12 text-center text-xs text-slate-500"
                >
                  No audit records found matching criteria.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-slate-50/60 transition-colors"
                >
                  <td className="py-4 px-6 text-xs font-mono text-slate-600 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    {getActionBadge(log.action)}
                  </td>
                  <td className="py-4 px-6 text-sm font-medium text-slate-800">
                    {log.tenant}
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-700">
                    {log.actor}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span className="text-xs font-semibold text-slate-800 mr-2">
                      {log.entityType}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      {log.entityId}
                    </span>
                  </td>
                  <td
                    className="py-4 px-6 text-sm text-slate-700 max-w-sm sm:max-w-md truncate"
                    title={log.summary}
                  >
                    {log.summary}
                  </td>
                  <td className="py-4 px-6 text-xs font-mono text-slate-600 whitespace-nowrap">
                    {log.ipAddress}
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
