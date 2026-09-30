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
  { id: "engine", title: "ENGINE", badge: "InMemory", badgeType: "blue", value: "InMemory", subtext: "SMPP: Live" },
  { id: "outbound", title: "OUTBOUND", badgeType: "green-dot", value: 0, channelChip: "sms.submit" },
  { id: "dlr", title: "DLR PIPELINE", badgeType: "green-dot", value: 0, channelChip: "sms.dlr" },
  { id: "webhooks", title: "WEBHOOKS", badgeType: "green-dot", value: 0, channelChip: "sms.webhook" },
  { id: "inbound", title: "INBOUND MO", badgeType: "green-dot", value: 0, channelChip: "sms.inbound" },
  { id: "retry", title: "RETRY BUFFER", badge: "Max 3", badgeType: "gray", value: "—", channelChip: "sms.retry" },
]

const DEFAULT_STAGES: PipelineStage[] = [
  { id: "queued", name: "QUEUED", count: 0, description: "Waiting for worker", color: "slate" },
  { id: "processing", name: "PROCESSING", count: 0, description: "In carrier dispatch loop", color: "blue" },
  { id: "submitted", name: "SUBMITTED", count: 0, description: "Awaiting SMSC DLR", color: "indigo" },
  { id: "delivered", name: "DELIVERED", count: 40, description: "Confirmed delivered", color: "emerald" },
  { id: "failed", name: "FAILED", count: 9, description: "Rejected / Undelivered", color: "red" },
]

const DEFAULT_WORKERS: BackgroundWorker[] = [
  {
    id: "1",
    name: "MessageSubmissionWorker",
    role: "Outbound SMS Submission & Routing",
    targetChannel: "sms.submit",
    status: "Healthy",
    lastHeartbeat: "16:55:08",
  },
  {
    id: "2",
    name: "DeliveryReportWorker",
    role: "DLR Normalization & Status Resolution",
    targetChannel: "sms.dlr",
    status: "Healthy",
    lastHeartbeat: "16:55:08",
  },
  {
    id: "3",
    name: "WebhookWorker",
    role: "Tenant Webhook Dispatcher",
    targetChannel: "sms.webhook",
    status: "Healthy",
    lastHeartbeat: "16:55:08",
  },
  {
    id: "4",
    name: "InboundMessageWorker",
    role: "Mobile-Originated (MO) Inbound Parser",
    targetChannel: "sms.inbound",
    status: "Healthy",
    lastHeartbeat: "16:55:08",
  },
  {
    id: "5",
    name: "ScheduledMessageWorker",
    role: "Scheduled Campaigns & Future Broadcasts",
    targetChannel: "Internal Timer",
    status: "Stale",
    lastHeartbeat: "Active",
  },
  {
    id: "6",
    name: "AlertEvaluatorWorker",
    role: "Health & Threshold Alert Rule Engine",
    targetChannel: "Monitoring Loop",
    status: "Healthy",
    lastHeartbeat: "16:55:05",
  },
]

const DEFAULT_TRANSACTIONS: QueueTransaction[] = [
  { id: "msg_bfd4bd82f70f4002", sender: "Pave360", destination: "233556805991", encoding: "Gsm7", segments: 1, status: "Delivered", created: "12:41:01" },
  { id: "msg_8639e1a5a5a24e52", sender: "Pave360", destination: "233248985021", encoding: "Gsm7", segments: 1, status: "Delivered", created: "12:41:01" },
  { id: "msg_9d2ef3bb2c8b49aa", sender: "Pave360", destination: "233556805991", encoding: "Gsm7", segments: 1, status: "Delivered", created: "12:40:38" },
  { id: "msg_d03b8d4409b74681", sender: "Pave360", destination: "233248985021", encoding: "Gsm7", segments: 1, status: "Delivered", created: "12:40:38" },
  { id: "msg_ce12441b2ff44f04", sender: "Pave360", destination: "233248985021", encoding: "Gsm7", segments: 1, status: "Delivered", created: "12:40:05" },
  { id: "msg_007d5b2fd78e434d", sender: "Pave360", destination: "233248985021", encoding: "Gsm7", segments: 1, status: "Delivered", created: "12:39:56" },
  { id: "msg_14c80a4ba4c54dff", sender: "Pave360", destination: "233248985021", encoding: "Gsm7", segments: 1, status: "Delivered", created: "12:11:47" },
  { id: "msg_75024678d95c43b5", sender: "Pave360", destination: "233556805991", encoding: "Gsm7", segments: 1, status: "Delivered", created: "12:11:09" },
  { id: "msg_cb1d9f5aff554b64", sender: "Pave360", destination: "233556805991", encoding: "Gsm7", segments: 1, status: "Delivered", created: "12:09:47" },
  { id: "msg_e99928f16df248d9", sender: "Pave360", destination: "233556805991", encoding: "Gsm7", segments: 1, status: "Delivered", created: "12:09:39" },
  { id: "msg_f32998a44b1c4103", sender: "Pave360", destination: "233248985021", encoding: "Gsm7", segments: 1, status: "Delivered", created: "12:09:12" },
  { id: "msg_a831e50a98d3493e", sender: "Pave360", destination: "233556805991", encoding: "Gsm7", segments: 1, status: "Delivered", created: "12:08:55" },
  { id: "msg_44c107e324ef4b0c", sender: "Pave360", destination: "233248985021", encoding: "Gsm7", segments: 1, status: "Delivered", created: "12:08:33" },
  { id: "msg_7e3bc57b56d34e2e", sender: "Pave360", destination: "233556805991", encoding: "Gsm7", segments: 1, status: "Delivered", created: "12:08:01" },
  { id: "msg_182ecb8b3dbb4819", sender: "Pave360", destination: "233248985021", encoding: "Gsm7", segments: 1, status: "Delivered", created: "12:07:44" },
  { id: "msg_90a5fe04f98144b2", sender: "Pave360", destination: "233556805991", encoding: "Gsm7", segments: 1, status: "Delivered", created: "12:07:20" },
  { id: "msg_e8140f7b11544280", sender: "Pave360", destination: "233248985021", encoding: "Gsm7", segments: 1, status: "Delivered", created: "12:06:58" },
  { id: "msg_308b34cce461427c", sender: "Pave360", destination: "233248985021", encoding: "Gsm7", segments: 1, status: "Delivered", created: "12:06:31" },
  { id: "msg_b6352932bb8242db", sender: "Pave360", destination: "233556805991", encoding: "Gsm7", segments: 1, status: "Delivered", created: "12:06:15" },
  { id: "msg_61f0df9ecfef4c0d", sender: "Pave360", destination: "233248985021", encoding: "Gsm7", segments: 1, status: "Delivered", created: "12:05:49" },
]

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
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-[1px] animate-in fade-in-0 duration-150">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Message Queue Details</h3>
            <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs">
              <div><span className="font-semibold text-slate-700">Message ID:</span> <span className="font-mono text-[#0070f3]">{selectedMessage.id}</span></div>
              <div><span className="font-semibold text-slate-700">Sender:</span> <span className="font-medium text-slate-900">{selectedMessage.sender}</span></div>
              <div><span className="font-semibold text-slate-700">Destination:</span> <span className="font-mono text-slate-800">{selectedMessage.destination}</span></div>
              <div><span className="font-semibold text-slate-700">Encoding:</span> <span className="text-slate-800">{selectedMessage.encoding}</span></div>
              <div><span className="font-semibold text-slate-700">Segments:</span> <span className="text-slate-800">{selectedMessage.segments}</span></div>
              <div><span className="font-semibold text-slate-700">Status:</span> <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#eefaf3] text-[#059669] border border-[#a7f3d0]">{selectedMessage.status}</span></div>
              <div><span className="font-semibold text-slate-700">Created:</span> <span className="font-mono text-slate-600">{selectedMessage.created}</span></div>
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
