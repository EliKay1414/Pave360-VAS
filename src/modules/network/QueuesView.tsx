import * as React from "react"
import { QueuesHeader } from "./queues/components/QueuesHeader"
import { QueuesMetricsCards } from "./queues/components/QueuesMetricsCards"
import { QueuesPipelineStages } from "./queues/components/QueuesPipelineStages"
import { QueuesWorkersTable } from "./queues/components/QueuesWorkersTable"
import { QueuesTransactionsTable } from "./queues/components/QueuesTransactionsTable"
import { useNetworkQueues } from "../../shared/hooks/useNetworkQueues"
import { env } from "../../shared/config/env"
import type {
  QueueChannelMetric,
  PipelineStage,
  BackgroundWorker,
  QueueTransaction,
} from "./queues/types"

export type { BackgroundWorker, QueueTransaction } from "./queues/types"

const DEFAULT_METRICS: QueueChannelMetric[] = [
  { id: "submit", title: "SUBMIT QUEUE", badge: "Live", badgeType: "green-dot", value: 0, channelChip: "sms.submit", subtext: "depth" },
  { id: "retry", title: "RETRY BACKOFF", value: 0, channelChip: "sms.retry", subtext: "pending" },
  { id: "dlr", title: "DELIVERY RECEIPT", value: 0, channelChip: "sms.dlr", subtext: "in flight" },
  { id: "inbound", title: "INBOUND HANDSET", value: 0, channelChip: "sms.inbound", subtext: "queued" },
]

const DEFAULT_STAGES: PipelineStage[] = [
  { id: "queued", name: "QUEUED", count: 0, description: "Waiting for worker", color: "slate" },
  { id: "processing", name: "PROCESSING", count: 0, description: "In carrier dispatch loop", color: "blue" },
  { id: "submitted", name: "SUBMITTED", count: 0, description: "Awaiting SMSC DLR", color: "indigo" },
  { id: "delivered", name: "DELIVERED", count: 16, description: "Confirmed delivered", color: "emerald" },
  { id: "failed", name: "FAILED", count: 6, description: "Rejected / Undelivered", color: "red" },
]

export function QueuesView() {
  const { data: queueData, isLoading, refetch, isFetching } = useNetworkQueues()
  const [selectedMessage, setSelectedMessage] = React.useState<QueueTransaction | null>(null)

  const displayedMetrics: QueueChannelMetric[] = React.useMemo(() => {
    if (!queueData) return DEFAULT_METRICS
    return [
      { id: "submit", title: "SUBMIT QUEUE", badge: "Live", badgeType: "green-dot", value: queueData.submitDepth ?? 0, channelChip: queueData.submitQueueName || "sms.submit", subtext: "depth" },
      { id: "retry", title: "RETRY BACKOFF", value: queueData.dlrDepth ?? 0, channelChip: queueData.retryQueueName || "sms.retry", subtext: "pending" },
      { id: "dlr", title: "DELIVERY RECEIPT", value: queueData.webhookDepth ?? 0, channelChip: queueData.dlrQueueName || "sms.dlr", subtext: "in flight" },
      { id: "inbound", title: "INBOUND HANDSET", value: queueData.inboundDepth ?? 0, channelChip: queueData.inboundQueueName || "sms.inbound", subtext: "queued" },
    ]
  }, [queueData])

  const displayedStages: PipelineStage[] = React.useMemo(() => {
    if (!queueData) return DEFAULT_STAGES
    return [
      { id: "queued", name: "QUEUED", count: queueData.queuedCount ?? 0, description: "Waiting for worker", color: "slate" },
      { id: "processing", name: "PROCESSING", count: queueData.processingCount ?? 0, description: "In carrier dispatch loop", color: "blue" },
      { id: "submitted", name: "SUBMITTED", count: queueData.submittedCount ?? 0, description: "Awaiting SMSC DLR", color: "indigo" },
      { id: "delivered", name: "DELIVERED", count: queueData.deliveredCount ?? 0, description: "Confirmed delivered", color: "emerald" },
      { id: "failed", name: "FAILED", count: queueData.failedCount ?? 0, description: "Rejected / Undelivered", color: "red" },
    ]
  }, [queueData])

  const displayedWorkers: BackgroundWorker[] = React.useMemo(() => {
    if (env.isLive && queueData?.workers) {
      return queueData.workers.map((w, idx) => ({
        id: String(idx + 1),
        name: w.name,
        role: w.role || "Background Worker",
        targetChannel: w.queueConsumed || "sms.submit",
        status: (w.isHealthy ? "Healthy" : "Degraded") as "Healthy" | "Degraded" | "Stale",
        lastHeartbeat: w.lastBeat ? new Date(w.lastBeat).toLocaleTimeString() : "Just now",
      }))
    }
    return []
  }, [queueData])

  const displayedTransactions: QueueTransaction[] = React.useMemo(() => {
    if (env.isLive && queueData?.recentMessages) {
      return queueData.recentMessages.map((m) => ({
        id: m.publicId,
        sender: m.source || "Pave360",
        destination: m.destination || "",
        encoding: m.encoding || "Gsm7",
        segments: m.segmentCount ?? 1,
        status: (m.status as any) || "Submitted",
        created: m.createdAt ? new Date(m.createdAt).toLocaleTimeString() : "Just now",
      }))
    }
    return []
  }, [queueData])

  return (
    <div className="space-y-6 font-sans select-none pb-8">
      <QueuesHeader onRefresh={() => refetch()} isFetching={isFetching} />

      <QueuesMetricsCards
        metrics={displayedMetrics}
        isLoading={env.isLive && isLoading}
      />

      <QueuesPipelineStages
        stages={displayedStages}
        isLoading={env.isLive && isLoading}
      />

      <QueuesWorkersTable
        workers={displayedWorkers}
        isLoading={env.isLive && isLoading}
      />

      <QueuesTransactionsTable
        transactions={displayedTransactions}
        isLoading={env.isLive && isLoading}
        onSelectMessage={(tx) => setSelectedMessage(tx)}
      />

      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-[1px] animate-in fade-in-0 duration-150">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Message Queue Details</h3>
            <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs">
              <div><span className="font-semibold">ID:</span> {selectedMessage.id}</div>
              <div><span className="font-semibold">Destination:</span> {selectedMessage.destination}</div>
              <div><span className="font-semibold">Status:</span> {selectedMessage.status}</div>
              <div><span className="font-semibold">Segments:</span> {selectedMessage.segments}</div>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
