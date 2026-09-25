import type { ApiKeyRecord } from "./types"

export const INITIAL_API_KEYS: ApiKeyRecord[] = [
  {
    id: "key_01",
    name: "Harrison Test API",
    prefix: "pk_live_1800cb88...",
    secretKey: "vas_live_sec_1800cb88e429ff10a8b944c66ef21099",
    scopes: [
      "messages.read",
      "messages.send",
      "messages.cancel",
      "campaigns.read",
      "campaigns.create",
      "campaigns.send",
    ],
    mode: "Live",
    status: "Active",
    lastUsed: "2026-09-25 11:55:27Z",
    tenant: "Pave360",
    createdAt: "2026-09-01 10:00:00Z",
  },
  {
    id: "key_02",
    name: "AT Ghana SMSC",
    prefix: "pk_live_6e7e57d6...",
    secretKey: "vas_live_sec_6e7e57d6b389fe91a011de44cc108871",
    scopes: [
      "messages.read",
      "messages.send",
      "messages.cancel",
      "campaigns.read",
      "campaigns.create",
      "campaigns.send",
    ],
    mode: "Live",
    status: "Active",
    lastUsed: "2026-09-22 11:39:24Z",
    tenant: "Pave360",
    createdAt: "2026-09-05 14:30:00Z",
  },
]
