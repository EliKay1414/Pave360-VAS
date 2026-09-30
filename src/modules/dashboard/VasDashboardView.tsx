import * as React from "react"
import { useDashboardAnalytics } from "../../shared/hooks/useDashboardAnalytics"
import type { VasMetricData, VasDashboardViewProps } from "./types"
import { DashboardOverviewCards } from "./components/DashboardOverviewCards"
import { DashboardPipelineCards } from "./components/DashboardPipelineCards"
import { DashboardPlatformCards } from "./components/DashboardPlatformCards"
import { DashboardRecentAuditTable } from "./components/DashboardRecentAuditTable"

// Re-export type for existing consumers
export type { VasMetricData, VasDashboardViewProps }

export function VasDashboardView({ initialData }: VasDashboardViewProps) {
  const { data: liveData } = useDashboardAnalytics()
  const data = initialData || liveData

  return (
    <div className="space-y-4 font-sans select-none pb-8">
      {/* Row 1: Four Main Metric Cards */}
      <DashboardOverviewCards data={data} />

      {/* Row 2: Four Mini Pipeline Cards */}
      <DashboardPipelineCards data={data} />

      {/* Row 3: Platform Foundation & Carrier Connections */}
      <DashboardPlatformCards data={data} />

      {/* Row 4: Recent Audit Activity Table */}
      <DashboardRecentAuditTable recentAuditActivity={data.recentAuditActivity} />
    </div>
  )
}

export default VasDashboardView
