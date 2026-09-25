import { useState } from "react"
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
} from "./monitoring"

export function MonitoringView() {
  const [isRawHealthOpen, setIsRawHealthOpen] = useState(false)
  const [overview] = useState(INITIAL_MONITORING_OVERVIEW)
  const [healthChecks] = useState(INITIAL_HEALTH_CHECKS)
  const [workers] = useState(INITIAL_WORKERS)
  const [carrierConnections] = useState(INITIAL_CARRIER_CONNECTIONS)

  return (
    <div className="space-y-6">
      {/* Subtitle and Raw /health Action */}
      <MonitoringHeader onRawHealthClick={() => setIsRawHealthOpen(true)} />

      {/* 4 KPI Metrics */}
      <MonitoringKpiCards overview={overview} />

      {/* Health Checks & Workers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <HealthChecksCard checks={healthChecks} />
        <WorkersCard workers={workers} />
      </div>

      {/* Carrier Connections Table */}
      <CarrierConnectionsTable connections={carrierConnections} />

      {/* Raw Health JSON Modal */}
      <RawHealthModal
        isOpen={isRawHealthOpen}
        onClose={() => setIsRawHealthOpen(false)}
        overview={overview}
        checks={healthChecks}
        workers={workers}
        connections={carrierConnections}
      />
    </div>
  )
}

export const VasMonitoringView = MonitoringView
export default MonitoringView
