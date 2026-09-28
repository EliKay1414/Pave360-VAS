/**
 * Pave360 VAS Dedicated Backend Endpoint Paths
 * Used to communicate directly with VITE_VAS_API_URL
 */
export const VAS_PATHS = {
  auth: {
    login: "/api/v1/auth/login",
    logout: "/api/v1/auth/logout",
    me: "/api/v1/auth/me",
    changePassword: "/api/v1/auth/change-password",
  },
  dashboard: {
    metrics: "/api/v1/dashboard/metrics",
    carrierStatus: "/api/v1/dashboard/carrier-status",
    recentActivity: "/api/v1/dashboard/recent-activity",
  },
  network: {
    carriers: "/api/v1/network/carriers",
    carrier: (id: string) => `/api/v1/network/carriers/${id}`,
    connections: "/api/v1/network/connections",
    connection: (id: string) => `/api/v1/network/connections/${id}`,
    toggleConnection: (id: string) => `/api/v1/network/connections/${id}/toggle`,
    routes: "/api/v1/network/routes",
    route: (id: string) => `/api/v1/network/routes/${id}`,
    workers: "/api/v1/network/queues/workers",
    queueMetrics: "/api/v1/network/queues/metrics",
    smppSessions: "/api/v1/network/smpp/sessions",
    dropSmppSession: (id: string) => `/api/v1/network/smpp/sessions/${id}/drop`,
  },
  traffic: {
    messages: "/api/v1/traffic/messages",
    messageDetail: (id: string) => `/api/v1/traffic/messages/${id}`,
    dlr: "/api/v1/traffic/dlr",
    senderIds: "/api/v1/traffic/sender-ids",
    inboundMo: "/api/v1/traffic/inbound-mo",
    ussd: "/api/v1/traffic/ussd",
    ussdSend: "/api/v1/traffic/ussd/send",
  },
  operations: {
    monitoring: "/api/v1/operations/monitoring",
    alarms: "/api/v1/operations/alarms",
    acknowledgeAlarm: (id: string) => `/api/v1/operations/alarms/${id}/acknowledge`,
    resolveAlarm: (id: string) => `/api/v1/operations/alarms/${id}/resolve`,
  },
  admin: {
    tenants: "/api/v1/admin/tenants",
    tenant: (id: string) => `/api/v1/admin/tenants/${id}`,
    users: "/api/v1/admin/users",
    user: (id: string) => `/api/v1/admin/users/${id}`,
    roles: "/api/v1/admin/roles",
    rolePermissions: (id: string) => `/api/v1/admin/roles/${id}/permissions`,
    auditLogs: "/api/v1/admin/audit-logs",
  },
  developers: {
    keys: "/api/v1/developers/keys",
    revokeKey: (id: string) => `/api/v1/developers/keys/${id}`,
    webhooks: "/api/v1/developers/webhooks",
    deleteWebhook: (id: string) => `/api/v1/developers/webhooks/${id}`,
    testWebhook: (id: string) => `/api/v1/developers/webhooks/${id}/ping`,
    logs: "/api/v1/developers/logs",
  },
  settings: {
    system: "/api/v1/settings/system",
    systemSetting: (key: string) => `/api/v1/settings/system/${key}`,
  },
  reports: {
    billing: "/api/v1/reports/billing",
    carrierTelemetry: "/api/v1/reports/carrier-telemetry",
  },
} as const
