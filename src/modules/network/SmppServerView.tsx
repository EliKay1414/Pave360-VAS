import * as React from "react"
import { toast } from "sonner"
import { SmppServerHeader } from "./smpp-server/components/SmppServerHeader"
import { SmppSessionsTable } from "./smpp-server/components/SmppSessionsTable"
import {
  useSmppServerStatus,
  useDisconnectSmppSession,
} from "../../shared/hooks/useNetworkSmppServer"
import { recordVasActivity } from "../../shared/lib/vasActivityStore"
import { env } from "../../shared/config/env"
import type { SmppSession } from "./smpp-server/types"

export type { SmppSession } from "./smpp-server/types"

function resolveAppPort(): string {
  if (typeof window !== "undefined" && window.location.port) {
    return window.location.port
  }
  return "2775"
}

export function SmppServerView() {
  const { data: serverStatus, isLoading, isFetching, refetch } = useSmppServerStatus()
  const disconnectMutation = useDisconnectSmppSession()
  const [port] = React.useState<string>(resolveAppPort)

  const displayedSessions: SmppSession[] = React.useMemo(() => {
    if (env.isLive && serverStatus?.activeSessions) {
      return serverStatus.activeSessions.map((s) => ({
        id: s.sessionId,
        systemId: s.systemId || "ESME_CLIENT",
        remoteEndpoint: s.remoteEndPoint || "127.0.0.1",
        bindState: (s.bindState?.toUpperCase() || "TRANSCEIVER") as any,
        submits: s.messagesSubmitted ?? 0,
        dlrs: s.messagesDelivered ?? 0,
        connectedAt: s.connectedAt ? new Date(s.connectedAt).toLocaleTimeString() : "—",
        lastActivity: s.lastActivityAt ? new Date(s.lastActivityAt).toLocaleTimeString() : "—",
      }))
    }
    return []
  }, [serverStatus])

  const activePort = serverStatus?.listeningPort ? String(serverStatus.listeningPort) : port
  const isRunning = serverStatus ? serverStatus.isRunning : true

  const handleDisconnect = async (session: SmppSession) => {
    if (!window.confirm(`Disconnect session '${session.systemId}' (${session.remoteEndpoint})?`)) return

    try {
      if (env.isLive) {
        await disconnectMutation.mutateAsync(session.id)
      }
      recordVasActivity({
        action: "smpp.disconnect",
        entity: "SmppSession",
        summary: `ESME session '${session.systemId}' forcefully unbound`,
      })
      toast.success(`Session '${session.systemId}' disconnected`)
    } catch (err: any) {
      toast.error(err?.message || "Failed to disconnect session")
    }
  }

  return (
    <div className="space-y-4 font-sans select-none pb-8">
      <SmppServerHeader
        isRunning={isRunning}
        listeningPort={activePort}
        onRefresh={() => refetch()}
        isFetching={isFetching}
      />

      <SmppSessionsTable
        sessions={displayedSessions}
        isLoading={env.isLive && isLoading}
        onDisconnect={handleDisconnect}
      />
    </div>
  )
}
