import * as React from "react"
import { Activity } from "lucide-react"
import type { Connection } from "../types"

interface ConnectionsTableProps {
  connections: Connection[]
  isLoading: boolean
  onEdit: (conn: Connection) => void
  onDelete: (conn: Connection) => void
  onTest: (id: string, name: string) => void
}

export const ConnectionsTable: React.FC<ConnectionsTableProps> = ({
  connections,
  isLoading,
  onEdit,
  onDelete,
  onTest,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-white">
              <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                NAME
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                CARRIER
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                PROTOCOL
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                ENDPOINT
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                TPS
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                STATUS
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase text-right">
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              // Clean pulse skeleton rows while live data is loading
              Array.from({ length: 4 }).map((_, idx) => (
                <tr key={`conn-skel-${idx}`} className="animate-pulse">
                  <td className="px-6 py-4"><div className="h-4 w-28 bg-slate-200 rounded" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-24 bg-slate-200 rounded" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-14 bg-slate-200 rounded" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-28 bg-slate-200 rounded" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-12 bg-slate-200 rounded" /></td>
                  <td className="px-6 py-4"><div className="h-5 w-16 bg-slate-200 rounded-full" /></td>
                  <td className="px-6 py-4 text-right"><div className="h-4 w-24 bg-slate-200 rounded ml-auto" /></td>
                </tr>
              ))
            ) : connections.length > 0 ? (
              connections.map((conn) => (
                <tr key={conn.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => onEdit(conn)}
                      className="text-[#046a56] font-semibold text-sm hover:underline cursor-pointer text-left"
                    >
                      {conn.name}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-800 font-medium text-sm">
                    {conn.carrier}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      {conn.protocol}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-slate-600">
                    {conn.host}:{conn.port}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-700 text-sm">
                    {conn.tpsLimit} TPS
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {conn.status === "Connected" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#eefaf3] text-[#059669] border border-[#a7f3d0]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
                        Connected
                      </span>
                    ) : conn.status === "Connecting" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                        Connecting
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                        Disconnected
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => onTest(conn.id, conn.name)}
                        className="text-slate-600 hover:text-slate-900 font-semibold text-xs inline-flex items-center gap-1 cursor-pointer"
                        title="Ping connection"
                      >
                        <Activity className="h-3.5 w-3.5 text-[#005944]" />
                        Test
                      </button>
                      <button
                        type="button"
                        onClick={() => onEdit(conn)}
                        className="text-[#046a56] font-semibold text-sm hover:underline cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(conn)}
                        className="text-[#dc2626] font-semibold text-sm hover:underline cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-slate-400 text-sm">
                  No connections configured yet. Click &quot;Create connection&quot; to add one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
