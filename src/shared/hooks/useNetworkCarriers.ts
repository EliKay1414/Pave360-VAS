import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { vasClient } from "../services/vas/vasClient"
import type { CarrierListItemViewModel, CarrierFormViewModel } from "../services/vas/types"

export function useCarriers() {
  return useQuery<CarrierListItemViewModel[]>({
    queryKey: ["vas", "carriers"],
    queryFn: () => vasClient.getCarriers(),
    staleTime: 10_000,
    refetchInterval: 30_000,
  })
}

export function useCarrierDetail(id?: string) {
  return useQuery<CarrierFormViewModel>({
    queryKey: ["vas", "carrier", id],
    queryFn: () => vasClient.getCarrier(id!),
    enabled: Boolean(id),
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
