import { useQuery } from "@tanstack/react-query"
import { vasClient } from "../services/vas/vasClient"
import type { QueueDashboardViewModel } from "../services/vas/types"

export function useNetworkQueues() {
  return useQuery<QueueDashboardViewModel>({
    queryKey: ["vas", "queues"],
    queryFn: () => vasClient.getQueues(),
    staleTime: 3_000,
    refetchInterval: 5_000,
  })
}
