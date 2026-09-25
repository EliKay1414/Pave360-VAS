export interface WebhookRecord {
  id: string
  name: string
  url: string
  event: string
  secret: string
  status: "Active" | "Disabled" | string
  failures: number
  maxAttempts: number
  timeoutSeconds: number
  enabled: boolean
  createdAt?: string
}

export const EVENT_TYPES = [
  "DeliveryReport",
  "InboundMessage",
  "UssdSession",
  "AllEvents",
] as const
