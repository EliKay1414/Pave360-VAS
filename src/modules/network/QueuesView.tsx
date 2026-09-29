import * as React from "react"
import { RotateCw, X } from "lucide-react"
import { useNetworkQueues } from "../../shared/hooks/useNetworkQueues"

export interface QueueChannelMetric {
  id: string
  title: string
  badge?: string
  badgeType?: "blue" | "gray" | "green-dot"
  value: string | number
  channelChip: string
  subtext?: string
}

export interface PipelineStage {
  id: string
  name: string
  count: number
  description: string
  color: "slate" | "blue" | "indigo" | "emerald" | "red"
}

export interface BackgroundWorker {
  id: string
  name: string
  role: string
  targetChannel: string
  status: "Healthy" | "Stale" | "Degraded"
  lastHeartbeat: string
}

export interface QueueTransaction {
  id: string
  sender: string
  destination: string
  encoding: string
  segments: number
  status: "Delivered" | "Queued" | "Submitted" | "Failed"
  created: string
}

const STORAGE_WORKERS_KEY = "pave360_vas_queue_workers"
const STORAGE_TRAFFIC_KEY = "pave360_vas_queue_traffic"
const STORAGE_METRICS_KEY = "pave360_vas_queue_metrics"

const DEFAULT_WORKERS: BackgroundWorker[] = [
  {
    id: "1",
    name: "MessageSubmissionWorker",
    role: "Outbound SMS Submission & Routing",
    targetChannel: "sms.submit",
    status: "Healthy",
    lastHeartbeat: "11:51:54",
  },
  {
    id: "2",
    name: "DeliveryReportWorker",
    role: "DLR Normalization & Status Resolution",
    targetChannel: "sms.dlr",
    status: "Healthy",
    lastHeartbeat: "11:51:54",
  },
  {
    id: "3",
    name: "WebhookWorker",
    role: "Tenant Webhook Dispatcher",
    targetChannel: "sms.webhook",
    status: "Healthy",
    lastHeartbeat: "11:51:54",
  },
  {
    id: "4",
    name: "InboundMessageWorker",
    role: "Mobile-Originated (MO) Inbound Parser",
    targetChannel: "sms.inbound",
    status: "Healthy",
    lastHeartbeat: "11:51:54",
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
    lastHeartbeat: "11:51:44",
  },
]

const DEFAULT_TRANSACTIONS: QueueTransaction[] = [
  { id: "msg_5c10ee3518774ad7", sender: "Pave360", destination: "233248985021", encoding: "Gsm7", segments: 1, status: "Delivered", created: "13:28:51" },
  { id: "msg_a2c621cb0ce14480", sender: "Pave360", destination: "233248985021", encoding: "Gsm7", segments: 1, status: "Delivered", created: "13:17:17" },
  { id: "msg_5c6bc185992b4ed9", sender: "Pave360", destination: "233248985021", encoding: "Gsm7", segments: 1, status: "Delivered", created: "01:04:25" },
  { id: "msg_98f608ceca5143ae", sender: "Pave360", destination: "233248985021", encoding: "Gsm7", segments: 1, status: "Delivered", created: "00:21:55" },
  { id: "msg_00621478c58b4590", sender: "Pave360", destination: "233248985021", encoding: "Gsm7", segments: 1, status: "Delivered", created: "00:21:33" },
  { id: "msg_ec70f5f3770d41aa", sender: "Pave360", destination: "233248985021", encoding: "Gsm7", segments: 1, status: "Delivered", created: "11:55:40" },
  { id: "msg_8d15fd56f5a94dde", sender: "Pave360", destination: "233248985021", encoding: "Gsm7", segments: 1, status: "Delivered", created: "11:55:30" },
  { id: "msg_7906f186a8734cce", sender: "Pave360", destination: "233248985021", encoding: "Gsm7", segments: 1, status: "Delivered", created: "11:55:13" },
  { id: "msg_e32a6069a2374c8d", sender: "Pave360", destination: "233248985021", encoding: "Gsm7", segments: 1, status: "Delivered", created: "11:54:59" },
  { id: "msg_0e1edj408e644391", sender: "Pave360", destination: "233248985021", encoding: "Gsm7", segments: 1, status: "Delivered", created: "11:50:56" },
]

export function QueuesView() {
  const { data: queueData, isFetching, refetch } = useNetworkQueues()
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const [selectedMessage, setSelectedMessage] = React.useState<QueueTransaction | null>(null)

  // Dynamic Provider & Batch details
  const providerInfo = React.useMemo(() => {
    return {
      engineState: "Engine Healthy",
      provider: queueData?.provider || "InMemory",
      workerBatch: `${queueData?.workerBatchDelayMs ?? 25}ms`,
      engineSubtitle: `SMPP: ${queueData?.smppSubmitMode || "Live"}`,
    }
  }, [queueData])

  // Pipeline stages counts
  const [pipelineStages] = React.useState<PipelineStage[]>([
    { id: "queued", name: "QUEUED", count: 0, description: "Waiting for worker", color: "slate" },
    { id: "processing", name: "PROCESSING", count: 0, description: "In carrier dispatch loop", color: "blue" },
    { id: "submitted", name: "SUBMITTED", count: 0, description: "Awaiting SMSC DLR", color: "indigo" },
    { id: "delivered", name: "DELIVERED", count: 16, description: "Confirmed delivered", color: "emerald" },
    { id: "failed", name: "FAILED", count: 6, description: "Rejected / Undelivered", color: "red" },
  ])

  const displayedStages = React.useMemo(() => {
    if (!queueData) return pipelineStages
    return [
      { id: "queued", name: "QUEUED", count: queueData.queuedCount ?? 0, description: "Waiting for worker", color: "slate" as const },
      { id: "processing", name: "PROCESSING", count: queueData.processingCount ?? 0, description: "In carrier dispatch loop", color: "blue" as const },
      { id: "submitted", name: "SUBMITTED", count: queueData.submittedCount ?? 0, description: "Awaiting SMSC DLR", color: "indigo" as const },
      { id: "delivered", name: "DELIVERED", count: queueData.deliveredCount ?? 16, description: "Confirmed delivered", color: "emerald" as const },
      { id: "failed", name: "FAILED", count: queueData.failedCount ?? 6, description: "Rejected / Undelivered", color: "red" as const },
    ]
  }, [queueData, pipelineStages])

  // Background Workers
  const [workers, setWorkers] = React.useState<BackgroundWorker[]>(DEFAULT_WORKERS)

  const displayedWorkers = React.useMemo(() => {
    if (queueData?.workers && queueData.workers.length > 0) {
      return queueData.workers.map((w, idx) => ({
        id: String(idx + 1),
        name: w.name,
        role: w.role || "Background Worker",
        targetChannel: w.queueConsumed || "sms.submit",
        status: (w.isHealthy ? "Healthy" : "Degraded") as "Healthy" | "Degraded" | "Stale",
        lastHeartbeat: w.lastBeat ? new Date(w.lastBeat).toLocaleTimeString() : "Just now",
      }))
    }
    return workers
  }, [queueData, workers])

  // Recent Queue Traffic
  const [transactions] = React.useState<QueueTransaction[]>(DEFAULT_TRANSACTIONS)

  const displayedTransactions = React.useMemo(() => {
    if (queueData?.recentMessages && queueData.recentMessages.length > 0) {
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
    return transactions
  }, [queueData, transactions])

  // Handle Refresh Action
  const handleRefresh = () => {
    refetch()
    setIsRefreshing(true)
    setTimeout(() => {
      const now = new Date()
      const timeStr = now.toTimeString().split(" ")[0]
      setWorkers((prev) =>
        prev.map((w) =>
          w.status === "Healthy" ? { ...w, lastHeartbeat: timeStr } : w
        )
      )
      setIsRefreshing(false)
    }, 400)
  }

  // Top metric cards
  const topMetrics: QueueChannelMetric[] = [
    {
      id: "engine",
      title: "ENGINE",
      badge: queueData?.provider || "InMemory",
      badgeType: "blue",
      value: queueData?.provider || "InMemory",
      channelChip: "",
      subtext: providerInfo.engineSubtitle,
    },
    {
      id: "outbound",
      title: "OUTBOUND",
      badgeType: "green-dot",
      value: queueData?.submitDepth ?? 0,
      channelChip: queueData?.submitQueueName || "sms.submit",
    },
    {
      id: "dlr",
      title: "DLR PIPELINE",
      badgeType: "green-dot",
      value: queueData?.dlrDepth ?? 0,
      channelChip: queueData?.dlrQueueName || "sms.dlr",
    },
    {
      id: "webhooks",
      title: "WEBHOOKS",
      badgeType: "green-dot",
      value: queueData?.webhookDepth ?? 0,
      channelChip: queueData?.webhookQueueName || "sms.webhook",
    },
    {
      id: "inbound",
      title: "INBOUND MO",
      badgeType: "green-dot",
      value: queueData?.inboundDepth ?? 0,
      channelChip: queueData?.inboundQueueName || "sms.inbound",
    },
    {
      id: "retry",
      title: "RETRY BUFFER",
      badge: `Max ${queueData?.maxRetryAttempts ?? 3}`,
      badgeType: "gray",
      value: "—",
      channelChip: queueData?.retryQueueName || "sms.retry",
    },
  ]

  // Color helper for stage borders
  const getStageBorderColor = (color: string) => {
    switch (color) {
      case "slate":
        return "border-t-slate-400"
      case "blue":
        return "border-t-blue-500"
      case "indigo":
        return "border-t-indigo-500"
      case "emerald":
        return "border-t-emerald-500"
      case "red":
        return "border-t-red-500"
      default:
        return "border-t-slate-300"
    }
  }

  const getStageTextColor = (color: string) => {
    switch (color) {
      case "slate":
        return "text-slate-600"
      case "blue":
        return "text-blue-600"
      case "indigo":
        return "text-indigo-600"
      case "emerald":
        return "text-emerald-600"
      case "red":
        return "text-red-600"
      default:
        return "text-slate-600"
    }
  }

  return (
    <div className="space-y-5 font-sans select-none pb-8">
      {/* 1. Page Description */}
      <p className="text-[13.5px] text-[#5b6e82] font-normal leading-normal pt-1">
        Asynchronous message pipelines, worker heartbeats, and queue depth metrics
      </p>

      {/* 2. Top Engine Status Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 px-5 py-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3 flex-wrap text-sm">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#eefaf3] text-[#059669] border border-[#a7f3d0]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
            {providerInfo.engineState}
          </span>
          <span className="text-slate-300 font-light">|</span>
          <span className="text-xs text-slate-500">
            Provider: <strong className="font-bold text-slate-900">{providerInfo.provider}</strong>
          </span>
          <span className="text-slate-400">·</span>
          <span className="text-xs text-slate-500">
            Worker Batch: <strong className="font-bold text-slate-900">{providerInfo.workerBatch}</strong>
          </span>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-[13px] font-semibold transition-colors cursor-pointer shadow-xs shrink-0 self-start sm:self-auto disabled:opacity-60"
        >
          <RotateCw className={`h-3.5 w-3.5 text-slate-600 ${isRefreshing ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* 3. Top Queue Metrics Row (6 Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {topMetrics.map((metric) => (
          <div
            key={metric.id}
            className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                {metric.title}
              </span>
              {metric.badge && metric.badgeType === "blue" && (
                <span className="bg-[#eff6ff] text-[#2563eb] text-[10px] font-bold px-2 py-0.5 rounded-md border border-blue-100">
                  {metric.badge}
                </span>
              )}
              {metric.badge && metric.badgeType === "gray" && (
                <span className="bg-slate-100 text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-slate-200">
                  {metric.badge}
                </span>
              )}
              {metric.badgeType === "green-dot" && (
                <span className="h-2 w-2 rounded-full bg-[#10b981]" />
              )}
            </div>

            <div className="text-2xl font-bold text-slate-900 mt-2.5">
              {metric.value}
            </div>

            <div className="mt-2.5">
              {metric.channelChip ? (
                <span className="bg-slate-50 text-slate-500 text-[11px] font-mono px-2 py-0.5 rounded border border-slate-100 inline-block">
                  {metric.channelChip}
                </span>
              ) : metric.subtext ? (
                <span className="text-xs text-slate-500">
                  {metric.subtext}
                </span>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      {/* 4. MESSAGE LIFECYCLE PIPELINE BREAKDOWN Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-between pb-1">
          <span className="text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
            MESSAGE LIFECYCLE PIPELINE BREAKDOWN
          </span>
          <span className="text-xs font-medium text-[#7c8ea2]">
            Live Stages
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-3">
          {displayedStages.map((stage) => (
            <div
              key={stage.id}
              className={`rounded-xl border border-slate-200 border-t-4 ${getStageBorderColor(
                stage.color
              )} p-4 bg-white shadow-xs`}
            >
              <div className={`text-[11px] font-bold tracking-wider uppercase ${getStageTextColor(stage.color)}`}>
                {stage.name}
              </div>
              <div className="text-3xl font-bold text-slate-900 mt-2">
                {stage.count}
              </div>
              <div className="text-xs text-slate-500 mt-2">
                {stage.description}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. ACTIVE BACKGROUND WORKERS Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="px-6 pt-5 pb-3 border-b border-slate-100 flex items-center justify-between">
          <span className="text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
            ACTIVE BACKGROUND WORKERS
          </span>
          <span className="text-xs font-medium text-[#7c8ea2]">
            {displayedWorkers.length} Workers Online
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-white">
                <th className="px-6 py-3.5 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                  WORKER NAME
                </th>
                <th className="px-6 py-3.5 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                  PIPELINE ROLE
                </th>
                <th className="px-6 py-3.5 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                  TARGET CHANNEL
                </th>
                <th className="px-6 py-3.5 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                  STATUS
                </th>
                <th className="px-6 py-3.5 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase text-right">
                  LAST HEARTBEAT
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayedWorkers.map((worker) => (
                <tr key={worker.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-3.5 whitespace-nowrap font-mono text-xs font-semibold text-slate-900">
                    {worker.name}
                  </td>
                  <td className="px-6 py-3.5 whitespace-nowrap text-slate-700 text-xs">
                    {worker.role}
                  </td>
                  <td className="px-6 py-3.5 whitespace-nowrap">
                    <span className="bg-slate-50 text-slate-600 text-[11px] font-mono px-2 py-0.5 rounded border border-slate-200">
                      {worker.targetChannel}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 whitespace-nowrap">
                    {worker.status === "Healthy" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#eefaf3] text-[#059669] border border-[#a7f3d0]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
                        Healthy
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                        {worker.status}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-3.5 whitespace-nowrap text-right font-mono text-xs text-slate-600">
                    {worker.lastHeartbeat}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. RECENT QUEUE TRAFFIC Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="px-6 pt-5 pb-3 border-b border-slate-100 flex items-center justify-between">
          <span className="text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
            RECENT QUEUE TRAFFIC
          </span>
          <span className="text-xs font-medium text-[#7c8ea2]">
            Last {transactions.length} transactions
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-white">
                <th className="px-6 py-3.5 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                  MESSAGE ID
                </th>
                <th className="px-6 py-3.5 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                  SENDER
                </th>
                <th className="px-6 py-3.5 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                  DESTINATION
                </th>
                <th className="px-6 py-3.5 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                  ENCODING
                </th>
                <th className="px-6 py-3.5 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                  SEGMENTS
                </th>
                <th className="px-6 py-3.5 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                  STATUS
                </th>
                <th className="px-6 py-3.5 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase text-right">
                  CREATED
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayedTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-3.5 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => setSelectedMessage(tx)}
                      className="font-mono text-xs font-medium text-[#0070f3] hover:underline cursor-pointer text-left"
                    >
                      {tx.id}
                    </button>
                  </td>
                  <td className="px-6 py-3.5 whitespace-nowrap font-medium text-slate-900 text-sm">
                    {tx.sender}
                  </td>
                  <td className="px-6 py-3.5 whitespace-nowrap font-mono text-xs text-slate-700">
                    {tx.destination}
                  </td>
                  <td className="px-6 py-3.5 whitespace-nowrap text-slate-700 text-xs">
                    {tx.encoding}
                  </td>
                  <td className="px-6 py-3.5 whitespace-nowrap text-slate-800 text-sm">
                    {tx.segments}
                  </td>
                  <td className="px-6 py-3.5 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#eefaf3] text-[#059669] border border-[#a7f3d0]">
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 whitespace-nowrap text-right font-mono text-xs text-slate-600">
                    {tx.created}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 7. Optional Message Detail Modal on Click */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-[1px] animate-in fade-in-0 duration-150 font-sans">
          <div className="relative w-full max-w-[500px] bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Message Queue Details
              </h3>
              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 border border-slate-300 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500 text-xs">Message ID:</span>
                <span className="font-mono text-xs font-semibold text-slate-900">{selectedMessage.id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500 text-xs">Sender ID:</span>
                <span className="font-semibold text-slate-900">{selectedMessage.sender}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500 text-xs">Destination:</span>
                <span className="font-mono text-xs text-slate-900">{selectedMessage.destination}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500 text-xs">Encoding / Segments:</span>
                <span className="text-slate-900">{selectedMessage.encoding} ({selectedMessage.segments} segment)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500 text-xs">Queue Status:</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-[#eefaf3] text-[#059669]">
                  {selectedMessage.status}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500 text-xs">Created At:</span>
                <span className="font-mono text-xs text-slate-700">{selectedMessage.created}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
                className="px-4 py-1.5 bg-[#005944] hover:bg-[#004837] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
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

export default QueuesView
