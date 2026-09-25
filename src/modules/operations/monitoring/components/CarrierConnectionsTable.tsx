import type { CarrierConnectionItem } from "../types"

interface CarrierConnectionsTableProps {
  connections: CarrierConnectionItem[]
}

export function CarrierConnectionsTable({
  connections,
}: CarrierConnectionsTableProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="px-6 pt-5 pb-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          CARRIER CONNECTIONS
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-t border-b border-slate-200/80 bg-slate-50/50">
              <th className="py-3 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                CARRIER
              </th>
              <th className="py-3 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                CONNECTION
              </th>
              <th className="py-3 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                STATUS
              </th>
              <th className="py-3 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                ENABLED
              </th>
              <th className="py-3 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                LAST STATUS
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {connections.map((conn, idx) => (
              <tr
                key={`${conn.carrier}-${idx}`}
                className="hover:bg-slate-50/60 transition-colors"
              >
                <td className="py-3.5 px-6 text-sm font-semibold text-slate-800">
                  {conn.carrier}
                </td>
                <td className="py-3.5 px-6 text-sm text-slate-700">
                  {conn.connection}
                </td>
                <td className="py-3.5 px-6 text-sm text-slate-700">
                  {conn.status}
                </td>
                <td className="py-3.5 px-6 text-sm text-slate-700">
                  {conn.enabled}
                </td>
                <td className="py-3.5 px-6 text-sm text-slate-600 font-mono text-xs">
                  {conn.lastStatus}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
