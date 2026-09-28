import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { vasClient } from "../services/vas/vasClient"
import type {
  MessageQueryParams,
  SendMessageRequest,
  SendBulkMessageRequest,
} from "../services/vas/types"
import type { MessageTrafficLog } from "../../modules/traffic/TrafficLogsView"
import { env } from "../config/env"

export interface UseMessagingTrafficParams {
  status?: string
  category?: string
  destination?: string
  source?: string
  page?: number
  pageSize?: number
}

function mapApiItemToLog(item: any): MessageTrafficLog {
  return {
    id: item.id || `msg_${Math.random().toString(36).substring(2, 10)}`,
    category: item.category || "Normal",
    from: item.from || item.source || item.senderId || "Pave360",
    to: item.to || item.destination || "",
    status: item.status || "Submitted",
    encoding: item.encoding || "Gsm7",
    segments: Number(item.segments || item.segmentCount || 1),
    carrier: item.carrier || item.carrierName || "AT Ghana SMSC",
    createdUtc: item.createdUtc || item.createdAt || new Date().toISOString(),
    errorReason: item.errorReason || item.failureReason || item.lastError,
  }
}

export function useMessagingTraffic(params: UseMessagingTrafficParams = {}) {
  const queryClient = useQueryClient()

  const apiParams: MessageQueryParams = {
    status: params.status && params.status !== "All Statuses" ? params.status : undefined,
    category: params.category && params.category !== "All Categories" ? params.category : undefined,
    destination: params.destination ? params.destination.trim() : undefined,
    source: params.source ? params.source.trim() : undefined,
    page: params.page ?? 1,
    pageSize: params.pageSize ?? 25,
  }

  const query = useQuery<MessageTrafficLog[]>({
    queryKey: ["vas", "messages", apiParams],
    queryFn: async () => {
      const res = await vasClient.getMessages(apiParams)
      if (Array.isArray(res)) {
        return res.map(mapApiItemToLog)
      }
      if (res && Array.isArray((res as any).items)) {
        return (res as any).items.map(mapApiItemToLog)
      }
      if (res && Array.isArray((res as any).data)) {
        return (res as any).data.map(mapApiItemToLog)
      }
      return []
    },
    enabled: env.isLive,
    staleTime: 5000,
    refetchInterval: 15000, // Poll traffic logs every 15s
    retry: 1,
  })

  return {
    logs: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isLive: Boolean(query.data && !query.isError),
    error: query.error,
    refetch: query.refetch,
  }
}

export function useMessageDetail(id: string | null) {
  return useQuery({
    queryKey: ["vas", "message-detail", id],
    queryFn: () => (id ? vasClient.getMessageDetail(id) : null),
    enabled: Boolean(id && env.isLive),
    staleTime: 10000,
  })
}

export function useSendMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: { message: SendMessageRequest; idempotencyKey?: string }) =>
      vasClient.sendMessage(payload.message, payload.idempotencyKey),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vas", "messages"] })
      queryClient.invalidateQueries({ queryKey: ["vas", "dashboard"] })
    },
  })
}

export function useSendBulkMessages() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: SendBulkMessageRequest) => vasClient.sendBulkMessages(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vas", "messages"] })
      queryClient.invalidateQueries({ queryKey: ["vas", "dashboard"] })
    },
  })
}

export function useUploadBatchMessages() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (formData: FormData) => vasClient.uploadBatchMessages(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vas", "messages"] })
      queryClient.invalidateQueries({ queryKey: ["vas", "dashboard"] })
    },
  })
}
