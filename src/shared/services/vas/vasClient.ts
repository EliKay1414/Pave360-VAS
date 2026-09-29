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
  DashboardViewModel,
  SendMessageRequest,
  SendBulkMessageRequest,
  BatchUploadAcceptedResponse,
  BatchUploadJobResponse,
  MessageQueryParams,
  MessageResponseItem,
  CarrierListItemViewModel,
  CarrierFormViewModel,
  ConnectionListItemViewModel,
  ConnectionFormViewModel,
  RouteListItemViewModel,
  RouteFormViewModel,
  RouteSimulationRequest,
  RoutingSimulationResponse,
  SmppServerStatusResponse,
  QueueDashboardViewModel,
  SenderIdItemViewModel,
  RegisterSenderRequest,
  RegisterSenderResponse,
  UssdSessionItemViewModel,
  UssdSessionRequest,
  UssdSessionResponse,
  UssdNotifyRequest,
  UssdNotifyResponse,
  InboundMessageItemViewModel,
  InboundMessageApiResponse,
  WebhookItemViewModel,
  CreateWebhookRequest,
  CreateWebhookResponse,
  WebhooksApiResponse,
} from "./types"

export class VasClient extends Pave360Client {
  private vasBaseUrl: string

  constructor() {
    super()
    const isLocalhost =
      typeof window !== "undefined" &&
      (window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1" ||
        window.location.hostname.endsWith(".localhost"))

    // On localhost DEV, use relative path ("") to route through Vite proxy,
    // which rewrites SameSite cookies and completely eliminates cross-origin 401s
    if (isLocalhost && import.meta.env.DEV) {
      this.vasBaseUrl = ""
    } else {
      this.vasBaseUrl = (env.vasApiUrl || env.pave360BaseUrl).replace(/\/$/, "")
    }
  }

  /**
   * Internal HTTP request dispatcher configured with VAS base URL & Cookie credentials
   */
  private async vasRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    }

    // Do NOT send Bearer token on auth routes to avoid conflicting with ASP.NET Core cookie auth
    const isAuthRoute = path.startsWith("/api/v1/auth")
    let token = !isAuthRoute ? this.getAccessToken() : null
    if (!token && !isAuthRoute && typeof window !== "undefined") {
      try {
        token = localStorage.getItem("pave360_access_token")
      } catch {}
    }
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const controller = new AbortController()
    const requestTimeoutMs = (options as any)?.timeoutMs || 12000 // 12-second consistent global timeout
    const timeout = setTimeout(() => controller.abort(), requestTimeoutMs)
    const signal = options.signal || controller.signal

    const url = `${this.vasBaseUrl}${path}`
    try {
      const res = await fetch(url, {
        ...options,
        headers,
        credentials: "include", // Ensures ASP.NET Core session cookie is sent and received
        signal,
      })
      clearTimeout(timeout)

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
    } catch (err: unknown) {
      clearTimeout(timeout)
      if ((err as Error)?.name === "AbortError") {
        throw new Pave360ApiError("Gateway request timed out. Please check network connection.", 408)
      }
      throw err
    }
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

  // --- 1. Dashboard Analytics ---
  getDashboard(): Promise<DashboardViewModel> {
    return this.vasRequest<DashboardViewModel>(VAS_PATHS.dashboard.overview)
  }

  getDashboardMetrics(): Promise<DashboardViewModel> {
    return this.getDashboard()
  }

  // --- 5. Carriers & Connections ---
  getCarriers(): Promise<CarrierListItemViewModel[]> {
    return this.vasRequest<CarrierListItemViewModel[]>(VAS_PATHS.network.carriers)
  }

  getCarrier(id: string): Promise<CarrierFormViewModel> {
    return this.vasRequest<CarrierFormViewModel>(VAS_PATHS.network.carrier(id))
  }

  createCarrier(payload: CarrierFormViewModel): Promise<CarrierFormViewModel> {
    return this.vasRequest<CarrierFormViewModel>(VAS_PATHS.network.carriers, {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }

  updateCarrier(id: string, payload: CarrierFormViewModel): Promise<CarrierFormViewModel> {
    return this.vasRequest<CarrierFormViewModel>(VAS_PATHS.network.carrier(id), {
      method: "PUT",
      body: JSON.stringify(payload),
    })
  }

  deleteCarrier(id: string): Promise<void> {
    return this.vasRequest<void>(VAS_PATHS.network.carrier(id), {
      method: "DELETE",
    })
  }

  getConnections(carrierId?: string): Promise<ConnectionListItemViewModel[]> {
    const url = carrierId
      ? `${VAS_PATHS.network.connections}?carrierId=${encodeURIComponent(carrierId)}`
      : VAS_PATHS.network.connections
    return this.vasRequest<ConnectionListItemViewModel[]>(url)
  }

  getConnection(id: string): Promise<ConnectionFormViewModel> {
    return this.vasRequest<ConnectionFormViewModel>(VAS_PATHS.network.connection(id))
  }

  createConnection(payload: ConnectionFormViewModel): Promise<ConnectionFormViewModel> {
    return this.vasRequest<ConnectionFormViewModel>(VAS_PATHS.network.connections, {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }

  updateConnection(id: string, payload: ConnectionFormViewModel): Promise<ConnectionFormViewModel> {
    return this.vasRequest<ConnectionFormViewModel>(VAS_PATHS.network.connection(id), {
      method: "PUT",
      body: JSON.stringify(payload),
    })
  }

  deleteConnection(id: string): Promise<void> {
    return this.vasRequest<void>(VAS_PATHS.network.connection(id), {
      method: "DELETE",
    })
  }

  toggleConnection(id: string, enable: boolean): Promise<void> {
    return this.vasRequest<void>(VAS_PATHS.network.toggleConnection(id), {
      method: "POST",
      body: JSON.stringify({ enable }),
    })
  }

  testConnection(id: string): Promise<unknown> {
    return this.vasRequest<unknown>(VAS_PATHS.network.testConnection(id), {
      method: "POST",
    })
  }

  reconnectConnection(id: string): Promise<unknown> {
    return this.vasRequest<unknown>(VAS_PATHS.network.reconnectConnection(id), {
      method: "POST",
    })
  }

  // --- 6. Routing Engine ---
  getRoutes(): Promise<RouteListItemViewModel[]> {
    return this.vasRequest<RouteListItemViewModel[]>(VAS_PATHS.network.routes)
  }

  getRoute(id: string): Promise<RouteFormViewModel> {
    return this.vasRequest<RouteFormViewModel>(VAS_PATHS.network.route(id))
  }

  createRoute(payload: RouteFormViewModel): Promise<RouteFormViewModel> {
    return this.vasRequest<RouteFormViewModel>(VAS_PATHS.network.routes, {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }

  updateRoute(id: string, payload: RouteFormViewModel): Promise<RouteFormViewModel> {
    return this.vasRequest<RouteFormViewModel>(VAS_PATHS.network.route(id), {
      method: "PUT",
      body: JSON.stringify(payload),
    })
  }

  deleteRoute(id: string): Promise<void> {
    return this.vasRequest<void>(VAS_PATHS.network.route(id), {
      method: "DELETE",
    })
  }

  toggleRoute(id: string): Promise<void> {
    return this.vasRequest<void>(VAS_PATHS.network.toggleRoute(id), {
      method: "POST",
    })
  }

  simulateRoute(payload: RouteSimulationRequest): Promise<RoutingSimulationResponse> {
    return this.vasRequest<RoutingSimulationResponse>(VAS_PATHS.network.simulateRoute, {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }

  // --- 17. SMPP Server ---
  getSmppStatus(): Promise<SmppServerStatusResponse> {
    return this.vasRequest<SmppServerStatusResponse>(VAS_PATHS.network.smppStatus)
  }

  disconnectSmppSession(sessionId: string): Promise<void> {
    return this.vasRequest<void>(VAS_PATHS.network.smppDisconnect(sessionId), {
      method: "POST",
    })
  }

  // --- 10. Queues & Telemetry ---
  getQueues(): Promise<QueueDashboardViewModel> {
    return this.vasRequest<QueueDashboardViewModel>(VAS_PATHS.network.queues)
  }

  // --- 2. Messaging (Tag 2: Messaging) ---
  getMessages(params?: MessageQueryParams | TrafficQueryParams) {
    const qs = params
      ? new URLSearchParams(
          Object.entries(params)
            .filter(([_, v]) => v !== undefined && v !== null && v !== "")
            .reduce((acc, [k, v]) => ({ ...acc, [k]: String(v) }), {}),
        ).toString()
      : ""
    return this.vasRequest<any>(`${VAS_PATHS.messaging.list}${qs ? `?${qs}` : ""}`)
  }

  getTrafficLogs(params?: TrafficQueryParams) {
    return this.getMessages(params)
  }

  getMessageDetail(id: string) {
    return this.vasRequest<any>(VAS_PATHS.messaging.detail(id)).catch((err) => {
      if (err?.status === 404) return null
      throw err
    })
  }

  sendMessage(payload: SendMessageRequest, idempotencyKey?: string) {
    const headers: Record<string, string> = {}
    if (idempotencyKey) {
      headers["Idempotency-Key"] = idempotencyKey
    }
    return this.vasRequest<any>(VAS_PATHS.messaging.send, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    })
  }

  sendBulkMessages(payload: SendBulkMessageRequest) {
    return this.vasRequest<any>(VAS_PATHS.messaging.bulk, {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }

  uploadBatchMessages(formData: FormData): Promise<BatchUploadAcceptedResponse> {
    const headers: Record<string, string> = {}
    const token = this.getAccessToken()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const url = `${this.vasBaseUrl}${VAS_PATHS.messaging.upload}`
    return fetch(url, {
      method: "POST",
      body: formData,
      headers,
      credentials: "include",
    }).then(async (res) => {
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Pave360ApiError(
          (body as { detail?: string })?.detail || `Batch upload failed: ${res.status}`,
          res.status,
          body,
        )
      }
      return res.json() as Promise<BatchUploadAcceptedResponse>
    })
  }

  getBatchUploadStatus(jobId: string): Promise<BatchUploadJobResponse> {
    return this.vasRequest<BatchUploadJobResponse>(VAS_PATHS.messaging.uploadStatus(jobId))
  }

  getDeliveryReports(params?: DlrQueryParams) {
    const qs = params ? new URLSearchParams(params as Record<string, string>).toString() : ""
    return this.vasRequest<VasApiResponse<unknown[]>>(`${VAS_PATHS.traffic.dlr}${qs ? `?${qs}` : ""}`)
  }


  // --- 7. Sender IDs (Tag 7: /api/v1/senders) ---
  getSenderIds(): Promise<SenderIdItemViewModel[]> {
    return this.vasRequest<any>(VAS_PATHS.traffic.senderIds).then((res) => {
      if (Array.isArray(res)) return res
      if (res && Array.isArray(res.senders)) return res.senders
      if (res && Array.isArray(res.data)) return res.data
      return []
    })
  }

  registerSenderId(payload: RegisterSenderRequest): Promise<RegisterSenderResponse> {
    return this.vasRequest<RegisterSenderResponse>(VAS_PATHS.traffic.senderIds, {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }

  deleteSenderId(id: string): Promise<void> {
    return this.vasRequest<void>(`${VAS_PATHS.traffic.senderIds}/${id}`, {
      method: "DELETE",
    })
  }

  // --- 4. USSD Gateway (Tag 4: /api/v1/ussd/*) ---
  getUssdSessions(): Promise<UssdSessionItemViewModel[]> {
    return this.vasRequest<any>(VAS_PATHS.traffic.ussd).then((res) => {
      if (Array.isArray(res)) return res
      if (res && Array.isArray(res.sessions)) return res.sessions
      if (res && Array.isArray(res.data)) return res.data
      return []
    })
  }

  getUssdSessionDetail(id: string): Promise<UssdSessionItemViewModel> {
    return this.vasRequest<UssdSessionItemViewModel>(VAS_PATHS.ussd.sessionDetail(id))
  }

  sendUssdNotify(payload: UssdNotifyRequest): Promise<UssdNotifyResponse> {
    return this.vasRequest<UssdNotifyResponse>(VAS_PATHS.ussd.notify, {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }

  simulateUssdSession(payload: UssdSessionRequest): Promise<UssdSessionResponse> {
    return this.vasRequest<UssdSessionResponse>("/api/v1/ussd/session", {
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

  // --- 8. Inbound MO ---
  async getInboundMessages(params?: { limit?: number; since?: string }): Promise<InboundMessageItemViewModel[]> {
    const qs = params
      ? new URLSearchParams(
          Object.entries(params)
            .filter(([_, v]) => v !== undefined && v !== null && v !== "")
            .reduce((acc, [k, v]) => ({ ...acc, [k]: String(v) }), {})
        ).toString()
      : ""

    try {
      const res = await this.vasRequest<any>(`/api/v1/messages/inbound${qs ? `?${qs}` : ""}`)
      if (Array.isArray(res)) return res
      if (Array.isArray(res?.items)) return res.items
      if (Array.isArray(res?.data)) return res.data
      return []
    } catch (err: any) {
      if (err?.status === 404 || err?.status === 405) {
        const fallbackRes = await this.vasRequest<any>(`${VAS_PATHS.delivery.inbound}${qs ? `?${qs}` : ""}`)
        if (Array.isArray(fallbackRes)) return fallbackRes
        if (Array.isArray(fallbackRes?.items)) return fallbackRes.items
        if (Array.isArray(fallbackRes?.data)) return fallbackRes.data
        return []
      }
      throw err
    }
  }

  // --- 9. Webhooks ---
  async getWebhooks(): Promise<WebhookItemViewModel[]> {
    const res = await this.vasRequest<any>(VAS_PATHS.developers.webhooks)
    if (Array.isArray(res)) return res
    if (Array.isArray(res?.webhooks)) return res.webhooks
    if (Array.isArray(res?.items)) return res.items
    if (Array.isArray(res?.data)) return res.data
    return []
  }

  createWebhook(payload: CreateWebhookRequest): Promise<CreateWebhookResponse> {
    return this.vasRequest<CreateWebhookResponse>(VAS_PATHS.developers.webhooks, {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }

  deleteWebhook(id: string): Promise<void> {
    return this.vasRequest<void>(VAS_PATHS.developers.deleteWebhook(id), {
      method: "DELETE",
    })
  }

  testWebhook(id: string): Promise<void> {
    return this.vasRequest<void>(VAS_PATHS.developers.testWebhook(id), {
      method: "POST",
    })
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
