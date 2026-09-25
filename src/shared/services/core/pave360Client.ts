import { env } from "../../config/env"
import { PAVE360_PATHS } from "./paths"
import { Pave360ApiError } from "./types"
import type {
  PaveApiKeyRow,
  PaveAuditLogRow,
  PaveAuthTokens,
  PaveLoginResponse,
  PaveSenderIdRow,
} from "./types"

export { Pave360ApiError } from "./types"
export type * from "./types"

const TOKEN_KEY = "pave360_access_token"
const REFRESH_KEY = "pave360_refresh_token"

export class Pave360Client {
  private baseUrl: string
  private token: string | null = null
  private refreshToken: string | null = null

  constructor(baseUrl = env.pave360BaseUrl) {
    this.baseUrl = baseUrl.replace(/\/$/, "")
    try {
      this.token = localStorage.getItem(TOKEN_KEY)
      this.refreshToken = localStorage.getItem(REFRESH_KEY)
    } catch {
      this.token = null
      this.refreshToken = null
    }
  }

  setTokens(access: string | null, refresh: string | null = null) {
    this.token = access
    if (refresh !== null) this.refreshToken = refresh
    try {
      if (access) localStorage.setItem(TOKEN_KEY, access)
      else localStorage.removeItem(TOKEN_KEY)
      if (refresh) localStorage.setItem(REFRESH_KEY, refresh)
      else if (refresh === null && !access) localStorage.removeItem(REFRESH_KEY)
    } catch {
      /* ignore */
    }
  }

  getAccessToken() {
    return this.token
  }

  getRefreshToken() {
    return this.refreshToken
  }

  clearTokens() {
    this.setTokens(null, null)
    this.refreshToken = null
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    }
    if (this.token) headers.Authorization = `Bearer ${this.token}`

    const res = await fetch(`${this.baseUrl}${path}`, { ...options, headers })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      const message =
        (body as { message?: string }).message ||
        (body as { error?: string }).error ||
        `Request failed (${res.status})`
      throw new Pave360ApiError(message, res.status, body)
    }
    if (res.status === 204) return undefined as T
    return (await res.json()) as T
  }

  // --- Auth ---
  login(email: string, password: string) {
    return this.request<PaveLoginResponse>(PAVE360_PATHS.auth.login, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  }

  verifyLoginOtp(email: string, otp: string) {
    return this.request<PaveLoginResponse>(PAVE360_PATHS.auth.verifyOtp, {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    })
  }

  refreshSession(refreshToken = this.refreshToken) {
    if (!refreshToken) throw new Pave360ApiError("No refresh token", 401)
    return this.request<PaveAuthTokens>(PAVE360_PATHS.auth.refresh, {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    })
  }

  logout() {
    return this.request<void>(PAVE360_PATHS.auth.logout, { method: "POST" }).catch(() => undefined)
  }

  // --- Sender IDs ---
  fetchSenderIds() {
    return this.request<PaveSenderIdRow[]>(PAVE360_PATHS.telecom.senderIds)
  }

  createSenderId(name: string, purpose?: string) {
    return this.request<PaveSenderIdRow>(PAVE360_PATHS.telecom.senderIds, {
      method: "POST",
      body: JSON.stringify({ name, purpose }),
    })
  }

  // --- API keys ---
  fetchApiKeys() {
    return this.request<PaveApiKeyRow[]>(PAVE360_PATHS.apiKeys.list)
  }

  createApiKey(name: string) {
    return this.request<PaveApiKeyRow>(PAVE360_PATHS.apiKeys.create, {
      method: "POST",
      body: JSON.stringify({ name }),
    })
  }

  revokeApiKey(id: string) {
    return this.request<void>(PAVE360_PATHS.apiKeys.revoke(id), { method: "POST" })
  }

  // --- Audit ---
  fetchAuditLogs() {
    return this.request<PaveAuditLogRow[]>(PAVE360_PATHS.audit.myLogs)
  }
}

export const pave360Client = new Pave360Client()
export const pave360Api = pave360Client
