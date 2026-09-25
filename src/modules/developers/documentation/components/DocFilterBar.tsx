import { Search } from "lucide-react"
import type { ApiTag } from "../types"

interface DocFilterBarProps {
  selectedTag: ApiTag
  setSelectedTag: (tag: ApiTag) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
}

const TAG_OPTIONS: ApiTag[] = [
  "All",
  "Messages",
  "Inbound MO",
  "USSD",
  "Sender IDs",
  "Webhooks",
  "Account",
]

export function DocFilterBar({
  selectedTag,
  setSelectedTag,
  searchQuery,
  setSearchQuery,
}: DocFilterBarProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-3">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter by endpoint path, method (e.g. POST, GET), or summary keyword..."
          className="w-full h-10 pl-9 pr-3.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#005944] focus:ring-1 focus:ring-[#005944]"
        />
        <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {/* Tag Badges */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {TAG_OPTIONS.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setSelectedTag(tag)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer select-none ${
              selectedTag === tag
                ? "bg-[#005944] text-white shadow-xs"
                : "bg-slate-100 hover:bg-slate-200/80 text-slate-600"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  )
}
