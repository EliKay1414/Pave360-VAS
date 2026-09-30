import * as React from "react"
import { DLR_STATUS_OPTIONS } from "../types"

interface DeliveryReportsFilterProps {
  statusFilter: string
  onStatusChange: (status: string) => void
  idFilter: string
  onIdChange: (id: string) => void
  onSubmit: (e: React.FormEvent) => void
}

export const DeliveryReportsFilter: React.FC<DeliveryReportsFilterProps> = ({
  statusFilter,
  onStatusChange,
  idFilter,
  onIdChange,
  onSubmit,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] mt-3">
      <form onSubmit={onSubmit} className="flex flex-col sm:flex-row items-end gap-3">
        {/* Status Select */}
        <div className="w-full sm:w-auto">
          <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="dlr-status">
            Status
          </label>
          <select
            id="dlr-status"
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full sm:w-auto min-w-50 h-10 px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-[#005944] text-slate-900 cursor-pointer"
          >
            {DLR_STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Message or carrier ID Input */}
        <div className="w-full flex-1">
          <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="dlr-search-id">
            Message or carrier ID
          </label>
          <input
            id="dlr-search-id"
            type="text"
            placeholder="msg_... or sim_..."
            value={idFilter}
            onChange={(e) => onIdChange(e.target.value)}
            className="w-full h-10 px-3.5 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-[#005944] placeholder:text-slate-400 text-slate-900"
          />
        </div>

        {/* Filter Button */}
        <button
          type="submit"
          className="w-full sm:w-auto h-10 px-6 py-2 bg-[#005944] hover:bg-[#004837] text-white text-sm font-semibold rounded-lg shadow-xs transition-colors cursor-pointer shrink-0"
        >
          Filter
        </button>
      </form>
    </div>
  )
}
