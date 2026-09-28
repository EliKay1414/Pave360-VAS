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
