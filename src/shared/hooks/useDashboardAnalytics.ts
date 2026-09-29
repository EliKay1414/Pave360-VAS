import { useQuery } from "@tanstack/react-query"
import { vasClient } from "../services/vas/vasClient"
import type { DashboardViewModel } from "../services/vas/types"
import { useVasTelemetry, type VasMetricData } from "../lib/vasActivityStore"
import { env } from "../config/env"
import { useAppSelector } from "../store"

export function mapDashboardViewModelToMetrics(
  vm: DashboardViewModel,
  fallback: VasMetricData,
): VasMetricData {
  return {
    messagesToday: vm.messagesToday ?? fallback.messagesToday,
    avgLatency:
      vm.averageDeliverySeconds !== undefined && vm.averageDeliverySeconds !== null
        ? `${vm.averageDeliverySeconds}s`
        : fallback.avgLatency,
    messagesThisMonth: vm.messagesThisMonth ?? fallback.messagesThisMonth,
    deliveryRate: vm.deliveryRatePercent ?? fallback.deliveryRate,
    currentTps: vm.currentTps ?? fallback.currentTps,
    submitted: vm.submittedMessages ?? fallback.submitted,
    delivered: vm.deliveredMessages ?? fallback.delivered,
    failed: vm.failedMessages ?? fallback.failed,
    pendingQueue: vm.pendingMessages ?? fallback.pendingQueue,
    queueDepth: vm.queueDepth ?? fallback.queueDepth,
    platform: {
      tenantsTotal: vm.tenantCount ?? fallback.platform.tenantsTotal,
      tenantsActive: vm.activeTenants ?? fallback.platform.tenantsActive,
      usersTotal: vm.userCount ?? fallback.platform.usersTotal,
      usersActive: vm.activeUsers ?? fallback.platform.usersActive,
      tenantsThisMonth: vm.tenantsCreatedThisMonth ?? fallback.platform.tenantsThisMonth,
      activeCarriers: vm.activeCarriers ?? fallback.platform.activeCarriers,
    },
    carrierConnections:
      vm.carrierStates && vm.carrierStates.length > 0
        ? vm.carrierStates.map((cs, idx) => ({
            id: `cs-${idx}`,
            name: cs.name || `Carrier ${idx + 1}`,
            status:
              cs.status?.toLowerCase().includes("connect") && !cs.status?.toLowerCase().includes("disconn")
                ? "Connected"
                : cs.status?.toLowerCase().includes("disconn")
                ? "Disconnected"
                : "Connecting",
          }))
        : fallback.carrierConnections,
    recentAuditActivity:
      vm.recentAuditItems && vm.recentAuditItems.length > 0
        ? vm.recentAuditItems.map((item, idx) => ({
            id: `audit-${idx}`,
            when: item.createdAt
              ? item.createdAt.replace("T", " ").slice(0, 16)
              : fallback.recentAuditActivity[0]?.when || "",
            action: item.action || "system.event",
            entity: item.entityType || "Gateway",
            summary: item.summary || `${item.action || "Action"} on ${item.entityType || "Gateway"}`,
            user: item.userEmail || "System",
          }))
        : fallback.recentAuditActivity,
  }
}

import { stopPollingOnAuthError } from "../lib/queryClient"

export function useDashboardAnalytics() {
  const fallbackTelemetry = useVasTelemetry()
  const signedIn = useAppSelector((state) => state.auth.signedIn)

  const query = useQuery<DashboardViewModel>({
    queryKey: ["vas", "dashboard", "analytics"],
    queryFn: () => vasClient.getDashboard(),
    enabled: env.isLive && signedIn,
    refetchInterval: stopPollingOnAuthError(10000), // Stop polling if 401/403
    staleTime: 5000,
    retry: (failureCount, error: any) => {
      if (
        error?.status === 401 ||
        error?.status === 403 ||
        error?.statusCode === 401 ||
        error?.statusCode === 403
      ) {
        return false
      }
      return failureCount < 1
    },
  })

  const isLive = Boolean(query.data && !query.isError)
  const metrics = query.data
    ? mapDashboardViewModelToMetrics(query.data, fallbackTelemetry)
    : fallbackTelemetry

  return {
    data: metrics,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isLive,
    error: query.error,
    refetch: query.refetch,
    phaseNote: query.data?.phaseNote ?? null,
  }
}
