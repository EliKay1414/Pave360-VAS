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
import { useApiLogs } from "../../shared/hooks/useApiLogs"
import { env } from "../../shared/config/env"
import { useAppSelector } from "../../shared/store"
import type { ApiLogQueryParams } from "../../shared/services/vas/types"

// Re-export all types & helper utilities for backward compatibility
export * from "./logs/types"

export function DeveloperLogsView() {
  const signedIn = useAppSelector((state) => state.auth.signedIn)

  // Filters state
  const [selectedMethod, setSelectedMethod] = React.useState<string>("All Methods")
  const [selectedStatus, setSelectedStatus] = React.useState<string>("All Statuses")
  const [apiPath, setApiPath] = React.useState<string>("/api/v1/messages")
  const [selectedTenant, setSelectedTenant] = React.useState<string>("All Tenants")
  const [searchTerm, setSearchTerm] = React.useState<string>("")

  // Prepare API Query Params
  const queryParams = React.useMemo<ApiLogQueryParams>(() => {
    return {
      Method: selectedMethod !== "All Methods" ? selectedMethod : undefined,
      Path: apiPath.trim() || undefined,
      Search: searchTerm.trim() || undefined,
    }
  }, [selectedMethod, apiPath, searchTerm])

  const { data: apiLogsData, isLoading, refetch } = useApiLogs(queryParams)

  // Refresh spinner state
  const [isRefreshing, setIsRefreshing] = React.useState(false)

  // Inspector Drawer state
  const [inspectedLog, setInspectedLog] = React.useState<ApiLogRecord | null>(null)

  // Live mapped logs or fallback
  const logs = React.useMemo<ApiLogRecord[]>(() => {
    if (apiLogsData?.logs && Array.isArray(apiLogsData.logs) && apiLogsData.logs.length > 0) {
      return apiLogsData.logs.map((l) => ({
        id: l.id,
        status: l.statusCode,
        method: l.method,
        path: l.path + (l.queryString ? `?${l.queryString}` : ""),
        duration: l.durationMs ?? 0,
        tenant: l.tenantName || "Platform",
        apiKey: l.apiKeyPrefix ? `${l.apiKeyPrefix}...` : "sk_live_...",
        clientIp: l.clientIp || "127.0.0.1",
        timestamp: l.timestamp ? new Date(l.timestamp).toUTCString() : "",
        userAgent: "HTTP Client / Gateway API",
        requestBody: l.hasRequestBody ? "{ /* payload */ }" : "{}",
        responseBody: l.hasResponseBody ? "{ /* response */ }" : "{}",
        errorReason: l.errorMessage,
      }))
    }
    if (!env.isLive || !signedIn) {
      return INITIAL_API_LOGS
    }
    return INITIAL_API_LOGS
  }, [apiLogsData, signedIn])

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

  const handleRefresh = async () => {
    setIsRefreshing(true)
    if (env.isLive && signedIn) {
      try {
        await refetch()
      } catch {
        // fallback
      }
    }
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
      {Boolean(isLoading && env.isLive && (!(apiLogsData as any)?.logs || (apiLogsData as any)?.logs?.length === 0)) ? (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-12 text-center">
          <div className="inline-block animate-spin w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full mb-3" />
          <p className="text-xs text-slate-500 font-medium">Streaming live API request logs...</p>
        </div>
      ) : (
        <LogsTable
          logs={filteredLogs}
          totalCount={filteredLogs.length}
          onInspect={(log) => setInspectedLog(log)}
        />
      )}

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
