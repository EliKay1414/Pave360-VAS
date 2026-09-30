export interface VasMetricData {
  messagesToday: number
  avgLatency: string
  messagesThisMonth: number
  deliveryRate: number
  currentTps: number
  submitted: number
  delivered: number
  failed: number
  pendingQueue: number
  queueDepth: number
  platform: {
    tenantsTotal: number
    tenantsActive: number
    usersTotal: number
    usersActive: number
    tenantsThisMonth: number
    activeCarriers: number
  }
  carrierConnections: Array<{
    id: string
    name: string
    status: "Connected" | "Disconnected" | "Connecting"
  }>
  recentAuditActivity: Array<{
    id: string
    when: string
    action: string
    entity: string
    summary: string
    user: string
  }>
}

export interface VasDashboardViewProps {
  initialData?: VasMetricData
}
