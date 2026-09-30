import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { vasClient } from "../services/vas/vasClient"
import type {
  RouteListItemViewModel,
  RouteFormViewModel,
  RouteSimulationRequest,
  RoutingSimulationResponse,
} from "../services/vas/types"
import { env } from "../config/env"
import { useAppSelector } from "../store"
import { QUERY_CONFIG, stopPollingOnAuthError } from "../lib/queryClient"

export function useRoutes() {
  const signedIn = useAppSelector((state) => state.auth.signedIn)

  return useQuery<RouteListItemViewModel[]>({
    queryKey: ["vas", "routes"],
    queryFn: () => vasClient.getRoutes(),
    enabled: env.isLive && signedIn,
    staleTime: QUERY_CONFIG.standard.staleTime,
    gcTime: QUERY_CONFIG.standard.gcTime,
    refetchInterval: stopPollingOnAuthError(QUERY_CONFIG.standard.refetchInterval),
  })
}

export function useRouteDetail(id?: string) {
  const signedIn = useAppSelector((state) => state.auth.signedIn)

  return useQuery<RouteFormViewModel>({
    queryKey: ["vas", "route", id],
    queryFn: () => vasClient.getRoute(id!),
    enabled: Boolean(id && env.isLive && signedIn),
    staleTime: QUERY_CONFIG.standard.staleTime,
    gcTime: QUERY_CONFIG.standard.gcTime,
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
