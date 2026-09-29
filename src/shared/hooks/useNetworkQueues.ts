import { useQuery } from "@tanstack/react-query"
import { vasClient } from "../services/vas/vasClient"
import type { QueueDashboardViewModel } from "../services/vas/types"
import { env } from "../config/env"
import { useAppSelector } from "../store"
import { stopPollingOnAuthError } from "../lib/queryClient"

export function useNetworkQueues() {
  const signedIn = useAppSelector((state) => state.auth.signedIn)

  return useQuery<QueueDashboardViewModel>({
    queryKey: ["vas", "queues"],
    queryFn: () => vasClient.getQueues(),
    enabled: env.isLive && signedIn,
    staleTime: 3_000,
    refetchInterval: stopPollingOnAuthError(5_000),
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
}
