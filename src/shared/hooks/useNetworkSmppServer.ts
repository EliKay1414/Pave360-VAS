import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { vasClient } from "../services/vas/vasClient"
import type { SmppServerStatusResponse } from "../services/vas/types"
import { env } from "../config/env"
import { useAppSelector } from "../store"
import { QUERY_CONFIG, stopPollingOnAuthError } from "../lib/queryClient"

export function useSmppServerStatus() {
  const signedIn = useAppSelector((state) => state.auth.signedIn)

  return useQuery<SmppServerStatusResponse>({
    queryKey: ["vas", "smpp-server"],
    queryFn: () => vasClient.getSmppStatus(),
    enabled: env.isLive && signedIn,
    staleTime: QUERY_CONFIG.realtime.staleTime,
    gcTime: QUERY_CONFIG.realtime.gcTime,
    refetchInterval: stopPollingOnAuthError(QUERY_CONFIG.realtime.refetchInterval),
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
