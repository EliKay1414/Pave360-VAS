import * as React from "react"

export interface UssdSessionRecord {
  id: string
  kind: "USSN" | "USSR" | "USSD" | string
  msisdn: string
  starCode: string
  status: "Delivered" | "Sent" | "Failed" | "Active" | "Completed" | string
  text: string
  when: string
  ackRequested?: boolean
  cost?: string
}

interface UssdSessionsTableProps {
  sessions: UssdSessionRecord[]
  isLoading: boolean
  onSelectSession: (session: UssdSessionRecord) => void
}

export const UssdSessionsTable: React.FC<UssdSessionsTableProps> = ({
  sessions,
  isLoading,
  onSelectSession,
}) => {
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "Delivered":
      case "Completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#eefaf3] text-[#059669] border border-[#a7f3d0]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
            {status}
          </span>
        )
      case "Sent":
      case "Active":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            {status}
          </span>
        )
      case "Failed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
            Failed
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
            {status}
          </span>
        )
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-white">
              <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                SESSION ID
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                KIND
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                MSISDN
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                SERVICE CODE
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                STATUS
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                PAYLOAD TEXT
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase text-right">
                TIMESTAMP
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              // Clean Skeleton rows - Prevents flash of mock content
              Array.from({ length: 4 }).map((_, idx) => (
                <tr key={`skeleton-${idx}`} className="animate-pulse">
                  <td className="px-6 py-4">
                    <div className="h-4 w-28 bg-slate-200 rounded" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-14 bg-slate-200 rounded" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-24 bg-slate-200 rounded" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-16 bg-slate-200 rounded" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-5 w-20 bg-slate-200 rounded-full" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-40 bg-slate-200 rounded" />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="h-4 w-24 bg-slate-200 rounded ml-auto" />
                  </td>
                </tr>
              ))
            ) : sessions.length > 0 ? (
              sessions.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => onSelectSession(item)}
                  className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-[#046a56] font-semibold">
                    {item.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      {item.kind}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-800 font-medium">
                    {item.msisdn}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-slate-600">
                    {item.starCode}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderStatusBadge(item.status)}
                  </td>
                  <td className="px-6 py-4 max-w-xs truncate text-slate-600">
                    {item.text}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-xs text-slate-500">
                    {item.when}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-slate-400 text-sm">
                  No USSD sessions recorded. Click &quot;Send USSD notify&quot; to dispatch an alert.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
