import * as React from "react"
import { ChevronDown, Search, RotateCcw } from "lucide-react"
import { DateTimePicker } from "../../DateTimePicker"
import { TRANSACTION_TYPE_OPTIONS } from "../types"

interface ReportsFilterBarProps {
  fromDate: string
  setFromDate: (val: string) => void
  toDate: string
  setToDate: (val: string) => void
  selectedTenant: string
  setSelectedTenant: (val: string) => void
  selectedType: string
  setSelectedType: (val: string) => void
  onApplyFilter: () => void
  onResetFilter: () => void
}

export function ReportsFilterBar({
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  selectedTenant,
  setSelectedTenant,
  selectedType,
  setSelectedType,
  onApplyFilter,
  onResetFilter,
}: ReportsFilterBarProps) {
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = React.useState(false)
  const typeDropdownRef = React.useRef<HTMLDivElement>(null)

  // Close type dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        typeDropdownRef.current &&
        !typeDropdownRef.current.contains(e.target as Node)
      ) {
        setIsTypeDropdownOpen(false)
      }
    }
    if (isTypeDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isTypeDropdownOpen])

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] relative z-20">
      <div className="flex flex-wrap items-end gap-3 sm:gap-4">
        {/* From (UTC) using exact shadcn calendar component */}
        <DateTimePicker
          label="From (UTC)"
          value={fromDate}
          onChange={setFromDate}
        />

        {/* To (UTC) using exact shadcn calendar component */}
        <DateTimePicker
          label="To (UTC)"
          value={toDate}
          onChange={setToDate}
        />

        {/* Tenant */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700">
            Tenant
          </label>
          <div className="relative">
            <select
              value={selectedTenant}
              onChange={(e) => setSelectedTenant(e.target.value)}
              className="h-9.5 px-3 pr-8 text-xs rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-[#005944] min-w-31.25 cursor-pointer appearance-none"
            >
              <option value="All Tenants">All Tenants</option>
              <option value="Pave360">Pave360</option>
            </select>
            <ChevronDown className="h-4 w-4 text-slate-700 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 stroke-[2.2]" />
          </div>
        </div>

        {/* Transaction Type: Exact custom dropdown matching media_1790351962677.png */}
        <div className="space-y-1.5 relative" ref={typeDropdownRef}>
          <label className="block text-xs font-semibold text-slate-700">
            Transaction Type
          </label>

          {/* Trigger Button */}
          <button
            type="button"
            onClick={() => setIsTypeDropdownOpen((prev) => !prev)}
            className={`h-9.5 px-3 min-w-38.75 flex items-center justify-between gap-3 text-xs rounded-lg border bg-white text-slate-800 cursor-pointer select-none transition-colors ${
              isTypeDropdownOpen
                ? "border-[#005944] ring-1 ring-[#005944]"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <span className="font-normal truncate">{selectedType}</span>
            <ChevronDown className="h-4 w-4 text-slate-700 stroke-[2.2] shrink-0" />
          </button>

          {/* Dropdown Menu matching media_1790351962677.png */}
          {isTypeDropdownOpen && (
            <div className="absolute left-0 top-[calc(100%+4px)] w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in-50 duration-150">
              {TRANSACTION_TYPE_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setSelectedType(option)
                    setIsTypeDropdownOpen(false)
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs transition-colors cursor-pointer flex items-center justify-between ${
                    selectedType === option
                      ? "bg-slate-50 font-semibold text-[#005944]"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span>{option}</span>
                  {selectedType === option && (
                    <span className="h-1.5 w-1.5 rounded-full bg-[#005944]" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Filter Action Button */}
        <button
          type="button"
          onClick={onApplyFilter}
          className="h-9.5 px-5 bg-[#005944] hover:bg-[#004837] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
        >
          <Search className="h-3.5 w-3.5" />
          <span>Filter</span>
        </button>

        {/* Reset Action Button */}
        <button
          type="button"
          onClick={onResetFilter}
          className="h-9.5 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-lg shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
        >
          <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  )
}
