import * as React from "react"
import type { InboundMessageRecord } from "../types"

interface InboundMoTableProps {
  messages: InboundMessageRecord[]
  isLoading: boolean
  onSelectMessage: (msg: InboundMessageRecord) => void
}

export const InboundMoTable: React.FC<InboundMoTableProps> = ({
  messages,
  isLoading,
  onSelectMessage,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden mt-3">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-white">
              <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                ID
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                FROM
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                TO
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                KEYWORD
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                BODY
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                STATUS
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                RECEIVED
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={`skeleton-${i}`} className="animate-pulse">
                  <td className="px-6 py-4">
                    <div className="h-4 bg-slate-100 rounded w-28" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-slate-100 rounded w-24" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-slate-100 rounded w-16" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-5 bg-slate-100 rounded w-14" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-slate-100 rounded w-44" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-5 bg-slate-100 rounded-full w-20" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-slate-100 rounded w-24" />
                  </td>
                </tr>
              ))
            ) : messages.length > 0 ? (
              messages.map((msg) => (
                <tr key={msg.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => onSelectMessage(msg)}
                      className="font-mono text-xs font-semibold text-[#0070f3] hover:underline cursor-pointer text-left"
                    >
                      {msg.id}
                    </button>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-slate-800 font-medium">
                    {msg.from}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap font-semibold text-xs text-slate-900">
                    {msg.to}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700 font-mono">
                      {msg.keyword}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-xs text-slate-800 max-w-xs truncate select-text">
                    {msg.body}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#eefaf3] text-[#059669] border border-[#a7f3d0]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
                      {msg.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-slate-600">
                    {msg.received}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-20 text-center text-[13.5px] text-[#5b6e82] font-normal"
                >
                  No inbound messages found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
