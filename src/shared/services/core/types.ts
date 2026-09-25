/** Core Pave360 VAS API types. */

export interface PaveAuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn?: number
}

export interface PaveLoginResponse {
  user?: Record<string, unknown>
  tokens?: PaveAuthTokens
  requiresOtp?: boolean
  message?: string
}

export interface PaveSenderIdRow {
  id: string
  name: string
  status: "APPROVED" | "PENDING" | "REJECTED"
}

export interface PaveApiKeyRow {
  id: string
  name: string
  key?: string
  prefix?: string
  createdAt?: string
  revokedAt?: string | null
}

export interface PaveAuditLogRow {
  id: string
  action: string
  detail?: string
  createdAt?: string
}

export class Pave360ApiError extends Error {
  status: number
  body: unknown

  constructor(message: string, status = 500, body: unknown = null) {
    super(message)
    this.name = "Pave360ApiError"
    this.status = status
    this.body = body
  }
}
