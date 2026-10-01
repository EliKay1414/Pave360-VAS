import * as React from "react"
import { toast } from "sonner"
import { UssdSessionDetailView } from "./UssdSessionDetailView"
import { UssdSessionsHeader } from "./ussd/components/UssdSessionsHeader"
import {
  UssdSessionsTable,
  type UssdSessionRecord,
} from "./ussd/components/UssdSessionsTable"
import {
  UssdNotifyModal,
  type UssdNotifyFormData,
} from "./ussd/components/UssdNotifyModal"
import { useUssdSessions, useSendUssdNotify } from "../../shared/hooks/useUssdGateway"
import { recordVasActivity } from "../../shared/lib/vasActivityStore"
import { env } from "../../shared/config/env"

export { type UssdSessionRecord } from "./ussd/components/UssdSessionsTable"

export interface UssdSessionsViewProps {
  initialNotifyOpen?: boolean
}

export function UssdSessionsView({ initialNotifyOpen = false }: UssdSessionsViewProps) {
  const { data: remoteSessions, isLoading, refetch, isFetching } = useUssdSessions()
  const notifyMutation = useSendUssdNotify()

  const [localSessions, setLocalSessions] = React.useState<UssdSessionRecord[]>(() => {
    try {
      const saved = localStorage.getItem("pave360_vas_ussd_sessions")
      if (saved) return JSON.parse(saved)
    } catch {}
    return []
  })

  // Selected session for full-screen detail inspection
  const [selectedSession, setSelectedSession] = React.useState<UssdSessionRecord | null>(() => {
    if (typeof window === "undefined") return null
    try {
      const params = new URLSearchParams(window.location.search)
      const idParam = params.get("sessionId") || params.get("id")
      if (!idParam) return null
      return {
        id: idParam,
        kind: "USSN",
        msisdn: "233241234567",
        starCode: "*714#",
        status: "Delivered",
        text: "USSD session transaction",
        when: new Date().toLocaleString(),
        ackRequested: true,
        cost: "0.0200 GHS",
      }
    } catch {
      return null
    }
  })
  const [isNotifyOpen, setIsNotifyOpen] = React.useState(initialNotifyOpen)

  // Direct remote sessions mapping; no fallback to mock when live data is loading
  const displayedSessions: UssdSessionRecord[] = React.useMemo(() => {
    if (env.isLive && remoteSessions) {
      return remoteSessions.map((s, idx) => ({
        id: s.sessionId || `ussd_${idx + 1}`,
        kind: (s.type === "init" || s.type === "continue" ? "USSR" : s.type) || "USSN",
        msisdn: s.msisdn,
        starCode: s.serviceCode || "*384#",
        status: s.status || "Delivered",
        text: s.text || s.message || "USSD session transaction",
        when: s.startedAt || s.when || new Date().toLocaleString(),
        ackRequested: s.ackRequested ?? true,
        cost: s.cost || "0.0200 GHS",
      }))
    }
    return localSessions
  }, [remoteSessions, localSessions])

  // URL query param synchronization
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const idParam = params.get("sessionId") || params.get("id")
    if (idParam) {
      const found = displayedSessions.find((s) => s.id === idParam)
      if (found) {
        setSelectedSession(found)
      } else {
        setSelectedSession((prev) => (prev?.id === idParam ? prev : {
          id: idParam,
          kind: "USSN",
          msisdn: "233241234567",
          starCode: "*714#",
          status: "Delivered",
          text: "USSD session transaction",
          when: new Date().toLocaleString(),
          ackRequested: true,
          cost: "0.0200 GHS",
        }))
      }
    }
  }, [displayedSessions])

  const saveLocalSessions = (list: UssdSessionRecord[]) => {
    setLocalSessions(list)
    try {
      localStorage.setItem("pave360_vas_ussd_sessions", JSON.stringify(list))
    } catch {}
  }

  const handleSendNotify = async (formData: UssdNotifyFormData) => {
    try {
      if (env.isLive) {
        await notifyMutation.mutateAsync({
          msisdn: formData.msisdn.trim(),
          message: formData.messageText.trim(),
        })
      }

      const newRecord: UssdSessionRecord = {
        id: `ussn_${Date.now().toString(36)}`,
        kind: "USSN",
        msisdn: formData.msisdn.trim(),
        starCode: "*714#",
        status: "Delivered",
        text: formData.messageText.trim(),
        when: new Date().toLocaleString(),
        ackRequested: formData.waitAck,
        cost: "0.0200 GHS",
      }

      saveLocalSessions([newRecord, ...localSessions])
      recordVasActivity({
        action: "ussd.notify",
        entity: "USSD",
        summary: `USSD push alert dispatched to ${formData.msisdn.trim()}`,
      })
      toast.success(`USSD notification pushed to ${formData.msisdn.trim()}`)
      setIsNotifyOpen(false)
    } catch (err: any) {
      toast.error(err?.message || "Failed to dispatch USSD notification")
    }
  }

  const handleSelectSession = (s: UssdSessionRecord) => {
    setSelectedSession(s)
    const url = new URL(window.location.href)
    url.searchParams.set("sessionId", s.id)
    window.history.pushState({}, "", url.toString())
  }

  const handleBackFromDetail = () => {
    setSelectedSession(null)
    const url = new URL(window.location.href)
    url.searchParams.delete("sessionId")
    url.searchParams.delete("id")
    window.history.pushState({}, "", url.pathname + (url.search ? url.search : ""))
  }

  if (selectedSession) {
    return (
      <UssdSessionDetailView
        session={selectedSession}
        onBack={handleBackFromDetail}
      />
    )
  }

  return (
    <div className="space-y-4 font-sans select-none pb-8">
      <UssdSessionsHeader
        onOpenNotify={() => setIsNotifyOpen(true)}
        onRefresh={() => refetch()}
        isFetching={isFetching}
      />

      <UssdSessionsTable
        sessions={displayedSessions}
        isLoading={env.isLive && isLoading}
        onSelectSession={handleSelectSession}
      />

      <UssdNotifyModal
        isOpen={isNotifyOpen}
        onClose={() => setIsNotifyOpen(false)}
        onSubmit={handleSendNotify}
        isSubmitting={notifyMutation.isPending}
      />
    </div>
  )
}
