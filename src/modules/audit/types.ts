export interface AuditLogRecord {
  id: string
  timestamp: string
  action: string
  tenant: string
  actor: string
  entityType: string
  entityId: string
  summary: string
  ipAddress: string
}

export interface AuditLogFilters {
  action: string
  entityType: string
  userEmail: string
  fromDate: string
}
