import * as React from "react"
import { ChevronDown, Search } from "lucide-react"
import { HTTP_METHODS_OPTIONS, HTTP_STATUS_OPTIONS } from "../types"

interface LogsFilterBarProps {
  selectedMethod: string
  setSelectedMethod: (val: string) => void
  selectedStatus: string
  setSelectedStatus: (val: string) => void
  apiPath: string
  setApiPath: (val: string) => void
  selectedTenant: string
  setSelectedTenant: (val: string) => void
  searchTerm: string
  setSearchTerm: (val: string) => void
  onFilter?: () => void
}

export function LogsFilterBar({
  selectedMethod,
  setSelectedMethod,
  selectedStatus,
  setSelectedStatus,
  apiPath,
  setApiPath,
  selectedTenant,
  setSelectedTenant,
  searchTerm,
  setSearchTerm,
  onFilter,
}: LogsFilterBarProps) {
  const [isMethodOpen, setIsMethodOpen] = React.useState(false)
  const [isStatusOpen, setIsStatusOpen] = React.useState(false)

  const methodDropdownRef = React.useRef<HTMLDivElement>(null)
  const statusDropdownRef = React.useRef<HTMLDivElement>(null)

  // Close dropdowns on click outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        methodDropdownRef.current &&
        !methodDropdownRef.current.contains(e.target as Node)
      ) {
        setIsMethodOpen(false)
      }
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(e.target as Node)
      ) {
        setIsStatusOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] relative z-20">
      <div className="flex flex-wrap items-end gap-3 sm:gap-3.5">
        {/* 1. HTTP Method dropdown */}
        <div className="space-y-1.5 relative" ref={methodDropdownRef}>
          <label className="block text-xs font-semibold text-slate-700">
            HTTP Method
          </label>
          <button
            type="button"
            onClick={() => {
              setIsMethodOpen((prev) => !prev)
              setIsStatusOpen(false)
            }}
            className={`h-9.5 px-3 min-w-36.25 flex items-center justify-between gap-3 text-xs rounded-lg border bg-white text-slate-800 cursor-pointer select-none transition-colors ${
              isMethodOpen
                ? "border-[#005944] ring-1 ring-[#005944]"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <span className="font-normal truncate">{selectedMethod}</span>
            <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
          </button>

          {isMethodOpen && (
            <div className="absolute left-0 top-[calc(100%+4px)] w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in-50 duration-150">
              {HTTP_METHODS_OPTIONS.map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => {
                    setSelectedMethod(method)
                    setIsMethodOpen(false)
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs transition-colors cursor-pointer flex items-center justify-between ${
                    selectedMethod === method
                      ? "bg-slate-50 font-semibold text-[#005944]"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span>{method}</span>
                  {selectedMethod === method && (
                    <span className="h-1.5 w-1.5 rounded-full bg-[#005944]" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 2. HTTP Status dropdown */}
        <div className="space-y-1.5 relative" ref={statusDropdownRef}>
          <label className="block text-xs font-semibold text-slate-700">
            HTTP Status
          </label>
          <button
            type="button"
            onClick={() => {
              setIsStatusOpen((prev) => !prev)
              setIsMethodOpen(false)
            }}
            className={`h-9.5 px-3 min-w-38.75 flex items-center justify-between gap-3 text-xs rounded-lg border bg-white text-slate-800 cursor-pointer select-none transition-colors ${
              isStatusOpen
                ? "border-[#005944] ring-1 ring-[#005944]"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <span className="font-normal truncate">{selectedStatus}</span>
            <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
          </button>

          {isStatusOpen && (
            <div className="absolute left-0 top-[calc(100%+4px)] w-52 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-50 max-h-64 overflow-y-auto animate-in fade-in-50 duration-150">
              {HTTP_STATUS_OPTIONS.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => {
                    setSelectedStatus(status)
                    setIsStatusOpen(false)
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs transition-colors cursor-pointer flex items-center justify-between ${
                    selectedStatus === status
                      ? "bg-slate-50 font-semibold text-[#005944]"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span>{status}</span>
                  {selectedStatus === status && (
                    <span className="h-1.5 w-1.5 rounded-full bg-[#005944]" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 3. API Path Input */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700">
            API Path
          </label>
          <input
            type="text"
            value={apiPath}
            onChange={(e) => setApiPath(e.target.value)}
            placeholder="/api/v1/messages"
            className="h-9.5 px-3 text-xs font-mono rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-[#005944] min-w-38.75"
          />
        </div>

        {/* 4. Tenant Dropdown */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700">
            Tenant
          </label>
          <div className="relative">
            <select
              value={selectedTenant}
              onChange={(e) => setSelectedTenant(e.target.value)}
              className="h-9.5 px-3 pr-8 text-xs rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-[#005944] min-w-32.5 cursor-pointer appearance-none"
            >
              <option value="All Tenants">All Tenants</option>
              <option value="Pave360">Pave360</option>
            </select>
            <ChevronDown className="h-4 w-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* 5. Search Term Input */}
        <div className="space-y-1.5 flex-1 min-w-47.5">
          <label className="block text-xs font-semibold text-slate-700">
            Search Term
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search IP, API Key, payload, reason..."
              className="h-9.5 w-full pl-9 pr-3 text-xs rounded-lg border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#005944]"
            />
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* 6. Filter Action Button */}
        <button
          type="button"
          onClick={onFilter}
          className="h-9.5 px-5 bg-[#005944] hover:bg-[#004837] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
        >
          <Search className="h-3.5 w-3.5" />
          <span>Filter</span>
        </button>
      </div>
    </div>
  )
}
