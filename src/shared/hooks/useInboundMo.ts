import { useQuery } from "@tanstack/react-query"
import { vasClient } from "../services/vas/vasClient"
import type { InboundMessageItemViewModel } from "../services/vas/types"
import { env } from "../config/env"
import { useAppSelector } from "../store"
import { stopPollingOnAuthError } from "../lib/queryClient"

export interface UseInboundMoParams {
  limit?: number
  since?: string
}

export function useInboundMo(params: UseInboundMoParams = {}) {
  const signedIn = useAppSelector((state) => state.auth.signedIn)

  return useQuery<InboundMessageItemViewModel[]>({
    queryKey: ["vas", "inbound-mo", params],
    queryFn: () => vasClient.getInboundMessages(params),
    enabled: env.isLive && signedIn,
    staleTime: 10_000,
    refetchInterval: stopPollingOnAuthError(15_000),
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
