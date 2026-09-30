import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { vasClient } from "../services/vas/vasClient"
import type {
  WebhookItemViewModel,
  CreateWebhookRequest,
} from "../services/vas/types"
import { env } from "../config/env"
import { useAppSelector } from "../store"
import { QUERY_CONFIG, stopPollingOnAuthError } from "../lib/queryClient"

export function useWebhooks() {
  const signedIn = useAppSelector((state) => state.auth.signedIn)

  return useQuery<WebhookItemViewModel[]>({
    queryKey: ["vas", "webhooks"],
    queryFn: () => vasClient.getWebhooks(),
    enabled: env.isLive && signedIn,
    staleTime: QUERY_CONFIG.standard.staleTime,
    gcTime: QUERY_CONFIG.standard.gcTime,
    refetchInterval: stopPollingOnAuthError(QUERY_CONFIG.standard.refetchInterval),
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
