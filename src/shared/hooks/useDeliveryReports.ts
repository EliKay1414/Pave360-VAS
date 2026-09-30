import { useQuery } from "@tanstack/react-query"
import { vasClient } from "../services/vas/vasClient"
import type { DeliveryReportItemViewModel, DlrQueryParams } from "../services/vas/types"
import { env } from "../config/env"
import { useAppSelector } from "../store"
import { QUERY_CONFIG, stopPollingOnAuthError } from "../lib/queryClient"

export function useDeliveryReports(params?: DlrQueryParams) {
  const signedIn = useAppSelector((state) => state.auth.signedIn)

  const queryKey = [
    "vas",
    "delivery-reports",
    params?.page,
    params?.pageSize,
    params?.status,
    params?.query,
    params?.messageId,
    params?.carrierId,
  ]

  const query = useQuery<DeliveryReportItemViewModel[]>({
    queryKey,
    queryFn: () => vasClient.getDeliveryReports(params),
    enabled: env.isLive && signedIn,
    staleTime: QUERY_CONFIG.reports.staleTime,
    gcTime: QUERY_CONFIG.reports.gcTime,
    refetchInterval: stopPollingOnAuthError(QUERY_CONFIG.reports.refetchInterval),
  })

  return {
    reports: query.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  }
}
