/** Core Pave360 VAS HTTP endpoints (relative paths). */
export const PAVE360_PATHS = {
  auth: {
    login: "/auth/login",
    verifyOtp: "/auth/verify-otp",
    refresh: "/auth/refresh-token",
    logout: "/auth/logout",
  },
  apiKeys: {
    list: "/api-keys",
    create: "/api-keys",
    revoke: (id: string) => `/api-keys/${id}/revoke`,
  },
  audit: {
    myLogs: "/audit/my-logs",
  },
  profile: {
    get: "/profile",
    update: "/profile",
  },
  telecom: {
    carriers: "/telecom/carriers",
    routes: "/telecom/routes",
    queues: "/telecom/queues",
    traffic: "/telecom/traffic/logs",
    dlrs: "/telecom/traffic/dlrs",
    senderIds: "/telecom/traffic/sender-ids",
  },
} as const
