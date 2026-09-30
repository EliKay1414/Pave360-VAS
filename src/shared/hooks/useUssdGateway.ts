import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { vasClient } from "../services/vas/vasClient"
import type {
  UssdSessionItemViewModel,
  UssdNotifyRequest,
  UssdNotifyResponse,
  UssdSessionRequest,
  UssdSessionResponse,
} from "../services/vas/types"
import { env } from "../config/env"
import { useAppSelector } from "../store"
import { QUERY_CONFIG, stopPollingOnAuthError } from "../lib/queryClient"

export function useUssdSessions() {
  const signedIn = useAppSelector((state) => state.auth.signedIn)

  return useQuery<UssdSessionItemViewModel[]>({
    queryKey: ["vas", "ussd-sessions"],
    queryFn: () => vasClient.getUssdSessions(),
    enabled: env.isLive && signedIn,
    staleTime: QUERY_CONFIG.traffic.staleTime,
    gcTime: QUERY_CONFIG.traffic.gcTime,
    refetchInterval: stopPollingOnAuthError(QUERY_CONFIG.traffic.refetchInterval),
  })
}

export function useUssdSessionDetail(id?: string) {
  const signedIn = useAppSelector((state) => state.auth.signedIn)

  return useQuery<UssdSessionItemViewModel>({
    queryKey: ["vas", "ussd-session", id],
    queryFn: () => vasClient.getUssdSessionDetail(id!),
    enabled: Boolean(id && env.isLive && signedIn),
    staleTime: QUERY_CONFIG.standard.staleTime,
    gcTime: QUERY_CONFIG.standard.gcTime,
  })
}

export function useSendUssdNotify() {
  const queryClient = useQueryClient()
  return useMutation<UssdNotifyResponse, Error, UssdNotifyRequest>({
    mutationFn: (payload: UssdNotifyRequest) => vasClient.sendUssdNotify(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vas", "ussd-sessions"] })
    },
  })
}

export function useSimulateUssdSession() {
  const queryClient = useQueryClient()
  return useMutation<UssdSessionResponse, Error, UssdSessionRequest>({
    mutationFn: (payload: UssdSessionRequest) => vasClient.simulateUssdSession(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vas", "ussd-sessions"] })
    },
  })
}
