import * as React from "react"
import { Search, RotateCw, X } from "lucide-react"
import { MessageDetailView } from "./MessageDetailView"
import { resolveMessageRecord } from "./messageData"

export interface MessageTrafficLog {
  id: string
  category: "Normal" | "Transactional" | "Promotional" | "Customized" | "Bulk" | "Scheduled" | string
  from: string
  to: string
  status: "Queued" | "Submitted" | "Accepted" | "Delivered" | "Failed" | string
  encoding: string
  segments: number
  carrier: string
  createdUtc: string
  errorReason?: string
}

const STORAGE_KEY = "pave360_vas_traffic_logs"

/**
 * Exact order from user screenshot media_1790340378114.png
 */
export const STATUS_DROPDOWN_OPTIONS = [
  "All Statuses",
  "Queued",
  "Submitted",
  "Accepted",
  "Delivered",
  "Failed",
] as const

/**
 * Exact order from user screenshot media_1790340385528.png
 */
export const CATEGORY_DROPDOWN_OPTIONS = [
  "All Categories",
  "Normal",
  "Transactional",
  "Promotional",
  "Customized",
  "Bulk",
  "Scheduled",
] as const

const INITIAL_LOGS: MessageTrafficLog[] = [
  // 1. Initial items from screenshots
  {
    id: "msg_3deeccdfe8f944f2",
    category: "Normal",
    from: "Pave360",
    to: "233248985021",
    status: "Failed",
    encoding: "Gsm7",
    segments: 1,
    carrier: "AT Ghana SMSC",
    createdUtc: "2026-09-25 11:55:28Z",
    errorReason: "ESME_ROUTING_DEST_UNREACHABLE (404)",
  },
  {
    id: "msg_5c10ee3518774ad7",
    category: "Normal",
    from: "Pave360",
    to: "233248985021",
    status: "Delivered",
    encoding: "Gsm7",
    segments: 1,
    carrier: "AT Ghana SMSC",
    createdUtc: "2026-09-24 13:28:51Z",
  },
  {
    id: "msg_a2c621cb0ce14480",
    category: "Normal",
    from: "Pave360",
    to: "233248985021",
    status: "Delivered",
    encoding: "Gsm7",
    segments: 1,
    carrier: "AT Ghana SMSC",
    createdUtc: "2026-09-24 13:17:17Z",
  },
  {
    id: "msg_5c6bc185992b4ed9",
    category: "Normal",
    from: "Pave360",
    to: "233248985021",
    status: "Delivered",
    encoding: "Gsm7",
    segments: 1,
    carrier: "AT Ghana SMSC",
    createdUtc: "2026-09-23 01:04:25Z",
  },
  {
    id: "msg_98f608ceca5143ae",
    category: "Normal",
    from: "Pave360",
    to: "233248985021",
    status: "Delivered",
    encoding: "Gsm7",
    segments: 1,
    carrier: "AT Ghana SMSC",
    createdUtc: "2026-09-23 00:21:55Z",
  },
  {
    id: "msg_00621478c58b4590",
    category: "Normal",
    from: "Pave360",
    to: "233248985021",
    status: "Delivered",
    encoding: "Gsm7",
    segments: 1,
    carrier: "AT Ghana SMSC",
    createdUtc: "2026-09-23 00:21:33Z",
  },
  {
    id: "msg_ec70f5f3770d41aa",
    category: "Normal",
    from: "Pave360",
    to: "233248985021",
    status: "Delivered",
    encoding: "Gsm7",
    segments: 1,
    carrier: "AT Ghana SMSC",
    createdUtc: "2026-09-22 11:55:40Z",
  },
  {
    id: "msg_8d15fd56f5a94dde",
    category: "Normal",
    from: "Pave360",
    to: "233248985021",
    status: "Delivered",
    encoding: "Gsm7",
    segments: 1,
    carrier: "AT Ghana SMSC",
    createdUtc: "2026-09-22 11:55:30Z",
  },
  {
    id: "msg_7906f186a8734cce",
    category: "Normal",
    from: "Pave360",
    to: "233248985021",
    status: "Delivered",
    encoding: "Gsm7",
    segments: 1,
    carrier: "AT Ghana SMSC",
    createdUtc: "2026-09-22 11:55:13Z",
  },
  {
    id: "msg_e32a6069a2374c8d",
    category: "Normal",
    from: "Pave360",
    to: "233248985021",
    status: "Delivered",
    encoding: "Gsm7",
    segments: 1,
    carrier: "AT Ghana SMSC",
    createdUtc: "2026-09-22 11:54:59Z",
  },
  {
    id: "msg_7ad55daa3d244a4b",
    category: "Normal",
    from: "Pave360",
    to: "233248985021",
    status: "Delivered",
    encoding: "Gsm7",
    segments: 1,
    carrier: "AT Ghana SMSC",
    createdUtc: "2026-09-22 11:49:49Z",
  },
  {
    id: "msg_4d3ace1560764877",
    category: "Normal",
    from: "Pave360",
    to: "233248985021",
    status: "Delivered",
    encoding: "Gsm7",
    segments: 1,
    carrier: "AT Ghana SMSC",
    createdUtc: "2026-09-22 11:49:11Z",
  },
  {
    id: "msg_3145cd9edb3b46ec",
    category: "Normal",
    from: "Pave360",
    to: "233248985021",
    status: "Delivered",
    encoding: "Gsm7",
    segments: 1,
    carrier: "AT Ghana SMSC",
    createdUtc: "2026-09-22 11:39:26Z",
  },
  {
    id: "msg_c2e4db3467e7400d",
    category: "Normal",
    from: "Pave360",
    to: "233246219871",
    status: "Delivered",
    encoding: "Gsm7",
    segments: 1,
    carrier: "AT Ghana SMSC",
    createdUtc: "2026-09-22 11:37:40Z",
  },
  {
    id: "msg_6fd1b667c1ce4bee",
    category: "Normal",
    from: "Pave360",
    to: "233267342160",
    status: "Delivered",
    encoding: "Gsm7",
    segments: 1,
    carrier: "AT Ghana SMSC",
    createdUtc: "2026-09-22 11:19:46Z",
  },
  {
    id: "msg_6437a53e536e439b",
    category: "Normal",
    from: "Pave360",
    to: "233241234567",
    status: "Failed",
    encoding: "Gsm7",
    segments: 1,
    carrier: "AT Ghana SMSC",
    createdUtc: "2026-09-22 11:17:19Z",
    errorReason: "SUBSCRIBER_ABSENT_TIMEOUT",
  },
  {
    id: "msg_5b3ff57222444b2e",
    category: "Normal",
    from: "Pave360",
    to: "233241234567",
    status: "Failed",
    encoding: "Gsm7",
    segments: 1,
    carrier: "AT Ghana SMSC",
    createdUtc: "2026-09-22 10:33:38Z",
    errorReason: "CALL_BARRED_BY_OPERATOR",
  },
  {
    id: "msg_bed605ce720348d7",
    category: "Normal",
    from: "Pave360",
    to: "233267342160",
    status: "Failed",
    encoding: "Gsm7",
    segments: 1,
    carrier: "—",
    createdUtc: "2026-09-22 00:05:23Z",
    errorReason: "NO_ACTIVE_CARRIER_ROUTE_MATCHED",
  },
  {
    id: "msg_b32535b7beab4422",
    category: "Normal",
    from: "Pave360",
    to: "233267342160",
    status: "Failed",
    encoding: "Gsm7",
    segments: 1,
    carrier: "—",
    createdUtc: "2026-09-22 00:02:48Z",
    errorReason: "NO_ACTIVE_CARRIER_ROUTE_MATCHED",
  },
  {
    id: "msg_193ed621719047e3",
    category: "Normal",
    from: "Pave360",
    to: "233267342160",
    status: "Failed",
    encoding: "Gsm7",
    segments: 1,
    carrier: "—",
    createdUtc: "2026-09-21 23:57:31Z",
    errorReason: "RATE_LIMIT_EXCEEDED",
  },
  {
    id: "msg_ee78e0315b9e40ac",
    category: "Normal",
    from: "Pave360",
    to: "233267342160",
    status: "Failed",
    encoding: "Gsm7",
    segments: 1,
    carrier: "—",
    createdUtc: "2026-09-21 23:55:07Z",
    errorReason: "PREFIX_REJECTED",
  },

  // 2. Additional items supporting all Statuses (Queued, Submitted, Accepted)
  // and Categories (Transactional, Promotional, Customized, Bulk, Scheduled)
  {
    id: "msg_9c41eb89a42111fe",
    category: "Transactional",
    from: "Pave360",
    to: "233244981122",
    status: "Accepted",
    encoding: "Gsm7",
    segments: 1,
    carrier: "MTN Ghana SMSC",
    createdUtc: "2026-09-25 12:45:10Z",
  },
  {
    id: "msg_88fe2109ba431100",
    category: "Transactional",
    from: "Pave360",
    to: "233501238899",
    status: "Submitted",
    encoding: "Gsm7",
    segments: 1,
    carrier: "Telecel Ghana Core",
    createdUtc: "2026-09-25 12:44:50Z",
  },
  {
    id: "msg_7721ba99ce112233",
    category: "Promotional",
    from: "Pave360",
    to: "233271100998",
    status: "Queued",
    encoding: "Gsm7",
    segments: 1,
    carrier: "AT Ghana SMSC",
    createdUtc: "2026-09-25 12:44:00Z",
  },
  {
    id: "msg_6619ab44cd556677",
    category: "Customized",
    from: "Pave360",
    to: "233208877665",
    status: "Accepted",
    encoding: "Gsm7",
    segments: 1,
    carrier: "Telecel Ghana Core",
    createdUtc: "2026-09-25 12:42:15Z",
  },
  {
    id: "msg_5508bc33de778899",
    category: "Bulk",
    from: "Pave360",
    to: "233249001122",
    status: "Submitted",
    encoding: "Gsm7",
    segments: 1,
    carrier: "MTN Ghana SMSC",
    createdUtc: "2026-09-25 12:40:02Z",
  },
  {
    id: "msg_4497cd22ef990011",
    category: "Scheduled",
    from: "Pave360",
    to: "233245667788",
    status: "Queued",
    encoding: "Gsm7",
    segments: 1,
    carrier: "AT Ghana SMSC",
    createdUtc: "2026-09-25 12:35:45Z",
  },
  {
    id: "msg_3386de11fa112233",
    category: "Scheduled",
    from: "Pave360",
    to: "233241122334",
    status: "Delivered",
    encoding: "Gsm7",
    segments: 1,
    carrier: "MTN Ghana SMSC",
    createdUtc: "2026-09-25 12:30:10Z",
  },
]

export function TrafficLogsView() {
  const [logs] = React.useState<MessageTrafficLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch {
      // Fallback
    }
    return INITIAL_LOGS
  })

  // Filters - Directly reactive to state changes
  const [statusFilter, setStatusFilter] = React.useState<string>("All Statuses")
  const [categoryFilter, setCategoryFilter] = React.useState<string>("All Categories")
  const [destinationFilter, setDestinationFilter] = React.useState<string>("")
  const [submittedDestination, setSubmittedDestination] = React.useState<string>("")

  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const [selectedMessage, setSelectedMessage] = React.useState<MessageTrafficLog | null>(null)

  // Direct reactive filter computation communicating with the table
  const filteredLogs = React.useMemo(() => {
    return logs.filter((log) => {
      // 1. Status Filter Check
      if (statusFilter !== "All Statuses") {
        if (log.status.toLowerCase() !== statusFilter.toLowerCase()) {
          return false
        }
      }

      // 2. Category Filter Check
      if (categoryFilter !== "All Categories") {
        if (log.category.toLowerCase() !== categoryFilter.toLowerCase()) {
          return false
        }
      }

      // 3. Destination Filter Check (reactive on typing or button click)
      const targetQuery = (submittedDestination || destinationFilter).trim()
      if (targetQuery && !log.to.includes(targetQuery)) {
        return false
      }

      return true
    })
  }, [logs, statusFilter, categoryFilter, destinationFilter, submittedDestination])

  // Filter submit handler
  const handleFilterSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setSubmittedDestination(destinationFilter.trim())
  }

  // Live Refresh handler
  const handleLiveRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 450)
  }

  // Status Badge Renderer matching screenshots
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "Delivered":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#eefaf3] text-[#059669] border border-[#a7f3d0]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
            Delivered
          </span>
        )
      case "Failed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#fef2f2] text-[#dc2626] border border-[#fecaca]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ef4444]" />
            Failed
          </span>
        )
      case "Accepted":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Accepted
          </span>
        )
      case "Submitted":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            Submitted
          </span>
        )
      case "Queued":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
            Queued
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

  // Check URL query param for direct message linking
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const idParam = params.get("messageId") || params.get("id")
    if (idParam) {
      const found = logs.find((l) => l.id === idParam)
      if (found) {
        setSelectedMessage(found)
      } else {
        setSelectedMessage({
          id: idParam,
          category: "Normal",
          from: "Pave360",
          to: "233248985021",
          status: "Delivered",
          encoding: "Gsm7",
          segments: 1,
          carrier: "AT Ghana SMSC",
          createdUtc: "2026-09-24 13:28:51Z",
        })
      }
    }
  }, [logs])

  // Handle browser back/forward buttons
  React.useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search)
      const idParam = params.get("messageId") || params.get("id")
      if (idParam) {
        const found = logs.find((l) => l.id === idParam)
        setSelectedMessage(
          found || {
            id: idParam,
            category: "Normal",
            from: "Pave360",
            to: "233248985021",
            status: "Delivered",
            encoding: "Gsm7",
            segments: 1,
            carrier: "AT Ghana SMSC",
            createdUtc: "2026-09-24 13:28:51Z",
          }
        )
      } else {
        setSelectedMessage(null)
      }
    }
    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [logs])

  const handleOpenMessage = (log: MessageTrafficLog) => {
    setSelectedMessage(log)
    const url = new URL(window.location.href)
    url.searchParams.set("messageId", log.id)
    window.history.pushState({}, "", url.toString())
  }

  const handleBackFromDetail = () => {
    setSelectedMessage(null)
    const url = new URL(window.location.href)
    url.searchParams.delete("messageId")
    url.searchParams.delete("id")
    window.history.pushState({}, "", url.pathname + (url.search ? url.search : ""))
  }

  // If a message is selected, render the dedicated MessageDetailView matching the screenshots
  if (selectedMessage) {
    return (
      <MessageDetailView
        message={selectedMessage}
        onBack={handleBackFromDetail}
      />
    )
  }

  return (
    <div className="space-y-5 font-sans select-none pb-8">
      {/* 1. Subheader: Page Description */}
      <p className="text-[13.5px] text-[#5b6e82] font-normal leading-normal pt-1">
        Real-time message traffic inspection, protocol encoding, and routing status
      </p>

      {/* 2. Top Controls & Filter Bar: Reactive Dropdowns and Live Filtering */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pt-1">
        {/* Left Side: Filter Form */}
        <form onSubmit={handleFilterSubmit} className="flex flex-wrap items-end gap-3">
          {/* Status Select: In exact order from media_1790340378114.png */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="filter-status">
              Status
            </label>
            <select
              id="filter-status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-[#005944] text-slate-900 cursor-pointer min-w-35"
            >
              {STATUS_DROPDOWN_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Category Select: In exact order from media_1790340385528.png */}
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
              onChange={(e) => {
                setDestinationFilter(e.target.value)
                setSubmittedDestination(e.target.value.trim())
              }}
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

        {/* Right Side: Live Refresh Button */}
        <button
          type="button"
          onClick={handleLiveRefresh}
          disabled={isRefreshing}
          className="h-10 px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-[13px] font-semibold rounded-lg shadow-xs transition-colors cursor-pointer inline-flex items-center gap-2 shrink-0 self-start lg:self-auto disabled:opacity-60"
        >
          <RotateCw className={`h-3.5 w-3.5 text-slate-600 ${isRefreshing ? "animate-spin" : ""}`} />
          <span>Live Refresh</span>
        </button>
      </div>

      {/* 3. Traffic Logs Data Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden mt-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-white">
                <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                  MESSAGE ID
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                  CATEGORY
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                  FROM
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                  TO
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                  STATUS
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                  ENCODING
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                  CARRIER
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase text-right">
                  CREATED (UTC)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Message ID */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleOpenMessage(log)}
                        className="font-mono text-xs font-semibold text-[#0070f3] hover:underline cursor-pointer text-left"
                      >
                        {log.id}
                      </button>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                        {log.category}
                      </span>
                    </td>

                    {/* From */}
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900 text-sm">
                      {log.from}
                    </td>

                    {/* To */}
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-slate-700">
                      {log.to}
                    </td>

                    {/* Status with dynamic badge */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderStatusBadge(log.status)}
                    </td>

                    {/* Encoding */}
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-600">
                      {log.encoding} · {log.segments} seg
                    </td>

                    {/* Carrier */}
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-slate-800">
                      {log.carrier}
                    </td>

                    {/* Created (UTC) */}
                    <td className="px-6 py-4 whitespace-nowrap text-right font-mono text-xs text-slate-600">
                      {log.createdUtc}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-400 text-sm">
                    No message logs found matching your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 4. Table Pagination / Record Count Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-white flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing page 1 · {filteredLogs.length} total records
          </span>
        </div>
      </div>
    </div>
  )
}

export const VasTrafficLogsView = TrafficLogsView
export default TrafficLogsView
