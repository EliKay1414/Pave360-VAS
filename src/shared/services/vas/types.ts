/**
 * Standard Envelope and Data Types for Pave360 VAS Backend APIs
 */

export interface VasApiResponse<T = unknown> {
  success: boolean
  data: T
  message?: string
  meta?: {
    page?: number
    limit?: number
    total?: number
    totalPages?: number
  }
}

export interface VasApiErrorResponse {
  success: false
  error: {
    code: string
    message: string
    details?: unknown[]
  }
}

// --- Authentication Types ---
export interface LoginApiRequest {
  email: string
  password: string
  rememberMe?: boolean
}

export interface AuthUserResponse {
  id: string | null
  email: string | null
  fullName: string | null
  tenantId: string | null
  tenantName: string | null
  isPlatformUser: boolean
  roles: string[] | null
  permissions: string[] | null
  lastLoginAt: string | null
}

export interface AuthMessageResponse {
  success: boolean
  message: string
}

export interface ChangePasswordApiRequest {
  currentPassword: string
  newPassword: string
}

// --- Dashboard Analytics Types ---
export interface CarrierStateItemViewModel {
  name: string | null
  status: string | null
  statusClass?: string | null
}

export interface DashboardAuditItemViewModel {
  action: string | null
  entityType: string | null
  summary?: string | null
  userEmail?: string | null
  createdAt: string
}

export interface DashboardViewModel {
  messagesToday: number
  messagesThisMonth: number
  submittedMessages: number
  deliveredMessages: number
  failedMessages: number
  pendingMessages: number
  deliveryRatePercent: number
  averageDeliverySeconds: number
  currentTps: number
  activeCarriers: number
  connectedCarriers: number
  queueDepth: number
  tenantCount: number
  activeTenants: number
  userCount: number
  activeUsers: number
  tenantsCreatedThisMonth: number
  phaseNote?: string | null
  carrierStates?: CarrierStateItemViewModel[] | null
  recentAuditItems?: DashboardAuditItemViewModel[] | null
}


// --- 2. Messaging Types ---
export interface SendMessageRequest {
  from: string
  to: string
  body: string
  tenantId?: string | null
  clientReference?: string | null
  idempotencyKey?: string | null
  callbackUrl?: string | null
  category?: string | null
  priority?: string | null
  scheduledAt?: string | null
}

export interface SendBulkMessageRequest {
  from: string
  to: string[]
  body: string
  tenantId?: string | null
  clientReference?: string | null
  callbackUrl?: string | null
  category?: string | null
  priority?: string | null
  scheduledAt?: string | null
}

export interface BatchUploadAcceptedResponse {
  jobId: string | null
  batchId: string | null
}

export interface BatchUploadJobResponse {
  jobId: string | null
  batchId: string | null
  status: string
  totalCount?: number
  processedCount?: number
  failedCount?: number
  createdAt?: string
}

export interface MessageQueryParams {
  status?: string
  category?: string
  destination?: string
  source?: string
  page?: number
  pageSize?: number
}

export interface MessageResponseItem {
  id: string
  category: string
  from: string
  to: string
  status: string
  encoding?: string
  segments?: number
  carrier?: string
  connection?: string
  createdUtc: string
  errorReason?: string
  body?: string
  clientReference?: string
}

export interface PaginationParams {
  page?: number
  limit?: number
}

export interface TrafficQueryParams extends PaginationParams {
  status?: string
  category?: string
  destination?: string
  fromDate?: string
  toDate?: string
  carrier?: string
}

export interface DlrQueryParams extends PaginationParams {
  pageSize?: number
  status?: string
  query?: string
  messageId?: string
  carrierId?: string
  fromDate?: string
  toDate?: string
}

export interface AuditQueryParams extends PaginationParams {
  action?: string
  entityType?: string
  userEmail?: string
  fromDate?: string
}

export interface UssdSendPayload {
  msisdn: string
  text: string
  kind?: "USSN" | "USSR"
  waitAck?: boolean
}

// ==========================================
// 5. CARRIERS & CONNECTIONS
// ==========================================
export interface CarrierListItemViewModel {
  id: string
  name: string
  code: string
  countryCode?: string
  mcc?: string
  mnc?: string
  status?: string
  defaultProtocol?: string
  priority?: number
  connectionCount?: number
  enabledConnectionCount?: number
}

export interface CarrierFormViewModel {
  id?: string
  name: string
  code: string
  countryCode: string
  mcc?: string
  mnc?: string
  status?: string
  defaultProtocol?: string
  priority?: number
  supportsSms?: boolean
  supportsDeliveryReceipts?: boolean
  supportsUnicode?: boolean
  supportsConcatenated?: boolean
  notes?: string
}

export interface ConnectionListItemViewModel {
  id: string
  carrierId: string
  carrierName?: string
  name: string
  protocol: string
  host?: string
  port?: number
  systemId?: string
  bindType?: string
  useTls?: boolean
  tpsLimit?: number
  isEnabled: boolean
  runtimeStatus?: string
  lastError?: string
  lastStatusAt?: string
}

export interface ConnectionFormViewModel {
  id?: string
  carrierId: string
  name: string
  protocol: string
  host?: string
  port?: number
  systemId?: string
  password?: string
  passwordConfigured?: boolean
  systemType?: string
  bindType?: string
  useTls?: boolean
  sourceIp?: string
  addressTon?: number
  addressNpi?: number
  tpsLimit?: number
  windowSize?: number
  timeoutSeconds?: number
  enquireLinkIntervalSeconds?: number
  reconnectDelaySeconds?: number
  maxReconnectAttempts?: number
  isEnabled?: boolean
  availableCarriers?: Array<{ id: string; name: string }>
}

export interface ToggleConnectionApiRequest {
  enable: boolean
}

// ==========================================
// 6. ROUTING ENGINE
// ==========================================
export interface RouteListItemViewModel {
  id: string
  name: string
  priority: number
  isEnabled: boolean
  primaryCarrierName?: string
  secondaryCarrierName?: string
  ruleCount?: number
}

export interface RouteFormViewModel {
  id?: string
  name: string
  description?: string
  priority: number
  isEnabled: boolean
  primaryCarrierId: string
  primaryConnectionId?: string
  secondaryCarrierId?: string
  secondaryConnectionId?: string
  countryCode?: string
  prefix?: string
  regexPattern?: string
  availableCarriers?: Array<{ id: string; name: string }>
  availableConnections?: Array<{ id: string; name: string }>
}

export interface RouteSimulationRequest {
  destination: string
  source?: string
  tenantId?: string
  countryCode?: string
  prefix?: string
  preferredCarrierId?: string
  preferredCarrierCode?: string
}

export interface RoutingSimulationResponse {
  success: boolean
  carrierName?: string
  carrierCode?: string
  connectionName?: string
  protocol?: string
  routeName?: string
  usedSecondary?: boolean
  reason?: string
  error?: string
}

// ==========================================
// 17. SMPP SERVER
// ==========================================
export interface SmppServerSessionInfo {
  sessionId: string
  remoteEndPoint?: string
  systemId?: string
  bindState?: string
  connectedAt?: string
  lastActivityAt?: string
  messagesSubmitted?: number
  messagesDelivered?: number
}

export interface SmppServerStatusResponse {
  isRunning: boolean
  listeningPort: number
  activeSessions: SmppServerSessionInfo[]
}

// ==========================================
// 10. QUEUES & TELEMETRY
// ==========================================
export interface QueueWorkerInfo {
  name: string
  role?: string
  queueConsumed?: string
  lastBeat?: string
  isHealthy: boolean
}

export interface QueueRecentMessageItem {
  publicId: string
  source: string
  destination: string
  status: string
  encoding?: string
  segmentCount?: number
  createdAt: string
}

export interface QueueDashboardViewModel {
  provider?: string
  submitQueueName?: string
  retryQueueName?: string
  dlrQueueName?: string
  webhookQueueName?: string
  inboundQueueName?: string
  submitDepth: number
  dlrDepth: number
  webhookDepth: number
  inboundDepth: number
  smppSubmitMode?: string
  maxRetryAttempts?: number
  workerBatchDelayMs?: number
  queuedCount: number
  processingCount: number
  submittedCount: number
  deliveredCount: number
  failedCount: number
  workers: QueueWorkerInfo[]
  recentMessages: QueueRecentMessageItem[]
}

// ==========================================
// 7. SENDER IDS (Tag 7)
// ==========================================
export interface SenderIdItemViewModel {
  id: string
  senderId: string
  type?: "Alphanumeric" | "Shortcode" | "Longcode" | string
  status: "Approved" | "Pending" | "Rejected" | "Pending Carrier Review" | string
  country?: string
  carriers?: string[]
  purpose?: string
  documentUrl?: string
  createdAt?: string
}

export interface RegisterSenderRequest {
  senderId: string
  purpose?: string
  documentUrl?: string
  type?: string
  country?: string
}

export interface RegisterSenderResponse {
  success: boolean
  senderId: string
  status: string
}

// ==========================================
// 4. USSD GATEWAY (Tag 4)
// ==========================================
export interface UssdSessionItemViewModel {
  sessionId: string
  msisdn: string
  serviceCode: string
  type?: "init" | "continue" | "end" | "USSN" | "USSR" | string
  status: "Delivered" | "Sent" | "Failed" | "Active" | "Completed" | string
  text?: string
  message?: string
  cost?: string
  startedAt?: string
  lastActivityAt?: string
  when?: string
  ackRequested?: boolean
}

export interface UssdSessionRequest {
  sessionId: string
  msisdn: string
  serviceCode: string
  ussdString: string
  type: "init" | "continue" | "end" | string
}

export interface UssdSessionResponse {
  sessionId: string
  type: string
  message: string
}

export interface UssdNotifyRequest {
  msisdn: string
  message: string
}

export interface UssdNotifyResponse {
  success: boolean
  status: string
  cost?: string
}

// ==========================================
// 8. INBOUND MO (MOBILE-ORIGINATED)
// ==========================================
export interface InboundMessageItemViewModel {
  id: string
  from: string
  to: string
  keyword?: string
  message?: string
  body?: string
  carrier?: string
  status?: string
  receivedAt?: string
  createdAt?: string
}

export interface InboundMessageApiResponse {
  count?: number
  items?: InboundMessageItemViewModel[]
  data?: InboundMessageItemViewModel[]
}

// ==========================================
// 9. WEBHOOKS
// ==========================================
export interface WebhookItemViewModel {
  id: string
  name: string
  url: string
  event: string
  status?: string
  secret?: string
  maxAttempts?: number
  timeoutSeconds?: number
  failures?: number
  lastTriggeredAt?: string
  createdAt?: string
  enabled?: boolean
}

export interface CreateWebhookRequest {
  name: string
  url: string
  event: string
  secret?: string
  maxAttempts?: number
  timeoutSeconds?: number
  enabled?: boolean
}

export interface CreateWebhookResponse {
  success: boolean
  id?: string
  status?: string
  message?: string
}

export interface WebhooksApiResponse {
  webhooks?: WebhookItemViewModel[]
  items?: WebhookItemViewModel[]
  data?: WebhookItemViewModel[]
}

// ==========================================
// 12. DELIVERY REPORTS & BILLING (Tag 12)
// ==========================================
export interface DeliveryReportItemViewModel {
  id: string
  tenant?: string
  tenantName?: string
  carrier?: string
  carrierName?: string
  carrierMsgId?: string
  messageId?: string
  status: "Delivered" | "Failed" | "Expired" | "Rejected" | "Accepted" | "Unknown" | string
  errorCode?: string
  error?: string
  latencyMs?: number
  latency?: string
  deliveredAt?: string
  receivedAt?: string
  received?: string
  timeline?: {
    stage: string
    timestamp: string
    status: "done" | "failed" | "pending"
    detail?: string
  }[]
}

export interface DeliveryReportsApiResponse {
  items?: DeliveryReportItemViewModel[]
  data?: DeliveryReportItemViewModel[]
  totalCount?: number
  page?: number
  pageSize?: number
}

export interface ReportQueryParams {
  fromDate?: string
  toDate?: string
  tenantId?: string
  carrierId?: string
  type?: string
  page?: number
  pageSize?: number
}

export interface MessagingReportResponse {
  totalMessages: number
  delivered: number
  failed: number
  pending: number
  successRate: number
  segments: number
  dailyBreakdown?: {
    date: string
    delivered: number
    failed: number
    total: number
  }[]
}

export interface DeliveryReportAnalyticsResponse {
  totalDlrReceived: number
  avgLatencyMs: number
  carrierBreakdown?: {
    network: string
    code: string
    totalTraffic: number
    delivered: number
    failed: number
    successRate: number
    avgLatency: string
  }[]
}

export interface FinancialReportResponse {
  summary?: {
    totalBilled: number
    prepaidUsage: number
    postpaidUsage: number
    activeReserves: number
    currentBalance: number
  }
  ledgerRecords?: {
    id: string
    dateTime: string
    tenant: string
    category: string
    type: string
    amount: string
    balanceAfter: string
    segmentsRate: string
    reference: string
    description: string
  }[]
}

// ==========================================
// 13. TENANTS (Tag 13)
// ==========================================
export interface TenantListItemViewModel {
  id: string
  name: string
  slug?: string
  status?: "Active" | "Suspended" | "Pending" | string
  contactEmail?: string
  contactName?: string
  contactPhone?: string
  countryCode?: string
  createdAt?: string
  userCount?: number
  walletBalance?: number
  availableBalance?: number
  reservedBalance?: number
  currency?: string
  billingMode?: "Prepaid" | "Postpaid" | string
}

export interface TenantFormViewModel {
  id?: string
  name: string
  slug?: string
  status?: string
  contactName?: string
  contactEmail?: string
  contactPhone?: string
  countryCode?: string
  timeZoneId?: string
  notes?: string
}

// ==========================================
// 14. USERS & ROLES (Tag 14)
// ==========================================
export interface UserListItemViewModel {
  id: string
  email: string
  displayName?: string
  firstName?: string
  lastName?: string
  tenantName?: string
  tenantId?: string
  isActive?: boolean
  status?: "Active" | "Suspended" | string
  roles?: string[]
  createdAt?: string
  lastLoginAt?: string
}

export interface UserFormViewModel {
  id?: string
  email: string
  firstName?: string
  lastName?: string
  tenantId?: string
  roles?: string[]
  selectedRoles?: string[]
  isActive?: boolean
  password?: string
}

export interface RoleListItemViewModel {
  id: string
  name: string
  description?: string
  userCount?: number
  permissionCount?: number
  permissions?: string[]
  isSystemRole?: boolean
}

export interface RoleFormViewModel {
  id?: string
  name: string
  description?: string
  permissions?: string[]
}

export interface UpdateRolePermissionsRequest {
  permissions: string[]
}

// ==========================================
// 15. LOGS & AUDIT TRAIL (Tag 15)
// ==========================================
export interface ApiLogListItemViewModel {
  id: string
  timestamp: string
  method: string
  path: string
  queryString?: string
  statusCode: number
  durationMs?: number
  clientIp?: string
  apiKeyPrefix?: string
  tenantId?: string
  tenantName?: string
  errorMessage?: string
  hasRequestBody?: boolean
  hasResponseBody?: boolean
}

export interface ApiLogIndexViewModel {
  logs: ApiLogListItemViewModel[]
  stats?: any
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
  hasPreviousPage?: boolean
  hasNextPage?: boolean
}

export interface ApiLogQueryParams {
  Search?: string
  Method?: string
  StatusFilter?: string
  Path?: string
  TenantId?: string
  FromUtc?: string
  ToUtc?: string
  Page?: number
  PageSize?: number
}

export interface AuditLogRecordDto {
  id: string
  tenantId?: string
  tenant?: any
  userId?: string
  userEmail?: string
  action: string
  entityType: string
  entityId?: string
  summary: string
  ipAddress?: string
  userAgent?: string
  correlationId?: string
  createdAt: string
}

export interface AuditLogsResponse {
  items: AuditLogRecordDto[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}

export interface AuditLogQueryParams {
  actionName?: string
  entityType?: string
  userEmail?: string
  from?: string
  to?: string
  page?: number
  pageSize?: number
}

// Backward-compat aliases
export type ApiLogItemViewModel = ApiLogListItemViewModel
export type AuditLogItemViewModel = AuditLogRecordDto

// ==========================================
// 16. SYSTEM SETTINGS & API KEYS (Tag 16)
// ==========================================
export interface SystemSettingItemViewModel {
  id: string
  key: string
  value?: string
  displayValue?: string
  description?: string
  isSecret?: boolean
  updatedAt?: string
}

export interface SystemSettingFormViewModel {
  id?: string
  key: string
  value: string
  description?: string
  isSecret?: boolean
}

export interface ApiKeyListItemViewModel {
  id: string
  name: string
  keyPrefix?: string
  scopes?: string[]
  isSandbox?: boolean
  isRevoked?: boolean
  expiresAt?: string
  lastUsedAt?: string
  createdAt?: string
}

export interface ApiKeyFormViewModel {
  name: string
  tenantId?: string
  isSandbox?: boolean
  expiresAt?: string
  notes?: string
  selectedScopes?: string[]
}

export interface CreateApiKeyRequest {
  name: string
  tenantId?: string
  isSandbox?: boolean
  expiresAt?: string
  notes?: string
  selectedScopes?: string[]
  scopes?: string[]
  expiresInDays?: number
}

export interface CreateApiKeyResponse {
  id: string
  name: string
  apiKey?: string
  keyPrefix?: string
  scopes?: string[]
  expiresAt?: string
}

// Backward-compat alias
export type ApiKeyItemViewModel = ApiKeyListItemViewModel





