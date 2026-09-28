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
  status?: string
  query?: string
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

