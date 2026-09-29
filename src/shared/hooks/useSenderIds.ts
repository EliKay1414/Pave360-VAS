import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { vasClient } from "../services/vas/vasClient"
import type {
  SenderIdItemViewModel,
  RegisterSenderRequest,
  RegisterSenderResponse,
} from "../services/vas/types"
import { env } from "../config/env"
import { useAppSelector } from "../store"
import { stopPollingOnAuthError } from "../lib/queryClient"

export function useSenderIds() {
  const signedIn = useAppSelector((state) => state.auth.signedIn)

  return useQuery<SenderIdItemViewModel[]>({
    queryKey: ["vas", "sender-ids"],
    queryFn: () => vasClient.getSenderIds(),
    enabled: env.isLive && signedIn,
    staleTime: 15_000,
    refetchInterval: stopPollingOnAuthError(30_000),
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

export function useRegisterSenderId() {
  const queryClient = useQueryClient()
  return useMutation<RegisterSenderResponse, Error, RegisterSenderRequest>({
    mutationFn: (payload: RegisterSenderRequest) => vasClient.registerSenderId(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vas", "sender-ids"] })
    },
  })
}

export function useDeleteSenderId() {
  const queryClient = useQueryClient()
  return useMutation<void, Error, string>({
    mutationFn: (id: string) => vasClient.deleteSenderId(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vas", "sender-ids"] })
    },
  })
}
