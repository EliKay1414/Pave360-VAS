import * as React from "react"
import type { SmppSession } from "../types"

interface SmppSessionsTableProps {
  sessions: SmppSession[]
  isLoading: boolean
  onDisconnect: (session: SmppSession) => void
}

export const SmppSessionsTable: React.FC<SmppSessionsTableProps> = ({
  sessions,
  isLoading,
  onDisconnect,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
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
            {isLoading ? (
              // Clean pulse skeleton rows while live data is loading
              Array.from({ length: 3 }).map((_, idx) => (
                <tr key={`smpp-skel-${idx}`} className="animate-pulse">
                  <td className="px-6 py-4"><div className="h-4 w-28 bg-slate-200 rounded" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-24 bg-slate-200 rounded" /></td>
                  <td className="px-6 py-4"><div className="h-5 w-24 bg-slate-200 rounded-full" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-8 bg-slate-200 rounded" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-8 bg-slate-200 rounded" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-16 bg-slate-200 rounded" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-16 bg-slate-200 rounded" /></td>
                  <td className="px-6 py-4 text-right"><div className="h-4 w-16 bg-slate-200 rounded ml-auto" /></td>
                </tr>
              ))
            ) : sessions.length > 0 ? (
              sessions.map((session) => (
                <tr key={session.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap font-semibold text-slate-900">
                    {session.systemId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-slate-600">
                    {session.remoteEndpoint}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-block px-2.5 py-0.5 rounded text-xs font-semibold bg-[#eefaf3] text-[#059669] border border-[#a7f3d0]">
                      {session.bindState}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-800 text-sm">
                    {session.submits}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-800 text-sm">
                    {session.dlrs}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 font-mono">
                    {session.connectedAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 font-mono">
                    {session.lastActivity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button
                      type="button"
                      onClick={() => onDisconnect(session)}
                      className="text-[#dc2626] font-semibold text-xs hover:underline cursor-pointer"
                    >
                      Disconnect
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-slate-400 text-sm">
                  No active SMPP ESME client sessions bound.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
