import type { AlertFilter } from "../types"
import { ALERT_FILTERS } from "../mockData"

interface AlertFilterTabsProps {
  currentFilter: AlertFilter
  onFilterChange: (filter: AlertFilter) => void
}

export function AlertFilterTabs({
  currentFilter,
  onFilterChange,
}: AlertFilterTabsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 pt-1">
      {ALERT_FILTERS.map((tab) => {
        const isActive = currentFilter === tab.id
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onFilterChange(tab.id)}
            className={`h-9 px-4 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              isActive
                ? "bg-white border border-slate-300/90 text-slate-900 shadow-xs font-bold ring-1 ring-slate-900/5"
                : "bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-2xs"
            }`}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
