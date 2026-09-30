import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { vasClient } from "../services/vas/vasClient"
import type { SystemSettingItemViewModel, SystemSettingFormViewModel } from "../services/vas/types"
import { env } from "../config/env"
import { useAppSelector } from "../store"
import { QUERY_CONFIG, stopPollingOnAuthError } from "../lib/queryClient"

export function useSystemSettings() {
  const signedIn = useAppSelector((state) => state.auth.signedIn)

  return useQuery<SystemSettingItemViewModel[]>({
    queryKey: ["vas", "settings"],
    queryFn: () => vasClient.getSystemSettings(),
    enabled: env.isLive && signedIn,
    staleTime: QUERY_CONFIG.standard.staleTime,
    gcTime: QUERY_CONFIG.standard.gcTime,
    refetchInterval: stopPollingOnAuthError(QUERY_CONFIG.standard.refetchInterval),
  })
}

export function useSystemSettingDetail(id?: string) {
  const signedIn = useAppSelector((state) => state.auth.signedIn)

  return useQuery<SystemSettingItemViewModel>({
    queryKey: ["vas", "setting", id],
    queryFn: () => vasClient.getSystemSetting(id!),
    enabled: Boolean(id && env.isLive && signedIn),
    staleTime: QUERY_CONFIG.standard.staleTime,
    gcTime: QUERY_CONFIG.standard.gcTime,
  })
}

export function useCreateSystemSetting() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: SystemSettingFormViewModel) => vasClient.createSystemSetting(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vas", "settings"] })
    },
  })
}

export function useUpdateSystemSetting() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: SystemSettingFormViewModel }) =>
      vasClient.updateSystemSetting(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["vas", "settings"] })
      queryClient.invalidateQueries({ queryKey: ["vas", "setting", variables.id] })
    },
  })
}
