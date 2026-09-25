import * as React from "react"
import {
  INITIAL_API_LOGS,
  LogsHeaderBanner,
  LogsMetricsCards,
  LogsFilterBar,
  LogsTable,
  LogInspectDrawer,
  type ApiLogRecord,
} from "./logs"

// Re-export all types & helper utilities for backward compatibility
export * from "./logs/types"

export function DeveloperLogsView() {
  const [logs] = React.useState<ApiLogRecord[]>(INITIAL_API_LOGS)

  // Filters state
  const [selectedMethod, setSelectedMethod] = React.useState<string>("All Methods")
  const [selectedStatus, setSelectedStatus] = React.useState<string>("All Statuses")
  const [apiPath, setApiPath] = React.useState<string>("/api/v1/messages")
  const [selectedTenant, setSelectedTenant] = React.useState<string>("All Tenants")
  const [searchTerm, setSearchTerm] = React.useState<string>("")

  // Refresh spinner state
  const [isRefreshing, setIsRefreshing] = React.useState(false)

  // Inspector Drawer state
  const [inspectedLog, setInspectedLog] = React.useState<ApiLogRecord | null>(null)

  // Filter logs reactively based on user selections
  const filteredLogs = React.useMemo(() => {
    return logs.filter((log) => {
      // 1. Method filter
      if (selectedMethod !== "All Methods" && log.method !== selectedMethod) {
        return false
      }

      // 2. Status filter
      if (selectedStatus === "2xx Success") {
        if (log.status < 200 || log.status >= 300) return false
      } else if (selectedStatus === "4xx Client Error") {
        if (log.status < 400 || log.status >= 500) return false
      } else if (selectedStatus === "5xx Server Error") {
        if (log.status < 500) return false
      } else if (selectedStatus === "200 OK") {
        if (log.status !== 200) return false
      } else if (selectedStatus === "400 Bad Request") {
        if (log.status !== 400) return false
      } else if (selectedStatus === "401 Unauthorized") {
        if (log.status !== 401) return false
      } else if (selectedStatus === "404 Not Found") {
        if (log.status !== 404) return false
      } else if (selectedStatus === "429 Rate Limit") {
        if (log.status !== 429) return false
      } else if (selectedStatus === "500 Server Error") {
        if (log.status !== 500) return false
      }

      // 3. Path filter
      if (apiPath.trim()) {
        const cleanPath = apiPath.trim().toLowerCase()
        if (!log.path.toLowerCase().includes(cleanPath)) return false
      }

      // 4. Tenant filter
      if (selectedTenant !== "All Tenants" && log.tenant !== selectedTenant) {
        return false
      }

      // 5. Search term filter
      if (searchTerm.trim()) {
        const term = searchTerm.trim().toLowerCase()
        const match =
          log.path.toLowerCase().includes(term) ||
          log.clientIp.toLowerCase().includes(term) ||
          log.tenant.toLowerCase().includes(term) ||
          log.apiKey.toLowerCase().includes(term) ||
          (log.errorReason && log.errorReason.toLowerCase().includes(term)) ||
          (log.requestBody && log.requestBody.toLowerCase().includes(term)) ||
          (log.responseBody && log.responseBody.toLowerCase().includes(term))
        if (!match) return false
      }

      return true
    })
  }, [logs, selectedMethod, selectedStatus, apiPath, selectedTenant, searchTerm])

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 400)
  }

  return (
    <div className="space-y-4 font-sans select-none pb-12">
      {/* 1. Top Banner Card */}
      <LogsHeaderBanner
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
      />

      {/* 2. Four Telemetry / Metric Cards */}
      <LogsMetricsCards />

      {/* 3. Filter Bar */}
      <LogsFilterBar
        selectedMethod={selectedMethod}
        setSelectedMethod={setSelectedMethod}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        apiPath={apiPath}
        setApiPath={setApiPath}
        selectedTenant={selectedTenant}
        setSelectedTenant={setSelectedTenant}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* 4. Logs Table Card */}
      <LogsTable
        logs={filteredLogs}
        totalCount={logs.length}
        onInspect={(log) => setInspectedLog(log)}
      />

      {/* 5. Slide-Over Inspect Drawer */}
      <LogInspectDrawer
        log={inspectedLog}
        onClose={() => setInspectedLog(null)}
      />
    </div>
  )
}

export const VasDeveloperLogsView = DeveloperLogsView
export default DeveloperLogsView
