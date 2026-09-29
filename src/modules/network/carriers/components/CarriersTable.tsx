import * as React from "react"
import type { Carrier } from "../types"

interface CarriersTableProps {
  carriers: Carrier[]
  isLoading: boolean
  onEdit: (carrier: Carrier) => void
  onDelete: (carrier: Carrier) => void
}

export const CarriersTable: React.FC<CarriersTableProps> = ({
  carriers,
  isLoading,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-white">
              <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                CARRIER
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                CODE
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                COUNTRY
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                MCC/MNC
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                STATUS
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                PRIORITY
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                CONNECTIONS
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase text-right">
                {/* Actions column */}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              // Clean pulse skeleton rows while live data is loading
              Array.from({ length: 4 }).map((_, idx) => (
                <tr key={`carrier-skel-${idx}`} className="animate-pulse">
                  <td className="px-6 py-4"><div className="h-4 w-28 bg-slate-200 rounded" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-16 bg-slate-200 rounded" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-12 bg-slate-200 rounded" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-16 bg-slate-200 rounded" /></td>
                  <td className="px-6 py-4"><div className="h-5 w-16 bg-slate-200 rounded-full" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-8 bg-slate-200 rounded" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-14 bg-slate-200 rounded" /></td>
                  <td className="px-6 py-4 text-right"><div className="h-4 w-20 bg-slate-200 rounded ml-auto" /></td>
                </tr>
              ))
            ) : carriers.length > 0 ? (
              carriers.map((carrier) => (
                <tr key={carrier.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => onEdit(carrier)}
                      className="text-[#046a56] font-semibold text-sm hover:underline cursor-pointer text-left"
                    >
                      {carrier.name}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-800 font-medium text-sm">
                    {carrier.code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-800 font-medium text-sm">
                    {carrier.country}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-600 font-normal text-sm">
                    {carrier.mcc ? `${carrier.mcc} / ${carrier.mnc}` : "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {carrier.status === "Active" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#eefaf3] text-[#059669] border border-[#a7f3d0]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-800 font-medium text-sm">
                    {carrier.priority}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-700 font-medium text-sm">
                    {carrier.connections}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => onEdit(carrier)}
                        className="text-[#046a56] font-semibold text-sm hover:underline cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(carrier)}
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
                <td colSpan={8} className="px-6 py-10 text-center text-slate-400 text-sm">
                  No carriers configured yet. Click &quot;Create carrier&quot; to add one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
