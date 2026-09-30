import { useQuery } from "@tanstack/react-query"
import { vasClient } from "../services/vas/vasClient"
import type { QueueDashboardViewModel } from "../services/vas/types"
import { env } from "../config/env"
import { useAppSelector } from "../store"
import { QUERY_CONFIG, stopPollingOnAuthError } from "../lib/queryClient"

export function useNetworkQueues() {
  const signedIn = useAppSelector((state) => state.auth.signedIn)

  return useQuery<QueueDashboardViewModel>({
    queryKey: ["vas", "queues"],
    queryFn: () => vasClient.getQueues(),
    enabled: env.isLive && signedIn,
    staleTime: QUERY_CONFIG.realtime.staleTime,
    gcTime: QUERY_CONFIG.realtime.gcTime,
    refetchInterval: stopPollingOnAuthError(QUERY_CONFIG.realtime.refetchInterval),
  })
}
