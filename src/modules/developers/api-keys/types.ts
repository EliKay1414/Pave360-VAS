export interface ApiKeyRecord {
  id: string
  name: string
  prefix: string
  secretKey?: string
  scopes: string[]
  mode: "Live" | "Test" | "Sandbox" | string
  status: "Active" | "Revoked" | string
  lastUsed: string
  tenant: string
  expiresAt?: string
  notes?: string
  createdAt?: string
}

export const ALL_SCOPES_LEFT = [
  "messages.read",
  "messages.cancel",
  "campaigns.create",
  "contacts.read",
  "webhooks.read",
  "senders.read",
  "ussd.read",
] as const

export const ALL_SCOPES_RIGHT = [
  "messages.send",
  "campaigns.read",
  "campaigns.send",
  "contacts.manage",
  "webhooks.manage",
  "billing.read",
  "ussd.send",
] as const

export const DEFAULT_CHECKED_SCOPES = [
  "messages.read",
  "messages.send",
]
