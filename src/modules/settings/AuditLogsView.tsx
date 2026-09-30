import { useState, useMemo } from "react"
import {
  AuditLogsHeader,
  AuditLogsFilterBar,
  AuditLogsTable,
  AuditLogsPagination,
  INITIAL_AUDIT_LOGS,
  DEFAULT_AUDIT_FILTERS,
  type AuditLogFilters,
  type AuditLogRecord,
} from "../audit"
import { useVasTelemetry } from "../../shared/lib/vasActivityStore"
import { useAuditLogs } from "../../shared/hooks/useAuditLogs"
import { env } from "../../shared/config/env"
import { useAppSelector } from "../../shared/store"
import type { AuditLogQueryParams } from "../../shared/services/vas/types"

const PAGE_SIZE = 50

export function AuditLogsView() {
  const signedIn = useAppSelector((state) => state.auth.signedIn)
  const telemetry = useVasTelemetry()
  const [filters, setFilters] = useState<AuditLogFilters>(DEFAULT_AUDIT_FILTERS)
  const [appliedFilters, setAppliedFilters] = useState<AuditLogFilters>(DEFAULT_AUDIT_FILTERS)
  const [currentPage, setCurrentPage] = useState(1)

  const queryParams = useMemo<AuditLogQueryParams>(() => {
    return {
      actionName: appliedFilters.action ? appliedFilters.action.trim() : undefined,
      entityType: appliedFilters.entityType ? appliedFilters.entityType.trim() : undefined,
      userEmail: appliedFilters.userEmail ? appliedFilters.userEmail.trim() : undefined,
      from: appliedFilters.fromDate || undefined,
      to: (appliedFilters as any).toDate || (appliedFilters as any).to || undefined,
      page: currentPage,
      pageSize: PAGE_SIZE,
    }
  }, [appliedFilters, currentPage])

  const { data: apiAuditData, isLoading } = useAuditLogs(queryParams)

  const logs = useMemo<AuditLogRecord[]>(() => {
    if (apiAuditData?.items && Array.isArray(apiAuditData.items) && apiAuditData.items.length > 0) {
      return apiAuditData.items.map((item) => ({
        id: item.id,
        timestamp: item.createdAt,
        action: item.action,
        tenant:
          (item.tenant && typeof item.tenant === "object" ? item.tenant.name : item.tenant) ||
          "Pave360",
        actor: item.userEmail || item.userId || "System Admin",
        entityType: item.entityType,
        entityId: item.entityId || item.id,
        summary: item.summary,
        ipAddress: item.ipAddress || "127.0.0.1",
      }))
    }

    const dynamicItems: AuditLogRecord[] = telemetry.recentAuditActivity.map((act) => ({
      id: act.id,
      timestamp: act.when.includes("Z") ? act.when : `${act.when}:00Z`,
      action: act.action,
      tenant: "Pave360",
      actor: act.user,
      entityType: act.entity,
      entityId: act.id,
      summary: act.summary,
      ipAddress: "::ffff:127.0.0.1",
    }))

    if (!env.isLive || !signedIn) {
      const seen = new Set(dynamicItems.map((d) => d.id))
      const initialWithoutDupes = INITIAL_AUDIT_LOGS.filter((i) => !seen.has(i.id))
      return [...dynamicItems, ...initialWithoutDupes]
    }

    return dynamicItems.length > 0 ? dynamicItems : INITIAL_AUDIT_LOGS
  }, [apiAuditData, telemetry.recentAuditActivity, signedIn])

  const handleSearch = () => {
    setAppliedFilters(filters)
    setCurrentPage(1)
  }

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (
        appliedFilters.action &&
        !log.action.toLowerCase().includes(appliedFilters.action.toLowerCase().trim())
      ) {
        return false
      }
      if (
        appliedFilters.entityType &&
        !log.entityType.toLowerCase().includes(appliedFilters.entityType.toLowerCase().trim())
      ) {
        return false
      }
      if (
        appliedFilters.userEmail &&
        !log.actor.toLowerCase().includes(appliedFilters.userEmail.toLowerCase().trim())
      ) {
        return false
      }
      if (appliedFilters.fromDate) {
        const filterTime = new Date(appliedFilters.fromDate).getTime()
        const logTime = new Date(log.timestamp).getTime()
        if (!isNaN(filterTime) && !isNaN(logTime) && logTime < filterTime) {
          return false
        }
      }
      return true
    })
  }, [logs, appliedFilters])

  const totalPages = apiAuditData?.totalPages || Math.max(1, Math.ceil(filteredLogs.length / PAGE_SIZE))
  const paginatedLogs = useMemo(() => {
    if (apiAuditData?.items && apiAuditData.items.length > 0) {
      return filteredLogs
    }
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredLogs.slice(start, start + PAGE_SIZE)
  }, [filteredLogs, currentPage, apiAuditData])

  return (
    <div className="space-y-6">
      {/* Subtitle */}
      <AuditLogsHeader />

      {/* Filter Bar with Date Picker & Search Button */}
      <AuditLogsFilterBar
        filters={filters}
        onFilterChange={setFilters}
        onSearch={handleSearch}
      />

      {/* Audit Logs Table */}
      {Boolean(isLoading && env.isLive && (!(apiAuditData as any)?.items || (apiAuditData as any)?.items?.length === 0)) ? (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-12 text-center">
          <div className="inline-block animate-spin w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full mb-3" />
          <p className="text-xs text-slate-500 font-medium">Loading administrative audit records...</p>
        </div>
      ) : (
        <AuditLogsTable logs={paginatedLogs} />
      )}

      {/* Pagination Footer */}
      <AuditLogsPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalRecords={apiAuditData?.totalCount || filteredLogs.length}
        pageSize={PAGE_SIZE}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}

export const VasAuditLogsView = AuditLogsView
export default AuditLogsView
