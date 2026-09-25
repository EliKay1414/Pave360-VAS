import { Eye } from "lucide-react"
import type { ApiLogRecord } from "../types"

interface LogsTableProps {
  logs: ApiLogRecord[]
  totalCount: number
  onInspect: (log: ApiLogRecord) => void
}

export function LogsTable({ logs, totalCount, onInspect }: LogsTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-white">
              <th className="px-5 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                STATUS
              </th>
              <th className="px-5 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                METHOD
              </th>
              <th className="px-5 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                REQUEST PATH &amp; QUERY
              </th>
              <th className="px-5 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                DURATION
              </th>
              <th className="px-5 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                API KEY / TENANT
              </th>
              <th className="px-5 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                CLIENT IP
              </th>
              <th className="px-5 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                TIMESTAMP (UTC)
              </th>
              <th className="px-5 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans">
            {logs.length > 0 ? (
              logs.map((log) => {
                const is2xx = log.status >= 200 && log.status < 300
                const is4xx = log.status >= 400 && log.status < 500

                return (
                  <tr
                    key={log.id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    {/* STATUS */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-0.5 font-mono text-xs font-semibold rounded-md ${
                          is2xx
                            ? "bg-[#eefaf3] text-[#059669] border border-[#a7f3d0]"
                            : is4xx
                            ? "bg-[#fffbeb] text-[#b45309] border border-[#fde68a]"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>

                    {/* METHOD */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 font-mono text-[11px] font-bold rounded ${
                          log.method === "POST"
                            ? "bg-[#eefaf3] text-[#059669]"
                            : log.method === "GET"
                            ? "bg-blue-50 text-[#0070f3]"
                            : log.method === "PUT"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {log.method}
                      </span>
                    </td>

                    {/* REQUEST PATH & QUERY */}
                    <td className="px-5 py-3.5 whitespace-nowrap font-mono text-xs text-slate-800">
                      {log.path}
                    </td>

                    {/* DURATION */}
                    <td className="px-5 py-3.5 whitespace-nowrap font-mono text-xs font-semibold text-[#dc2626]">
                      {log.duration} ms
                    </td>

                    {/* API KEY / TENANT */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="space-y-0.5">
                        <span className="font-bold text-[#0c1a2e] text-xs block">
                          {log.tenant}
                        </span>
                        <span className="font-mono text-[11px] text-slate-400 block">
                          {log.apiKey}
                        </span>
                      </div>
                    </td>

                    {/* CLIENT IP */}
                    <td className="px-5 py-3.5 whitespace-nowrap font-mono text-xs text-slate-600">
                      {log.clientIp}
                    </td>

                    {/* TIMESTAMP (UTC) */}
                    <td className="px-5 py-3.5 whitespace-nowrap font-mono text-xs text-slate-600">
                      {log.timestamp}
                    </td>

                    {/* ACTIONS: Inspect Button */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onInspect(log)}
                        className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-lg shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <Eye className="h-3.5 w-3.5 text-slate-500" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="px-6 py-16 text-center text-xs text-slate-500 font-normal"
                >
                  No developer API logs found matching the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer pagination info */}
      <div className="border-t border-slate-100 px-6 py-4 bg-white">
        <p className="text-xs text-slate-500 font-normal">
          Showing {logs.length} of {totalCount} total API log(s) · Page 1 of 1
        </p>
      </div>
    </div>
  )
}
