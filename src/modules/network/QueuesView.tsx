import * as React from "react"
import { useNetworkQueues } from "../../shared/hooks/useNetworkQueues"
import { env } from "../../shared/config/env"
import {
  type BackgroundWorker,
  type QueueTransaction,
  type QueueChannelMetric,
  type PipelineStage,
  DEFAULT_METRICS,
  DEFAULT_STAGES,
  DEFAULT_WORKERS,
  DEFAULT_TRANSACTIONS,
  QueuesHeader,
  QueuesMetricsCards,
  QueuesPipelineStages,
  QueuesWorkersTable,
  QueuesTransactionsTable,
  MessageQueueDetailModal,
} from "./queues"

export type { BackgroundWorker, QueueTransaction } from "./queues/types"

export function QueuesView() {
  const { data: queueData, isLoading, refetch, isFetching } = useNetworkQueues()
  const [selectedMessage, setSelectedMessage] = React.useState<QueueTransaction | null>(null)

  const displayedMetrics: QueueChannelMetric[] = React.useMemo(() => {
    if (!queueData) return DEFAULT_METRICS
    return [
      {
        id: "engine",
        title: "ENGINE",
        badge: queueData.provider || "InMemory",
        badgeType: "blue",
        value: queueData.provider || "InMemory",
        subtext: `SMPP: ${queueData.smppSubmitMode || "Live"}`,
      },
      {
        id: "outbound",
        title: "OUTBOUND",
        badgeType: "green-dot",
        value: queueData.submitDepth ?? 0,
        channelChip: queueData.submitQueueName || "sms.submit",
      },
      {
        id: "dlr",
        title: "DLR PIPELINE",
        badgeType: "green-dot",
        value: queueData.dlrDepth ?? 0,
        channelChip: queueData.dlrQueueName || "sms.dlr",
      },
      {
        id: "webhooks",
        title: "WEBHOOKS",
        badgeType: "green-dot",
        value: queueData.webhookDepth ?? 0,
        channelChip: queueData.webhookQueueName || "sms.webhook",
      },
      {
        id: "inbound",
        title: "INBOUND MO",
        badgeType: "green-dot",
        value: queueData.inboundDepth ?? 0,
        channelChip: queueData.inboundQueueName || "sms.inbound",
      },
      {
        id: "retry",
        title: "RETRY BUFFER",
        badge: `Max ${queueData.maxRetryAttempts ?? 3}`,
        badgeType: "gray",
        value: "—",
        channelChip: queueData.retryQueueName || "sms.retry",
      },
    ]
  }, [queueData])

  const displayedStages: PipelineStage[] = React.useMemo(() => {
    if (!queueData) return DEFAULT_STAGES
    return [
      { id: "queued", name: "QUEUED", count: queueData.queuedCount ?? 0, description: "Waiting for worker", color: "slate" },
      { id: "processing", name: "PROCESSING", count: queueData.processingCount ?? 0, description: "In carrier dispatch loop", color: "blue" },
      { id: "submitted", name: "SUBMITTED", count: queueData.submittedCount ?? 0, description: "Awaiting SMSC DLR", color: "indigo" },
      { id: "delivered", name: "DELIVERED", count: queueData.deliveredCount ?? 40, description: "Confirmed delivered", color: "emerald" },
      { id: "failed", name: "FAILED", count: queueData.failedCount ?? 9, description: "Rejected / Undelivered", color: "red" },
    ]
  }, [queueData])

  const displayedWorkers: BackgroundWorker[] = React.useMemo(() => {
    if (env.isLive && queueData?.workers && queueData.workers.length > 0) {
      return queueData.workers.map((w, idx) => ({
        id: String(idx + 1),
        name: w.name,
        role: w.role || "Background Worker",
        targetChannel: w.queueConsumed || "sms.submit",
        status: (w.isHealthy ? "Healthy" : "Degraded") as "Healthy" | "Degraded" | "Stale",
        lastHeartbeat: w.lastBeat ? new Date(w.lastBeat).toLocaleTimeString() : "Just now",
      }))
    }
    return DEFAULT_WORKERS
  }, [queueData])

  const displayedTransactions: QueueTransaction[] = React.useMemo(() => {
    if (env.isLive && queueData?.recentMessages && queueData.recentMessages.length > 0) {
      return queueData.recentMessages.map((m) => ({
        id: m.publicId,
        sender: m.source || "Pave360",
        destination: m.destination || "",
        encoding: m.encoding || "Gsm7",
        segments: m.segmentCount ?? 1,
        status: (m.status as any) || "Delivered",
        created: m.createdAt ? new Date(m.createdAt).toLocaleTimeString() : "Just now",
      }))
    }
    return DEFAULT_TRANSACTIONS
  }, [queueData])

  return (
    <div className="space-y-4 font-sans select-none pb-8">
      {/* 1. Engine Health, Provider, and Batch Telemetry Card */}
      <QueuesHeader
        onRefresh={() => refetch()}
        isFetching={isFetching}
        provider={queueData?.provider || "InMemory"}
        workerBatchDelayMs={queueData?.workerBatchDelayMs ?? 0}
        isHealthy={true}
      />

      {/* 2. Top Queue Depth Cards (6 columns in 1 row) */}
      <QueuesMetricsCards
        metrics={displayedMetrics}
        isLoading={env.isLive && isLoading && !queueData}
      />

      {/* 3. Message Lifecycle Pipeline Breakdown (5 colored top-bordered cards) */}
      <QueuesPipelineStages
        stages={displayedStages}
        isLoading={env.isLive && isLoading && !queueData}
      />

      {/* 4. Active Background Workers Table */}
      <QueuesWorkersTable
        workers={displayedWorkers}
        isLoading={env.isLive && isLoading && !queueData}
      />

      {/* 5. Recent Queue Traffic Table */}
      <QueuesTransactionsTable
        transactions={displayedTransactions}
        isLoading={env.isLive && isLoading && !queueData}
        onSelectMessage={(tx) => setSelectedMessage(tx)}
      />

      {/* Message Queue Detail Modal */}
      <MessageQueueDetailModal
        message={selectedMessage}
        onClose={() => setSelectedMessage(null)}
      />
    </div>
  )
}

export default QueuesView
