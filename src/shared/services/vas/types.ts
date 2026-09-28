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
