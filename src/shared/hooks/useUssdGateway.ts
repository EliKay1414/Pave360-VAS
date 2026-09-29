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
import { stopPollingOnAuthError } from "../lib/queryClient"

export function useUssdSessions() {
  const signedIn = useAppSelector((state) => state.auth.signedIn)

  return useQuery<UssdSessionItemViewModel[]>({
    queryKey: ["vas", "ussd-sessions"],
    queryFn: () => vasClient.getUssdSessions(),
    enabled: env.isLive && signedIn,
    staleTime: 10_000,
    refetchInterval: stopPollingOnAuthError(20_000),
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

export function useUssdSessionDetail(id?: string) {
  const signedIn = useAppSelector((state) => state.auth.signedIn)

  return useQuery<UssdSessionItemViewModel>({
    queryKey: ["vas", "ussd-session", id],
    queryFn: () => vasClient.getUssdSessionDetail(id!),
    enabled: Boolean(id && env.isLive && signedIn),
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
