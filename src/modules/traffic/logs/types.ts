export interface MessageTrafficLog {
  id: string
  category: "Normal" | "Transactional" | "Promotional" | "Customized" | "Bulk" | "Scheduled" | string
  from: string
  to: string
  status: "Queued" | "Submitted" | "Accepted" | "Delivered" | "Failed" | string
  encoding: string
  segments: number
  carrier: string
  createdUtc: string
  errorReason?: string
}

/**
 * Exact order from user screenshot media_1790340378114.png
 */
export const STATUS_DROPDOWN_OPTIONS = [
  "All Statuses",
  "Queued",
  "Submitted",
  "Accepted",
  "Delivered",
  "Failed",
] as const

/**
 * Exact order from user screenshot media_1790340385528.png
 */
export const CATEGORY_DROPDOWN_OPTIONS = [
  "All Categories",
  "Normal",
  "Transactional",
  "Promotional",
  "Customized",
  "Bulk",
  "Scheduled",
] as const
