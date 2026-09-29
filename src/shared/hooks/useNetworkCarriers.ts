import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { vasClient } from "../services/vas/vasClient"
import type { CarrierListItemViewModel, CarrierFormViewModel } from "../services/vas/types"
import { env } from "../config/env"
import { useAppSelector } from "../store"
import { stopPollingOnAuthError } from "../lib/queryClient"

export function useCarriers() {
  const signedIn = useAppSelector((state) => state.auth.signedIn)

  return useQuery<CarrierListItemViewModel[]>({
    queryKey: ["vas", "carriers"],
    queryFn: () => vasClient.getCarriers(),
    enabled: env.isLive && signedIn,
    staleTime: 10_000,
    refetchInterval: stopPollingOnAuthError(30_000),
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

export function useCarrierDetail(id?: string) {
  const signedIn = useAppSelector((state) => state.auth.signedIn)

  return useQuery<CarrierFormViewModel>({
    queryKey: ["vas", "carrier", id],
    queryFn: () => vasClient.getCarrier(id!),
    enabled: Boolean(id && env.isLive && signedIn),
  })
}

export function useCreateCarrier() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CarrierFormViewModel) => vasClient.createCarrier(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vas", "carriers"] })
      queryClient.invalidateQueries({ queryKey: ["vas", "dashboard"] })
    },
  })
}

export function useUpdateCarrier() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CarrierFormViewModel }) =>
      vasClient.updateCarrier(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["vas", "carriers"] })
      queryClient.invalidateQueries({ queryKey: ["vas", "carrier", variables.id] })
      queryClient.invalidateQueries({ queryKey: ["vas", "dashboard"] })
    },
  })
}

export function useDeleteCarrier() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => vasClient.deleteCarrier(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vas", "carriers"] })
      queryClient.invalidateQueries({ queryKey: ["vas", "dashboard"] })
    },
  })
}
