import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { vasClient } from "../services/vas/vasClient"
import type {
  ConnectionListItemViewModel,
  ConnectionFormViewModel,
} from "../services/vas/types"

export function useConnections(carrierId?: string) {
  return useQuery<ConnectionListItemViewModel[]>({
    queryKey: ["vas", "connections", carrierId ?? "all"],
    queryFn: () => vasClient.getConnections(carrierId),
    staleTime: 10_000,
    refetchInterval: 15_000,
  })
}

export function useConnectionDetail(id?: string) {
  return useQuery<ConnectionFormViewModel>({
    queryKey: ["vas", "connection", id],
    queryFn: () => vasClient.getConnection(id!),
    enabled: Boolean(id),
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
