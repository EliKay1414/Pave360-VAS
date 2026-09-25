import type { LedgerRecord } from "../types"

interface FinancialLedgerTableProps {
  records: LedgerRecord[]
  totalCount: number
}

export function FinancialLedgerTable({ records, totalCount }: FinancialLedgerTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-white">
              <th className="px-5 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                DATE &amp; TIME (UTC)
              </th>
              <th className="px-5 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                TENANT
              </th>
              <th className="px-5 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                CATEGORY
              </th>
              <th className="px-5 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                TYPE
              </th>
              <th className="px-5 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                AMOUNT
              </th>
              <th className="px-5 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                BALANCE AFTER
              </th>
              <th className="px-5 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                SEGMENTS / RATE
              </th>
              <th className="px-5 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                REFERENCE
              </th>
              <th className="px-5 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                DESCRIPTION
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans">
            {records.length > 0 ? (
              records.map((r) => {
                const isRelease = r.type === "Release"
                const isReserve = r.type === "Reserve"
                const isDebit = r.type === "Debit"
                const isTopUp = r.type === "Top-Up"

                return (
                  <tr
                    key={r.id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    {/* DATE & TIME (UTC) */}
                    <td className="px-5 py-3.5 whitespace-nowrap font-mono text-xs text-slate-600">
                      {r.dateTime}
                    </td>

                    {/* TENANT */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className="font-bold text-[#0c1a2e] text-xs">
                        {r.tenant}
                      </span>
                    </td>

                    {/* CATEGORY */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                        {r.category}
                      </span>
                    </td>

                    {/* TYPE */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold ${
                          isRelease
                            ? "bg-[#eff6ff] text-[#1d4ed8] border border-[#bfdbfe]"
                            : isReserve
                            ? "bg-[#fffbeb] text-[#b45309] border border-[#fde68a]"
                            : isDebit
                            ? "bg-[#fef2f2] text-[#b91c1c] border border-[#fecaca]"
                            : isTopUp
                            ? "bg-[#f0fdf4] text-[#15803d] border border-[#bbf7d0]"
                            : "bg-slate-100 text-slate-700 border border-slate-200"
                        }`}
                      >
                        {r.type}
                      </span>
                    </td>

                    {/* AMOUNT */}
                    <td className="px-5 py-3.5 whitespace-nowrap font-mono text-xs font-semibold text-slate-900">
                      {r.amount}
                    </td>

                    {/* BALANCE AFTER */}
                    <td className="px-5 py-3.5 whitespace-nowrap font-mono text-xs text-slate-800">
                      {r.balanceAfter}
                    </td>

                    {/* SEGMENTS / RATE */}
                    <td className="px-5 py-3.5 whitespace-nowrap font-mono text-xs text-slate-500">
                      {r.segmentsRate}
                    </td>

                    {/* REFERENCE: Plain text without link */}
                    <td className="px-5 py-3.5 whitespace-nowrap font-mono text-xs text-slate-700">
                      {r.reference}
                    </td>

                    {/* DESCRIPTION */}
                    <td className="px-5 py-3.5 max-w-[320px] truncate text-xs text-slate-600">
                      {r.description}
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td
                  colSpan={9}
                  className="px-6 py-16 text-center text-xs text-slate-500 font-normal"
                >
                  No ledger transactions found matching the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer pagination info */}
      <div className="border-t border-slate-100 px-6 py-4 bg-white">
        <p className="text-xs text-slate-500 font-normal">
          Showing {records.length} of {totalCount} total records · Page 1 of 1
        </p>
      </div>
    </div>
  )
}
