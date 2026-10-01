import { useQuery } from "@tanstack/react-query"
import { vasClient } from "../services/vas/vasClient"
import type {
  ReportQueryParams,
  FinancialReportResponse,
  DeliveryReportAnalyticsResponse,
  MessagingReportResponse,
} from "../services/vas/types"
import { env } from "../config/env"
import { useAppSelector } from "../store"
import { QUERY_CONFIG, stopPollingOnAuthError } from "../lib/queryClient"

export function useBillingReports(params?: ReportQueryParams) {
  const signedIn = useAppSelector((state) => state.auth.signedIn)

  const from = params?.from || params?.fromDate
  const to = params?.to || params?.toDate
  const normalizedParams: ReportQueryParams = {
    ...params,
    from,
    to,
  }

  const financialQuery = useQuery<FinancialReportResponse>({
    queryKey: ["vas", "reports", "financial", from, to, params?.tenantId, params?.type],
    queryFn: () => vasClient.getFinancialReports(normalizedParams),
    enabled: env.isLive && signedIn,
    staleTime: QUERY_CONFIG.reports.staleTime,
    gcTime: QUERY_CONFIG.reports.gcTime,
    refetchInterval: stopPollingOnAuthError(QUERY_CONFIG.reports.refetchInterval),
  })

  const telemetryQuery = useQuery<DeliveryReportAnalyticsResponse>({
    queryKey: ["vas", "reports", "delivery", from, to, params?.carrierId],
    queryFn: () => vasClient.getDeliveryReportsAnalytics(normalizedParams),
    enabled: env.isLive && signedIn,
    staleTime: QUERY_CONFIG.reports.staleTime,
    gcTime: QUERY_CONFIG.reports.gcTime,
    refetchInterval: stopPollingOnAuthError(QUERY_CONFIG.reports.refetchInterval),
  })

  const messagingQuery = useQuery<MessagingReportResponse>({
    queryKey: ["vas", "reports", "messaging", from, to, params?.tenantId],
    queryFn: () => vasClient.getMessagingReports(normalizedParams),
    enabled: env.isLive && signedIn,
    staleTime: QUERY_CONFIG.reports.staleTime,
    gcTime: QUERY_CONFIG.reports.gcTime,
    refetchInterval: stopPollingOnAuthError(QUERY_CONFIG.reports.refetchInterval),
  })

  return {
    financial: financialQuery.data,
    telemetry: telemetryQuery.data,
    messaging: messagingQuery.data,
    isLoading: financialQuery.isLoading || telemetryQuery.isLoading || messagingQuery.isLoading,
    isFetching: financialQuery.isFetching || telemetryQuery.isFetching || messagingQuery.isFetching,
    refetch: () => {
      financialQuery.refetch()
      telemetryQuery.refetch()
      messagingQuery.refetch()
    },
  }
}
