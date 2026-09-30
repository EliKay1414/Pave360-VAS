import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { vasClient } from "../services/vas/vasClient"
import type { UserListItemViewModel, UserFormViewModel } from "../services/vas/types"
import { env } from "../config/env"
import { useAppSelector } from "../store"
import { QUERY_CONFIG, stopPollingOnAuthError } from "../lib/queryClient"

export function useUsers() {
  const signedIn = useAppSelector((state) => state.auth.signedIn)

  return useQuery<UserListItemViewModel[]>({
    queryKey: ["vas", "users"],
    queryFn: () => vasClient.getUsers(),
    enabled: env.isLive && signedIn,
    staleTime: QUERY_CONFIG.standard.staleTime,
    gcTime: QUERY_CONFIG.standard.gcTime,
    refetchInterval: stopPollingOnAuthError(QUERY_CONFIG.standard.refetchInterval),
  })
}

export function useUserDetail(id?: string) {
  const signedIn = useAppSelector((state) => state.auth.signedIn)

  return useQuery<UserFormViewModel>({
    queryKey: ["vas", "user", id],
    queryFn: () => vasClient.getUser(id!),
    enabled: Boolean(id && env.isLive && signedIn),
    staleTime: QUERY_CONFIG.standard.staleTime,
    gcTime: QUERY_CONFIG.standard.gcTime,
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: UserFormViewModel) => vasClient.createUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vas", "users"] })
    },
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UserFormViewModel }) =>
      vasClient.updateUser(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["vas", "users"] })
      queryClient.invalidateQueries({ queryKey: ["vas", "user", variables.id] })
    },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => vasClient.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vas", "users"] })
    },
  })
}

export function useToggleUserStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => vasClient.toggleUserStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vas", "users"] })
    },
  })
}
