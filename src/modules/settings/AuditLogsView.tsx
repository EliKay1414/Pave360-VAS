import { useState, useMemo } from "react"
import {
  AuditLogsHeader,
  AuditLogsFilterBar,
  AuditLogsTable,
  AuditLogsPagination,
  INITIAL_AUDIT_LOGS,
  DEFAULT_AUDIT_FILTERS,
  type AuditLogFilters,
} from "../audit"

const PAGE_SIZE = 50

export function AuditLogsView() {
  const [logs] = useState(INITIAL_AUDIT_LOGS)
  const [filters, setFilters] = useState<AuditLogFilters>(DEFAULT_AUDIT_FILTERS)
  const [appliedFilters, setAppliedFilters] = useState<AuditLogFilters>(DEFAULT_AUDIT_FILTERS)
  const [currentPage, setCurrentPage] = useState(1)

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

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / PAGE_SIZE))
  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredLogs.slice(start, start + PAGE_SIZE)
  }, [filteredLogs, currentPage])

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
      <AuditLogsTable logs={paginatedLogs} />

      {/* Pagination Footer */}
      <AuditLogsPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalRecords={filteredLogs.length}
        pageSize={PAGE_SIZE}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}

export const VasAuditLogsView = AuditLogsView
export default AuditLogsView
