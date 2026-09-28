import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { vasClient } from "../services/vas/vasClient"
import type {
  RouteListItemViewModel,
  RouteFormViewModel,
  RouteSimulationRequest,
  RoutingSimulationResponse,
} from "../services/vas/types"

export function useRoutes() {
  return useQuery<RouteListItemViewModel[]>({
    queryKey: ["vas", "routes"],
    queryFn: () => vasClient.getRoutes(),
    staleTime: 10_000,
    refetchInterval: 30_000,
  })
}

export function useRouteDetail(id?: string) {
  return useQuery<RouteFormViewModel>({
    queryKey: ["vas", "route", id],
    queryFn: () => vasClient.getRoute(id!),
    enabled: Boolean(id),
  })
}

export function useCreateRoute() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: RouteFormViewModel) => vasClient.createRoute(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vas", "routes"] })
    },
  })
}

export function useUpdateRoute() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: RouteFormViewModel }) =>
      vasClient.updateRoute(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["vas", "routes"] })
      queryClient.invalidateQueries({ queryKey: ["vas", "route", variables.id] })
    },
  })
}

export function useDeleteRoute() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => vasClient.deleteRoute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vas", "routes"] })
    },
  })
}

export function useToggleRoute() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => vasClient.toggleRoute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vas", "routes"] })
    },
  })
}

export function useSimulateRoute() {
  return useMutation<RoutingSimulationResponse, Error, RouteSimulationRequest>({
    mutationFn: (payload: RouteSimulationRequest) => vasClient.simulateRoute(payload),
  })
}
