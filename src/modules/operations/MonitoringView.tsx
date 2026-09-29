import * as React from "react"
import {
  MonitoringHeader,
  MonitoringKpiCards,
  HealthChecksCard,
  WorkersCard,
  CarrierConnectionsTable,
  RawHealthModal,
  INITIAL_MONITORING_OVERVIEW,
  INITIAL_HEALTH_CHECKS,
  INITIAL_WORKERS,
  INITIAL_CARRIER_CONNECTIONS,
  type MonitoringOverview,
  type CarrierConnectionItem,
} from "./monitoring"
import { useDashboardAnalytics } from "../../shared/hooks/useDashboardAnalytics"
import { useConnections } from "../../shared/hooks/useNetworkConnections"
import { env } from "../../shared/config/env"

export function MonitoringView() {
  const [isRawHealthOpen, setIsRawHealthOpen] = React.useState(false)
  const { data: metrics } = useDashboardAnalytics()
  const { data: liveConnections } = useConnections()

  // Real-time overview metrics mapped from live dashboard analytics
  const overview: MonitoringOverview = React.useMemo(() => {
    if (env.isLive && metrics) {
      return {
        overallStatus: (metrics.failed ?? 0) > 100 ? "Degraded" : "Healthy",
        openAlerts: 0,
        last15MinTotal: metrics.messagesToday ?? 0,
        last15MinDelivered: metrics.delivered ?? 0,
        last15MinFailed: metrics.failed ?? 0,
        smsSubmitQueue: metrics.pendingQueue ?? 0,
        sideQueues: {
          dlr: 0,
          wh: 0,
          in: 0,
        },
      }
    }
    return INITIAL_MONITORING_OVERVIEW
  }, [metrics])

  // Real-time carrier connection statuses from live gateway
  const carrierConnections: CarrierConnectionItem[] = React.useMemo(() => {
    if (env.isLive && metrics?.carrierConnections && metrics.carrierConnections.length > 0) {
      return metrics.carrierConnections.map((cs) => {
        const isConn =
          cs.status?.toLowerCase().includes("connect") &&
          !cs.status?.toLowerCase().includes("disconn")
        return {
          carrier: cs.name || "MNO Carrier",
          connection: cs.name || "SMPP Bind",
          status: isConn ? "Connected" : "Disconnected",
          enabled: true,
          lastStatus: new Date().toLocaleTimeString(),
        }
      })
    }
    if (env.isLive && liveConnections && liveConnections.length > 0) {
      return liveConnections.map((c) => {
        const isBound =
          c.runtimeStatus?.toLowerCase().includes("bound") ||
          c.runtimeStatus?.toLowerCase().includes("connect") ||
          c.isEnabled
        return {
          carrier: c.carrierName || c.name,
          connection: c.name,
          status: isBound ? "Connected" : "Disconnected",
          enabled: c.isEnabled ? "Yes" : "No",
          lastStatus: new Date().toLocaleTimeString(),
        }
      })
    }
    return INITIAL_CARRIER_CONNECTIONS
  }, [metrics, liveConnections])

  return (
    <div className="space-y-6 pb-12">
      {/* Subtitle and Raw /health Action */}
      <MonitoringHeader onRawHealthClick={() => setIsRawHealthOpen(true)} />

      {/* 4 KPI Metrics */}
      <MonitoringKpiCards overview={overview} />

      {/* Health Checks & Workers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <HealthChecksCard checks={INITIAL_HEALTH_CHECKS} />
        <WorkersCard workers={INITIAL_WORKERS} />
      </div>

      {/* Carrier Connections Table */}
      <CarrierConnectionsTable connections={carrierConnections} />

      {/* Raw Health JSON Modal */}
      <RawHealthModal
        isOpen={isRawHealthOpen}
        onClose={() => setIsRawHealthOpen(false)}
        overview={overview}
        checks={INITIAL_HEALTH_CHECKS}
        workers={INITIAL_WORKERS}
        connections={carrierConnections}
      />
    </div>
  )
}

export const VasMonitoringView = MonitoringView
export default MonitoringView
