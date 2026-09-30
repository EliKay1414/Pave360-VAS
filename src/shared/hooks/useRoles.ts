import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { vasClient } from "../services/vas/vasClient"
import type { RoleListItemViewModel, RoleFormViewModel } from "../services/vas/types"
import { env } from "../config/env"
import { useAppSelector } from "../store"
import { QUERY_CONFIG, stopPollingOnAuthError } from "../lib/queryClient"

export function useRoles() {
  const signedIn = useAppSelector((state) => state.auth.signedIn)

  return useQuery<RoleListItemViewModel[]>({
    queryKey: ["vas", "roles"],
    queryFn: () => vasClient.getRoles(),
    enabled: env.isLive && signedIn,
    staleTime: QUERY_CONFIG.standard.staleTime,
    gcTime: QUERY_CONFIG.standard.gcTime,
    refetchInterval: stopPollingOnAuthError(QUERY_CONFIG.standard.refetchInterval),
  })
}

export function useRoleDetail(id?: string) {
  const signedIn = useAppSelector((state) => state.auth.signedIn)

  return useQuery<RoleListItemViewModel>({
    queryKey: ["vas", "role", id],
    queryFn: () => vasClient.getRole(id!),
    enabled: Boolean(id && env.isLive && signedIn),
    staleTime: QUERY_CONFIG.standard.staleTime,
    gcTime: QUERY_CONFIG.standard.gcTime,
  })
}

export function useCreateRole() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: RoleFormViewModel) => vasClient.createRole(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vas", "roles"] })
    },
  })
}

export function useUpdateRolePermissions() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ roleId, permissions }: { roleId: string; permissions: string[] }) =>
      vasClient.updateRolePermissions(roleId, permissions),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["vas", "roles"] })
      queryClient.invalidateQueries({ queryKey: ["vas", "role", variables.roleId] })
    },
  })
}
