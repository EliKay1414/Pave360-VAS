import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { vasClient } from "../services/vas/vasClient"
import type {
  ConnectionListItemViewModel,
  ConnectionFormViewModel,
} from "../services/vas/types"
import { env } from "../config/env"
import { useAppSelector } from "../store"
import { stopPollingOnAuthError } from "../lib/queryClient"

export function useConnections(carrierId?: string) {
  const signedIn = useAppSelector((state) => state.auth.signedIn)

  return useQuery<ConnectionListItemViewModel[]>({
    queryKey: ["vas", "connections", carrierId ?? "all"],
    queryFn: () => vasClient.getConnections(carrierId),
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

export function useConnectionDetail(id?: string) {
  const signedIn = useAppSelector((state) => state.auth.signedIn)

  return useQuery<ConnectionFormViewModel>({
    queryKey: ["vas", "connection", id],
    queryFn: () => vasClient.getConnection(id!),
    enabled: Boolean(id && env.isLive && signedIn),
  })
}

export function useCreateConnection() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: ConnectionFormViewModel) => vasClient.createConnection(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vas", "connections"] })
      queryClient.invalidateQueries({ queryKey: ["vas", "carriers"] })
      queryClient.invalidateQueries({ queryKey: ["vas", "dashboard"] })
    },
  })
}

export function useUpdateConnection() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ConnectionFormViewModel }) =>
      vasClient.updateConnection(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["vas", "connections"] })
      queryClient.invalidateQueries({ queryKey: ["vas", "connection", variables.id] })
      queryClient.invalidateQueries({ queryKey: ["vas", "carriers"] })
    },
  })
}

export function useDeleteConnection() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => vasClient.deleteConnection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vas", "connections"] })
      queryClient.invalidateQueries({ queryKey: ["vas", "carriers"] })
      queryClient.invalidateQueries({ queryKey: ["vas", "dashboard"] })
    },
  })
}

export function useToggleConnection() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, enable }: { id: string; enable: boolean }) =>
      vasClient.toggleConnection(id, enable),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vas", "connections"] })
      queryClient.invalidateQueries({ queryKey: ["vas", "carriers"] })
      queryClient.invalidateQueries({ queryKey: ["vas", "dashboard"] })
    },
  })
}

export function useTestConnection() {
  return useMutation({
    mutationFn: (id: string) => vasClient.testConnection(id),
  })
}

export function useReconnectConnection() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => vasClient.reconnectConnection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vas", "connections"] })
    },
  })
}
