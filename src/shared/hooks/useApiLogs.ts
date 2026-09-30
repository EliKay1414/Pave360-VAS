import { useQuery } from "@tanstack/react-query"
import { vasClient } from "../services/vas/vasClient"
import type { ApiLogIndexViewModel, ApiLogQueryParams } from "../services/vas/types"
import { env } from "../config/env"
import { useAppSelector } from "../store"
import { QUERY_CONFIG, stopPollingOnAuthError } from "../lib/queryClient"

export function useApiLogs(params?: ApiLogQueryParams) {
  const signedIn = useAppSelector((state) => state.auth.signedIn)

  return useQuery<ApiLogIndexViewModel>({
    queryKey: ["vas", "logs", "api", params],
    queryFn: () => vasClient.getApiLogs(params),
    enabled: env.isLive && signedIn,
    staleTime: QUERY_CONFIG.traffic.staleTime,
    gcTime: QUERY_CONFIG.traffic.gcTime,
    refetchInterval: stopPollingOnAuthError(QUERY_CONFIG.traffic.refetchInterval),
  })
}
