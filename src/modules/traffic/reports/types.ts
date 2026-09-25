export interface LedgerRecord {
  id: string
  dateTime: string
  tenant: string
  category: "Normal" | "Transactional" | "Promotional" | string
  type: "Release" | "Reserve" | "Debit" | "Top-Up" | string
  amount: string
  balanceAfter: string
  segmentsRate: string
  reference: string
  description: string
}

export interface CarrierTelemetryRecord {
  network: string
  code: string
  totalTraffic: number
  delivered: number
  failed: number
  successRate: number
  avgLatency: string
}

export const TRANSACTION_TYPE_OPTIONS = [
  "All Types",
  "Debit (Prepaid)",
  "Postpaid Usage",
  "Reserve",
  "Release",
  "Top-Up",
] as const
