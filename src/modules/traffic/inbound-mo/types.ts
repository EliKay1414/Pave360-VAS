export interface InboundMessageRecord {
  id: string
  from: string
  to: string
  keyword: string
  body: string
  status: "Forwarded" | "Processed" | "Received" | string
  received: string
  carrier?: string
  notes?: string
}
