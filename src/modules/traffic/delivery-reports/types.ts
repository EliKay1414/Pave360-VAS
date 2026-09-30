export interface DeliveryReportRecord {
  id: string
  tenant: string
  carrier: string
  carrierMsgId: string
  status: "Delivered" | "Failed" | "Expired" | "Rejected" | "Accepted" | "Unknown" | string
  error: string
  latency: string
  received: string
  timeline?: {
    stage: string
    timestamp: string
    status: "done" | "failed" | "pending"
    detail?: string
  }[]
}

export const DLR_STATUS_OPTIONS = [
  "All",
  "Delivered",
  "Failed",
  "Expired",
  "Rejected",
  "Accepted",
  "Unknown",
] as const
