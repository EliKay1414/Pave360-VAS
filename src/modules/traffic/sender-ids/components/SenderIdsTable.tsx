import * as React from "react"

export interface SenderIdRecord {
  id: string
  senderHeader: string
  displayName: string
  type: "Alphanumeric" | "Shortcode" | "Longcode" | string
  status: "Approved" | "Pending" | "Rejected" | "Pending Carrier Review" | string
  country: string
  carriers?: string[]
  notes?: string
}

interface SenderIdsTableProps {
  senders: SenderIdRecord[]
  isLoading: boolean
  onEdit: (sender: SenderIdRecord) => void
  onDelete: (id: string) => void
}

export const SenderIdsTable: React.FC<SenderIdsTableProps> = ({
  senders,
  isLoading,
  onEdit,
  onDelete,
}) => {
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#eefaf3] text-[#059669] border border-[#a7f3d0]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
            Approved
          </span>
        )
      case "Pending":
      case "Pending Carrier Review":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            {status}
          </span>
        )
      case "Rejected":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
            Rejected
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
                SENDER HEADER
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                DISPLAY NAME
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                TYPE
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                STATUS
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                COUNTRY
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase text-right">
                ACTIONS
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
                    <div className="h-4 w-32 bg-slate-200 rounded" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-24 bg-slate-200 rounded" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-5 w-20 bg-slate-200 rounded-full" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-12 bg-slate-200 rounded" />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="h-4 w-16 bg-slate-200 rounded ml-auto" />
                  </td>
                </tr>
              ))
            ) : senders.length > 0 ? (
              senders.map((sender) => (
                <tr key={sender.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-semibold text-slate-900 text-sm">{sender.senderHeader}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-600 text-sm">
                    {sender.displayName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-600 text-sm">
                    {sender.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderStatusBadge(sender.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-600 text-sm">
                    {sender.country}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => onEdit(sender)}
                        className="text-[#046a56] font-semibold hover:underline cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(sender.id)}
                        className="text-[#dc2626] font-semibold hover:underline cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-slate-400 text-sm">
                  No Sender IDs registered yet. Click &quot;Register sender&quot; to add one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
