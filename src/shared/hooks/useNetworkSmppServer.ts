import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { vasClient } from "../services/vas/vasClient"
import type { SmppServerStatusResponse } from "../services/vas/types"

export function useSmppServerStatus() {
  return useQuery<SmppServerStatusResponse>({
    queryKey: ["vas", "smpp-server"],
    queryFn: () => vasClient.getSmppStatus(),
    staleTime: 3_000,
    refetchInterval: 5_000,
  })
}

export function useDisconnectSmppSession() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (sessionId: string) => vasClient.disconnectSmppSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vas", "smpp-server"] })
    },
  })
}
