import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { vasClient } from "../services/vas/vasClient"
import type { TenantListItemViewModel, TenantFormViewModel } from "../services/vas/types"
import { env } from "../config/env"
import { useAppSelector } from "../store"
import { QUERY_CONFIG, stopPollingOnAuthError } from "../lib/queryClient"

export function useTenants() {
  const signedIn = useAppSelector((state) => state.auth.signedIn)

  return useQuery<TenantListItemViewModel[]>({
    queryKey: ["vas", "tenants"],
    queryFn: () => vasClient.getTenants(),
    enabled: env.isLive && signedIn,
    staleTime: QUERY_CONFIG.standard.staleTime,
    gcTime: QUERY_CONFIG.standard.gcTime,
    refetchInterval: stopPollingOnAuthError(QUERY_CONFIG.standard.refetchInterval),
  })
}

export function useTenantDetail(id?: string) {
  const signedIn = useAppSelector((state) => state.auth.signedIn)

  return useQuery<TenantFormViewModel>({
    queryKey: ["vas", "tenant", id],
    queryFn: () => vasClient.getTenant(id!),
    enabled: Boolean(id && env.isLive && signedIn),
    staleTime: QUERY_CONFIG.standard.staleTime,
    gcTime: QUERY_CONFIG.standard.gcTime,
  })
}

export function useCreateTenant() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: TenantFormViewModel) => vasClient.createTenant(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vas", "tenants"] })
      queryClient.invalidateQueries({ queryKey: ["vas", "dashboard"] })
    },
  })
}

export function useUpdateTenant() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: TenantFormViewModel }) =>
      vasClient.updateTenant(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["vas", "tenants"] })
      queryClient.invalidateQueries({ queryKey: ["vas", "tenant", variables.id] })
      queryClient.invalidateQueries({ queryKey: ["vas", "dashboard"] })
    },
  })
}

export function useDeleteTenant() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => vasClient.deleteTenant(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vas", "tenants"] })
      queryClient.invalidateQueries({ queryKey: ["vas", "dashboard"] })
    },
  })
}
