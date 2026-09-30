import { useQuery } from "@tanstack/react-query"
import { vasClient } from "../services/vas/vasClient"
import type { AuditLogsResponse, AuditLogQueryParams } from "../services/vas/types"
import { env } from "../config/env"
import { useAppSelector } from "../store"
import { QUERY_CONFIG, stopPollingOnAuthError } from "../lib/queryClient"

export function useAuditLogs(params?: AuditLogQueryParams) {
  const signedIn = useAppSelector((state) => state.auth.signedIn)

  return useQuery<AuditLogsResponse>({
    queryKey: ["vas", "logs", "audit", params],
    queryFn: () => vasClient.getAuditLogs(params),
    enabled: env.isLive && signedIn,
    staleTime: QUERY_CONFIG.standard.staleTime,
    gcTime: QUERY_CONFIG.standard.gcTime,
    refetchInterval: stopPollingOnAuthError(QUERY_CONFIG.standard.refetchInterval),
  })
}
