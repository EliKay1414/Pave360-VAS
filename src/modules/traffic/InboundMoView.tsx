import * as React from "react"
import { InboundMessageDetailView } from "./InboundMessageDetailView"
import { InboundMoHeader } from "./inbound-mo/components/InboundMoHeader"
import { InboundMoTable } from "./inbound-mo/components/InboundMoTable"
import { SimulateInboundModal } from "./inbound-mo/components/SimulateInboundModal"
import { useInboundMo } from "../../shared/hooks/useInboundMo"
import { useQueryClient } from "@tanstack/react-query"
import type { InboundMessageRecord } from "./inbound-mo/types"
import type { InboundMessageItemViewModel } from "../../shared/services/vas/types"

export type { InboundMessageRecord } from "./inbound-mo/types"

export function InboundMoView() {
  const { data: remoteMessages, isLoading } = useInboundMo({ limit: 100 })
  const queryClient = useQueryClient()
  const [selectedMessage, setSelectedMessage] = React.useState<InboundMessageRecord | null>(() => {
    if (typeof window === "undefined") return null
    try {
      const params = new URLSearchParams(window.location.search)
      const idParam = params.get("messageId") || params.get("id")
      if (!idParam) return null
      return {
        id: idParam,
        from: "233241234567",
        to: "PAVE360",
        keyword: "STOP",
        body: "STOP",
        status: "Forwarded",
        received: "Just now",
        carrier: "AT Ghana SMSC",
      }
    } catch {
      return null
    }
  })
  const [isSimulateOpen, setIsSimulateOpen] = React.useState(false)

  // Map messages into clean table format
  const allMessages: InboundMessageRecord[] = React.useMemo(() => {
    if (remoteMessages && remoteMessages.length > 0) {
      return remoteMessages.map((m, idx) => ({
        id: m.id || `inb_${idx + 1}`,
        from: m.from || "—",
        to: m.to || "—",
        keyword: m.keyword || (m.body || m.message || "").trim().split(/\s+/)[0]?.toUpperCase() || "STOP",
        body: m.body || m.message || "STOP",
        status: m.status || "Forwarded",
        received: m.receivedAt || m.createdAt || "2026-09-25 14:30:25",
        carrier: m.carrier || "AT Ghana SMSC",
      }))
    }
    return [
      {
        id: "inb_373cbda43a0844aa",
        from: "233241234567",
        to: "PAVE360",
        keyword: "STOP",
        body: "STOP",
        status: "Forwarded",
        received: "2026-09-25 14:30:25",
        carrier: "AT Ghana SMSC",
      },
    ]
  }, [remoteMessages])

  // Deep-link query param synchronization
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const idParam = params.get("messageId") || params.get("id")
    if (idParam) {
      const found = allMessages.find((m) => m.id === idParam)
      if (found) {
        setSelectedMessage(found)
      } else {
        setSelectedMessage((prev) => (prev?.id === idParam ? prev : {
          id: idParam,
          from: "233241234567",
          to: "PAVE360",
          keyword: "STOP",
          body: "STOP",
          status: "Forwarded",
          received: "Just now",
          carrier: "AT Ghana SMSC",
        }))
      }
    }
  }, [allMessages])

  // Handle browser back/forward buttons
  React.useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search)
      const idParam = params.get("messageId") || params.get("id")
      if (idParam) {
        const found = allMessages.find((m) => m.id === idParam)
        setSelectedMessage(
          found || {
            id: idParam,
            from: "233241234567",
            to: "PAVE360",
            keyword: "STOP",
            body: "STOP",
            status: "Forwarded",
            received: "Just now",
            carrier: "AT Ghana SMSC",
          }
        )
      } else {
        setSelectedMessage(null)
      }
    }
    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [allMessages])

  const handleOpenMessage = (msg: InboundMessageRecord) => {
    setSelectedMessage(msg)
    const url = new URL(window.location.href)
    url.searchParams.set("messageId", msg.id)
    window.history.pushState({}, "", url.toString())
  }

  const handleBackFromDetail = () => {
    setSelectedMessage(null)
    const url = new URL(window.location.href)
    url.searchParams.delete("messageId")
    url.searchParams.delete("id")
    window.history.pushState({}, "", url.pathname + (url.search ? url.search : ""))
  }

  const handleSimulationSuccess = (_simulated: InboundMessageItemViewModel) => {
    queryClient.invalidateQueries({ queryKey: ["vas", "inbound-mo"] })
  }

  if (selectedMessage) {
    return (
      <InboundMessageDetailView
        message={selectedMessage as any}
        onBack={handleBackFromDetail}
      />
    )
  }

  return (
    <div className="space-y-4 font-sans select-none pb-8">
      <InboundMoHeader onSimulateInbound={() => setIsSimulateOpen(true)} />

      <InboundMoTable
        messages={allMessages}
        isLoading={isLoading}
        onSelectMessage={handleOpenMessage}
      />

      <SimulateInboundModal
        isOpen={isSimulateOpen}
        onClose={() => setIsSimulateOpen(false)}
        onSuccess={handleSimulationSuccess}
      />
    </div>
  )
}

export const TrafficInboundMoView = InboundMoView
export default InboundMoView
