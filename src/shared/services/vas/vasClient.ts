import { env } from "../../config/env"
import { Pave360Client, Pave360ApiError } from "../core/pave360Client"
import { VAS_PATHS } from "./paths"
import type {
  VasApiResponse,
  TrafficQueryParams,
  DlrQueryParams,
  AuditQueryParams,
  UssdSendPayload,
  LoginApiRequest,
  AuthUserResponse,
  AuthMessageResponse,
  ChangePasswordApiRequest,
} from "./types"

export class VasClient extends Pave360Client {
  private vasBaseUrl: string

  constructor() {
    super()
    this.vasBaseUrl = (env.vasApiUrl || env.pave360BaseUrl).replace(/\/$/, "")
  }

  /**
   * Internal HTTP request dispatcher configured with VAS base URL & Cookie credentials
   */
  private async vasRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    }

    const token = this.getAccessToken()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const url = `${this.vasBaseUrl}${path}`
    const res = await fetch(url, {
      ...options,
      headers,
      credentials: "include", // Ensures ASP.NET Core session cookie is sent and received
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      let message =
        (body as { detail?: string })?.detail ||
        (body as { title?: string })?.title ||
        (body as { message?: string })?.message ||
        (body as { error?: { message?: string } })?.error?.message

      if (!message && (body as { errors?: Record<string, string[]> })?.errors) {
        const errs = (body as { errors: Record<string, string[]> }).errors
        const firstField = Object.keys(errs)[0]
        if (firstField && errs[firstField]?.[0]) {
          message = errs[firstField][0]
        }
      }

      if (!message) {
        message = `VAS API Error: ${res.status} ${res.statusText}`
      }
      throw new Pave360ApiError(message, res.status, body)
    }

    if (res.status === 204) return undefined as T
    return (await res.json()) as T
  }

  // --- 0. Authentication (ASP.NET Core Cookie Auth) ---
  loginVas(payload: LoginApiRequest): Promise<AuthUserResponse> {
    return this.vasRequest<AuthUserResponse>(VAS_PATHS.auth.login, {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }

  override async login(email: string, password: string): Promise<any> {
    return this.loginVas({ email, password })
  }

  getCurrentUser(): Promise<AuthUserResponse> {
    return this.vasRequest<AuthUserResponse>(VAS_PATHS.auth.me, {
      method: "GET",
    })
  }

  logoutVas(): Promise<AuthMessageResponse> {
    return this.vasRequest<AuthMessageResponse>(VAS_PATHS.auth.logout, {
      method: "POST",
    })
  }

  changePassword(payload: ChangePasswordApiRequest): Promise<AuthMessageResponse> {
    return this.vasRequest<AuthMessageResponse>(VAS_PATHS.auth.changePassword, {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }

  // --- 1. Dashboard & Telemetry ---
  getDashboardMetrics() {
    return this.vasRequest<VasApiResponse<unknown>>(VAS_PATHS.dashboard.metrics)
  }

  getCarrierStatuses() {
    return this.vasRequest<VasApiResponse<unknown[]>>(VAS_PATHS.dashboard.carrierStatus)
  }

  getRecentActivity() {
    return this.vasRequest<VasApiResponse<unknown[]>>(VAS_PATHS.dashboard.recentActivity)
  }

  // --- 2. Network & Infrastructure ---
  getCarriers() {
    return this.vasRequest<VasApiResponse<unknown[]>>(VAS_PATHS.network.carriers)
  }

  createCarrier(payload: unknown) {
    return this.vasRequest<VasApiResponse<unknown>>(VAS_PATHS.network.carriers, {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }

  updateCarrier(id: string, payload: unknown) {
    return this.vasRequest<VasApiResponse<unknown>>(VAS_PATHS.network.carrier(id), {
      method: "PUT",
      body: JSON.stringify(payload),
    })
  }

  getConnections() {
    return this.vasRequest<VasApiResponse<unknown[]>>(VAS_PATHS.network.connections)
  }

  toggleConnection(id: string) {
    return this.vasRequest<VasApiResponse<unknown>>(VAS_PATHS.network.toggleConnection(id), {
      method: "POST",
    })
  }

  getRoutes() {
    return this.vasRequest<VasApiResponse<unknown[]>>(VAS_PATHS.network.routes)
  }

  saveRoute(payload: unknown) {
    return this.vasRequest<VasApiResponse<unknown>>(VAS_PATHS.network.routes, {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }

  getQueueWorkers() {
    return this.vasRequest<VasApiResponse<unknown[]>>(VAS_PATHS.network.workers)
  }

  getSmppSessions() {
    return this.vasRequest<VasApiResponse<unknown[]>>(VAS_PATHS.network.smppSessions)
  }

  // --- 3. Traffic & Messaging ---
  getTrafficLogs(params?: TrafficQueryParams) {
    const qs = params ? new URLSearchParams(params as Record<string, string>).toString() : ""
    return this.vasRequest<VasApiResponse<unknown[]>>(`${VAS_PATHS.traffic.messages}${qs ? `?${qs}` : ""}`)
  }

  getMessageDetail(id: string) {
    return this.vasRequest<VasApiResponse<unknown>>(VAS_PATHS.traffic.messageDetail(id))
  }

  getDeliveryReports(params?: DlrQueryParams) {
    const qs = params ? new URLSearchParams(params as Record<string, string>).toString() : ""
    return this.vasRequest<VasApiResponse<unknown[]>>(`${VAS_PATHS.traffic.dlr}${qs ? `?${qs}` : ""}`)
  }

  getInboundMessages() {
    return this.vasRequest<VasApiResponse<unknown[]>>(VAS_PATHS.traffic.inboundMo)
  }

  getUssdSessions() {
    return this.vasRequest<VasApiResponse<unknown[]>>(VAS_PATHS.traffic.ussd)
  }

  sendUssd(payload: UssdSendPayload) {
    return this.vasRequest<VasApiResponse<unknown>>(VAS_PATHS.traffic.ussdSend, {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }

  // --- 4. Operations & Monitoring ---
  getMonitoringOverview() {
    return this.vasRequest<VasApiResponse<unknown>>(VAS_PATHS.operations.monitoring)
  }

  getAlarms(filter?: string) {
    const qs = filter && filter !== "all" ? `?status=${filter}` : ""
    return this.vasRequest<VasApiResponse<unknown[]>>(`${VAS_PATHS.operations.alarms}${qs}`)
  }

  acknowledgeAlarm(id: string) {
    return this.vasRequest<VasApiResponse<unknown>>(VAS_PATHS.operations.acknowledgeAlarm(id), {
      method: "PATCH",
    })
  }

  resolveAlarm(id: string) {
    return this.vasRequest<VasApiResponse<unknown>>(VAS_PATHS.operations.resolveAlarm(id), {
      method: "PATCH",
    })
  }

  // --- 5. Administration ---
  getTenants() {
    return this.vasRequest<VasApiResponse<unknown[]>>(VAS_PATHS.admin.tenants)
  }

  saveTenant(payload: unknown) {
    return this.vasRequest<VasApiResponse<unknown>>(VAS_PATHS.admin.tenants, {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }

  getUsers() {
    return this.vasRequest<VasApiResponse<unknown[]>>(VAS_PATHS.admin.users)
  }

  saveUser(payload: unknown) {
    return this.vasRequest<VasApiResponse<unknown>>(VAS_PATHS.admin.users, {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }

  getRoles() {
    return this.vasRequest<VasApiResponse<unknown[]>>(VAS_PATHS.admin.roles)
  }

  updateRolePermissions(roleId: string, permissions: string[]) {
    return this.vasRequest<VasApiResponse<unknown>>(VAS_PATHS.admin.rolePermissions(roleId), {
      method: "PUT",
      body: JSON.stringify({ permissions }),
    })
  }

  getAuditLogs(params?: AuditQueryParams) {
    const qs = params ? new URLSearchParams(params as Record<string, string>).toString() : ""
    return this.vasRequest<VasApiResponse<unknown[]>>(`${VAS_PATHS.admin.auditLogs}${qs ? `?${qs}` : ""}`)
  }

  // --- 6. Developers & Platform Settings ---
  getApiKeys() {
    return this.vasRequest<VasApiResponse<unknown[]>>(VAS_PATHS.developers.keys)
  }

  override revokeApiKey(id: string): Promise<void> {
    return this.vasRequest<void>(VAS_PATHS.developers.revokeKey(id), {
      method: "DELETE",
    })
  }

  revokeVasApiKey(id: string) {
    return this.vasRequest<VasApiResponse<unknown>>(VAS_PATHS.developers.revokeKey(id), {
      method: "DELETE",
    })
  }

  getWebhooks() {
    return this.vasRequest<VasApiResponse<unknown[]>>(VAS_PATHS.developers.webhooks)
  }

  getSystemSettings() {
    return this.vasRequest<VasApiResponse<unknown[]>>(VAS_PATHS.settings.system)
  }

  saveSystemSetting(payload: unknown) {
    return this.vasRequest<VasApiResponse<unknown>>(VAS_PATHS.settings.system, {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }

  getBillingReports() {
    return this.vasRequest<VasApiResponse<unknown[]>>(VAS_PATHS.reports.billing)
  }
}

export const vasClient = new VasClient()
export const vasApi = vasClient
