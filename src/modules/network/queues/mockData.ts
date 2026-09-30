import type {
  QueueChannelMetric,
  PipelineStage,
  BackgroundWorker,
  QueueTransaction,
} from "./types"

export const DEFAULT_METRICS: QueueChannelMetric[] = [
  { id: "engine", title: "ENGINE", badge: "InMemory", badgeType: "blue", value: "InMemory", subtext: "SMPP: Live" },
  { id: "outbound", title: "OUTBOUND", badgeType: "green-dot", value: 0, channelChip: "sms.submit" },
  { id: "dlr", title: "DLR PIPELINE", badgeType: "green-dot", value: 0, channelChip: "sms.dlr" },
  { id: "webhooks", title: "WEBHOOKS", badgeType: "green-dot", value: 0, channelChip: "sms.webhook" },
  { id: "inbound", title: "INBOUND MO", badgeType: "green-dot", value: 0, channelChip: "sms.inbound" },
  { id: "retry", title: "RETRY BUFFER", badge: "Max 3", badgeType: "gray", value: "—", channelChip: "sms.retry" },
]

export const DEFAULT_STAGES: PipelineStage[] = [
  { id: "queued", name: "QUEUED", count: 0, description: "Waiting for worker", color: "slate" },
  { id: "processing", name: "PROCESSING", count: 0, description: "In carrier dispatch loop", color: "blue" },
  { id: "submitted", name: "SUBMITTED", count: 0, description: "Awaiting SMSC DLR", color: "indigo" },
  { id: "delivered", name: "DELIVERED", count: 40, description: "Confirmed delivered", color: "emerald" },
  { id: "failed", name: "FAILED", count: 9, description: "Rejected / Undelivered", color: "red" },
]

export const DEFAULT_WORKERS: BackgroundWorker[] = [
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

export const DEFAULT_TRANSACTIONS: QueueTransaction[] = [
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
  { id: "msg_90a5fe04f98144b2", sender: "Pave360", destination: "233556805991", encoding: "Gsm7", segments: 1, status: "Delivered", created: "12:07:20" },
  { id: "msg_e8140f7b11544280", sender: "Pave360", destination: "233248985021", encoding: "Gsm7", segments: 1, status: "Delivered", created: "12:06:58" },
  { id: "msg_308b34cce461427c", sender: "Pave360", destination: "233248985021", encoding: "Gsm7", segments: 1, status: "Delivered", created: "12:06:31" },
  { id: "msg_b6352932bb8242db", sender: "Pave360", destination: "233556805991", encoding: "Gsm7", segments: 1, status: "Delivered", created: "12:06:15" },
  { id: "msg_61f0df9ecfef4c0d", sender: "Pave360", destination: "233248985021", encoding: "Gsm7", segments: 1, status: "Delivered", created: "12:05:49" },
]
