import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { vasClient } from "../services/vas/vasClient"
import type { ApiKeyListItemViewModel, CreateApiKeyRequest } from "../services/vas/types"
import { env } from "../config/env"
import { useAppSelector } from "../store"
import { QUERY_CONFIG, stopPollingOnAuthError } from "../lib/queryClient"

export function useApiKeys() {
  const signedIn = useAppSelector((state) => state.auth.signedIn)

  return useQuery<ApiKeyListItemViewModel[]>({
    queryKey: ["vas", "api-keys"],
    queryFn: () => vasClient.getApiKeys(),
    enabled: env.isLive && signedIn,
    staleTime: QUERY_CONFIG.standard.staleTime,
    gcTime: QUERY_CONFIG.standard.gcTime,
    refetchInterval: stopPollingOnAuthError(QUERY_CONFIG.standard.refetchInterval),
  })
}

export function useCreateApiKey() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateApiKeyRequest) => vasClient.createApiKey(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vas", "api-keys"] })
    },
  })
}

export function useRevokeApiKey() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => vasClient.revokeApiKey(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vas", "api-keys"] })
    },
  })
}

export function useDeleteApiKey() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => vasClient.deleteApiKey(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vas", "api-keys"] })
    },
  })
}
