import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { vasClient } from "../services/vas/vasClient"
import type {
  WebhookItemViewModel,
  CreateWebhookRequest,
} from "../services/vas/types"
import { env } from "../config/env"
import { useAppSelector } from "../store"
import { stopPollingOnAuthError } from "../lib/queryClient"

export function useWebhooks() {
  const signedIn = useAppSelector((state) => state.auth.signedIn)

  return useQuery<WebhookItemViewModel[]>({
    queryKey: ["vas", "webhooks"],
    queryFn: () => vasClient.getWebhooks(),
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

export function useCreateWebhook() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateWebhookRequest) => vasClient.createWebhook(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vas", "webhooks"] })
    },
  })
}

export function useDeleteWebhook() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => vasClient.deleteWebhook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vas", "webhooks"] })
    },
  })
}

export function useTestWebhook() {
  return useMutation({
    mutationFn: (id: string) => vasClient.testWebhook(id),
  })
}
