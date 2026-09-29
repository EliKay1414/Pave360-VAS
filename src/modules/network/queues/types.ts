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
  status: "Healthy" | "Degraded" | "Stale"
  lastHeartbeat: string
}

export interface QueueTransaction {
  id: string
  sender: string
  destination: string
  encoding: string
  segments: number
  status: "Submitted" | "Delivered" | "Queued" | "Failed"
  created: string
}
