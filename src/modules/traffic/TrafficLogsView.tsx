import * as React from "react"
import { MessageDetailView } from "./MessageDetailView"
import { useMessagingTraffic } from "../../shared/hooks/useMessagingTraffic"
import {
  MessageTrafficLog,
  STATUS_DROPDOWN_OPTIONS,
  CATEGORY_DROPDOWN_OPTIONS,
  STORAGE_KEY,
  INITIAL_LOGS,
  TrafficLogsFilter,
  TrafficLogsTable,
} from "./logs"

// Re-export types and dropdown options for external consumers & hooks
export type { MessageTrafficLog }
export { STATUS_DROPDOWN_OPTIONS, CATEGORY_DROPDOWN_OPTIONS }

export function TrafficLogsView() {
  const [cachedLogs] = React.useState<MessageTrafficLog[]>(() => {
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

  const [selectedMessage, setSelectedMessage] = React.useState<MessageTrafficLog | null>(() => {
    if (typeof window === "undefined") return null
    try {
      const params = new URLSearchParams(window.location.search)
      const idParam = params.get("messageId") || params.get("id")
      if (!idParam) return null
      return {
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
    } catch {
      return null
    }
  })

  const { logs: liveLogs, isLive, refetch } = useMessagingTraffic({
    status: statusFilter,
    category: categoryFilter,
    destination: submittedDestination || destinationFilter,
  })

  const logs = liveLogs && liveLogs.length > 0 ? liveLogs : cachedLogs

  // Direct reactive filter computation communicating with the table
  const filteredLogs = React.useMemo(() => {
    return logs.filter((log: MessageTrafficLog) => {
      if (statusFilter !== "All Statuses" && log.status.toLowerCase() !== statusFilter.toLowerCase()) {
        return false
      }
      if (categoryFilter !== "All Categories" && log.category.toLowerCase() !== categoryFilter.toLowerCase()) {
        return false
      }
      const targetQuery = (submittedDestination || destinationFilter).trim()
      if (targetQuery && !log.to.includes(targetQuery)) {
        return false
      }
      return true
    })
  }, [logs, statusFilter, categoryFilter, destinationFilter, submittedDestination])

  const handleFilterSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setSubmittedDestination(destinationFilter.trim())
  }

  const handleLiveRefresh = async () => {
    setIsRefreshing(true)
    await refetch()
    setIsRefreshing(false)
  }

  // URL query param synchronization for deep linking
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const idParam = params.get("messageId") || params.get("id")
    if (idParam && !selectedMessage) {
      const found = logs.find((l: MessageTrafficLog) => l.id === idParam)
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
    }
  }, [logs])

  // Handle browser back/forward buttons
  React.useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search)
      const idParam = params.get("messageId") || params.get("id")
      if (idParam) {
        const found = logs.find((l: MessageTrafficLog) => l.id === idParam)
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

  if (selectedMessage) {
    return <MessageDetailView message={selectedMessage} onBack={handleBackFromDetail} />
  }

  return (
    <div className="space-y-5 font-sans select-none pb-8">
      {/* 1. Subheader: Page Description */}
      <p className="text-[13.5px] text-[#5b6e82] font-normal leading-normal pt-1">
        Real-time message traffic inspection, protocol encoding, and routing status
      </p>

      {/* 2. Top Controls & Filter Bar */}
      <TrafficLogsFilter
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        destinationFilter={destinationFilter}
        setDestinationFilter={(val) => {
          setDestinationFilter(val)
          setSubmittedDestination(val.trim())
        }}
        onFilterSubmit={handleFilterSubmit}
        isLive={isLive}
        isRefreshing={isRefreshing}
        onLiveRefresh={handleLiveRefresh}
      />

      {/* 3. Traffic Logs Data Table Card */}
      <TrafficLogsTable logs={filteredLogs} onSelectMessage={handleOpenMessage} />
    </div>
  )
}

export const VasTrafficLogsView = TrafficLogsView
export default TrafficLogsView
