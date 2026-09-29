import * as React from "react"
import { InboundMessageDetailView } from "./InboundMessageDetailView"
import { InboundMoHeader } from "./inbound-mo/components/InboundMoHeader"
import { InboundMoTable } from "./inbound-mo/components/InboundMoTable"
import { useInboundMo } from "../../shared/hooks/useInboundMo"
import { env } from "../../shared/config/env"
import type { InboundMessageRecord } from "./inbound-mo/types"

export type { InboundMessageRecord } from "./inbound-mo/types"

export function InboundMoView() {
  const { data: remoteMessages, isLoading, isFetching, refetch } = useInboundMo({ limit: 100 })
  const [selectedMessage, setSelectedMessage] = React.useState<InboundMessageRecord | null>(null)
  const [searchQuery, setSearchQuery] = React.useState("")

  // Direct remote messages mapping: eliminates mock flash on page refresh
  const allMessages: InboundMessageRecord[] = React.useMemo(() => {
    if (env.isLive && remoteMessages) {
      return remoteMessages.map((m, idx) => ({
        id: m.id || `inb_${idx + 1}`,
        from: m.from || "—",
        to: m.to || "—",
        keyword: m.keyword || (m.body || m.message || "").trim().split(/\s+/)[0]?.toUpperCase() || "—",
        body: m.body || m.message || "",
        status: m.status || "Forwarded",
        received: m.receivedAt || m.createdAt ? new Date(m.receivedAt || m.createdAt!).toLocaleString() : "—",
        carrier: m.carrier,
      }))
    }
    return []
  }, [remoteMessages])

  // Filter messages based on search input
  const filteredMessages = React.useMemo(() => {
    if (!searchQuery.trim()) return allMessages
    const q = searchQuery.toLowerCase().trim()
    return allMessages.filter(
      (m) =>
        m.from.toLowerCase().includes(q) ||
        m.to.toLowerCase().includes(q) ||
        m.keyword.toLowerCase().includes(q) ||
        m.body.toLowerCase().includes(q) ||
        m.id.toLowerCase().includes(q)
    )
  }, [allMessages, searchQuery])

  // Deep-link query param synchronization
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const idParam = params.get("messageId") || params.get("id")
    if (idParam && allMessages.length > 0) {
      const found = allMessages.find((m) => m.id === idParam)
      if (found) setSelectedMessage(found)
    }
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
      <InboundMoHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onRefresh={() => refetch()}
        isFetching={isFetching}
      />

      <InboundMoTable
        messages={filteredMessages}
        isLoading={env.isLive && isLoading}
        onSelectMessage={handleOpenMessage}
      />
    </div>
  )
}

export const TrafficInboundMoView = InboundMoView
export default InboundMoView
