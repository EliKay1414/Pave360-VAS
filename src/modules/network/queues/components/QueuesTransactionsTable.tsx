import * as React from "react"
import type { QueueTransaction } from "../types"

interface QueuesTransactionsTableProps {
  transactions: QueueTransaction[]
  isLoading: boolean
  onSelectMessage: (tx: QueueTransaction) => void
}

export const QueuesTransactionsTable: React.FC<QueuesTransactionsTableProps> = ({
  transactions,
  isLoading,
  onSelectMessage,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
      <div className="px-6 pt-5 pb-3 border-b border-slate-100 flex items-center justify-between">
        <span className="text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
          RECENT QUEUE TRAFFIC
        </span>
        <span className="text-xs font-medium text-[#7c8ea2]">
          Last {transactions.length} transactions
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-white">
              <th className="px-6 py-3.5 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                MESSAGE ID
              </th>
              <th className="px-6 py-3.5 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                SENDER
              </th>
              <th className="px-6 py-3.5 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                DESTINATION
              </th>
              <th className="px-6 py-3.5 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                ENCODING
              </th>
              <th className="px-6 py-3.5 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                SEGMENTS
              </th>
              <th className="px-6 py-3.5 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                STATUS
              </th>
              <th className="px-6 py-3.5 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase text-right">
                CREATED
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              // Clean pulse skeleton rows while live data is loading
              Array.from({ length: 4 }).map((_, idx) => (
                <tr key={`tx-skel-${idx}`} className="animate-pulse">
                  <td className="px-6 py-3.5"><div className="h-4 w-24 bg-slate-200 rounded" /></td>
                  <td className="px-6 py-3.5"><div className="h-4 w-20 bg-slate-200 rounded" /></td>
                  <td className="px-6 py-3.5"><div className="h-4 w-24 bg-slate-200 rounded" /></td>
                  <td className="px-6 py-3.5"><div className="h-4 w-12 bg-slate-200 rounded" /></td>
                  <td className="px-6 py-3.5"><div className="h-4 w-6 bg-slate-200 rounded" /></td>
                  <td className="px-6 py-3.5"><div className="h-5 w-16 bg-slate-200 rounded-full" /></td>
                  <td className="px-6 py-3.5 text-right"><div className="h-4 w-20 bg-slate-200 rounded ml-auto" /></td>
                </tr>
              ))
            ) : transactions.length > 0 ? (
              transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-3.5 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => onSelectMessage(tx)}
                      className="font-mono text-xs font-medium text-[#0070f3] hover:underline cursor-pointer text-left"
                    >
                      {tx.id}
                    </button>
                  </td>
                  <td className="px-6 py-3.5 whitespace-nowrap font-medium text-slate-900 text-sm">
                    {tx.sender}
                  </td>
                  <td className="px-6 py-3.5 whitespace-nowrap font-mono text-xs text-slate-700">
                    {tx.destination}
                  </td>
                  <td className="px-6 py-3.5 whitespace-nowrap text-slate-700 text-xs">
                    {tx.encoding}
                  </td>
                  <td className="px-6 py-3.5 whitespace-nowrap text-slate-800 text-sm">
                    {tx.segments}
                  </td>
                  <td className="px-6 py-3.5 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#eefaf3] text-[#059669] border border-[#a7f3d0]">
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 whitespace-nowrap text-right font-mono text-xs text-slate-600">
                    {tx.created}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-slate-400 text-sm">
                  No recent queue transactions recorded.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
