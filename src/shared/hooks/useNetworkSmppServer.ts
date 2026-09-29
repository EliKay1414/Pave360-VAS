import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { vasClient } from "../services/vas/vasClient"
import type { SmppServerStatusResponse } from "../services/vas/types"
import { env } from "../config/env"
import { useAppSelector } from "../store"
import { stopPollingOnAuthError } from "../lib/queryClient"

export function useSmppServerStatus() {
  const signedIn = useAppSelector((state) => state.auth.signedIn)

  return useQuery<SmppServerStatusResponse>({
    queryKey: ["vas", "smpp-server"],
    queryFn: () => vasClient.getSmppStatus(),
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

export function useDisconnectSmppSession() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (sessionId: string) => vasClient.disconnectSmppSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vas", "smpp-server"] })
    },
  })
}
