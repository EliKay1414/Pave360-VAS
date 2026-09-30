import * as React from "react"
import { Search, RotateCw } from "lucide-react"
import { STATUS_DROPDOWN_OPTIONS, CATEGORY_DROPDOWN_OPTIONS } from "../types"

interface TrafficLogsFilterProps {
  statusFilter: string
  setStatusFilter: (val: string) => void
  categoryFilter: string
  setCategoryFilter: (val: string) => void
  destinationFilter: string
  setDestinationFilter: (val: string) => void
  onFilterSubmit: (e?: React.FormEvent) => void
  isLive: boolean
  isRefreshing: boolean
  onLiveRefresh: () => void
}

export function TrafficLogsFilter({
  statusFilter,
  setStatusFilter,
  categoryFilter,
  setCategoryFilter,
  destinationFilter,
  setDestinationFilter,
  onFilterSubmit,
  isLive,
  isRefreshing,
  onLiveRefresh,
}: TrafficLogsFilterProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pt-1">
      {/* Left Side: Filter Form */}
      <form onSubmit={onFilterSubmit} className="flex flex-wrap items-end gap-3">
        {/* Status Select */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="filter-status">
            Status
          </label>
          <select
            id="filter-status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-[#005944] text-slate-900 cursor-pointer min-w-37.5"
          >
            {STATUS_DROPDOWN_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Category Select */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="filter-category">
            Category
          </label>
          <select
            id="filter-category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-10 px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-[#005944] text-slate-900 cursor-pointer min-w-37.5"
          >
            {CATEGORY_DROPDOWN_OPTIONS.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Destination Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="filter-destination">
            Destination
          </label>
          <input
            id="filter-destination"
            type="text"
            placeholder="e.g. 23324..."
            value={destinationFilter}
            onChange={(e) => setDestinationFilter(e.target.value)}
            className="h-10 px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-[#005944] placeholder:text-slate-400 text-slate-900 min-w-37.5"
          />
        </div>

        {/* Filter Logs Button */}
        <button
          type="submit"
          className="h-10 px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-[13px] font-semibold rounded-lg shadow-xs transition-colors cursor-pointer inline-flex items-center gap-2"
        >
          <Search className="h-4 w-4 text-slate-500" />
          <span>Filter Logs</span>
        </button>
      </form>

      {/* Right Side: Live Refresh Button & Status Badge */}
      <div className="flex items-center gap-2 shrink-0 self-start lg:self-auto">
        {isLive ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Gateway
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-50 text-slate-600 border border-slate-200">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
            Cache
          </span>
        )}
        <button
          type="button"
          onClick={onLiveRefresh}
          disabled={isRefreshing}
          className="h-10 px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-[13px] font-semibold rounded-lg shadow-xs transition-colors cursor-pointer inline-flex items-center gap-2 disabled:opacity-60"
        >
          <RotateCw className={`h-3.5 w-3.5 text-slate-600 ${isRefreshing ? "animate-spin" : ""}`} />
          <span>Live Refresh</span>
        </button>
      </div>
    </div>
  )
}
