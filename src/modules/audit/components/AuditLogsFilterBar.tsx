import { useState, useRef } from "react"
import { Search, Calendar as CalendarIcon } from "lucide-react"
import type { AuditLogFilters } from "../types"

interface AuditLogsFilterBarProps {
  filters: AuditLogFilters
  onFilterChange: (filters: AuditLogFilters) => void
  onSearch: () => void
}

export function AuditLogsFilterBar({
  filters,
  onFilterChange,
  onSearch,
}: AuditLogsFilterBarProps) {
  const dateInputRef = useRef<HTMLInputElement>(null)
  const [localFilters, setLocalFilters] = useState<AuditLogFilters>(filters)

  const handleChange = (field: keyof AuditLogFilters, value: string) => {
    const updated = { ...localFilters, [field]: value }
    setLocalFilters(updated)
    onFilterChange(updated)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch()
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end"
      >
        {/* Action */}
        <div className="lg:col-span-3">
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Action
          </label>
          <input
            type="text"
            placeholder="e.g. auth.login, route.created"
            value={localFilters.action}
            onChange={(e) => handleChange("action", e.target.value)}
            className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#005743] focus:ring-1 focus:ring-[#005743] transition-colors"
          />
        </div>

        {/* Entity Type */}
        <div className="lg:col-span-3">
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Entity Type
          </label>
          <input
            type="text"
            placeholder="e.g. User, Carrier, Route"
            value={localFilters.entityType}
            onChange={(e) => handleChange("entityType", e.target.value)}
            className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#005743] focus:ring-1 focus:ring-[#005743] transition-colors"
          />
        </div>

        {/* User Email */}
        <div className="lg:col-span-3">
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            User Email
          </label>
          <input
            type="text"
            placeholder="e.g. admin@pave360.com"
            value={localFilters.userEmail}
            onChange={(e) => handleChange("userEmail", e.target.value)}
            className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#005743] focus:ring-1 focus:ring-[#005743] transition-colors"
          />
        </div>

        {/* From Date with Calendar Picker Icon */}
        <div className="lg:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            From Date
          </label>
          <div className="relative">
            <input
              ref={dateInputRef}
              type="text"
              placeholder="mm/dd/yyyy --:-- --"
              value={localFilters.fromDate}
              onChange={(e) => handleChange("fromDate", e.target.value)}
              onFocus={(e) => {
                e.target.type = "datetime-local"
              }}
              onBlur={(e) => {
                if (!e.target.value) {
                  e.target.type = "text"
                }
              }}
              className="w-full h-10 pl-3 pr-8 rounded-lg border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#005743] focus:ring-1 focus:ring-[#005743] transition-colors cursor-pointer"
            />
            <button
              type="button"
              onClick={() => {
                if (dateInputRef.current) {
                  dateInputRef.current.type = "datetime-local"
                  dateInputRef.current.showPicker?.()
                  dateInputRef.current.focus()
                }
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <CalendarIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search Button */}
        <div className="lg:col-span-1">
          <button
            type="submit"
            className="w-full h-10 px-4 bg-[#005743] hover:bg-[#004737] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search</span>
          </button>
        </div>
      </form>
    </div>
  )
}
