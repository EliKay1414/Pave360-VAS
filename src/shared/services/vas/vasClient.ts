import { env } from "../../config/env"
import { store } from "../../store"
import { setSignedIn } from "../../store/slices/authSlice"
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
  DeliveryReportItemViewModel,
  ReportQueryParams,
  MessagingReportResponse,
  DeliveryReportAnalyticsResponse,
  FinancialReportResponse,
  TenantListItemViewModel,
  TenantFormViewModel,
  UserListItemViewModel,
  UserFormViewModel,
  RoleListItemViewModel,
  RoleFormViewModel,
  UpdateRolePermissionsRequest,
  ApiLogListItemViewModel,
  ApiLogIndexViewModel,
  ApiLogQueryParams,
  AuditLogRecordDto,
  AuditLogsResponse,
  AuditLogQueryParams,
  SystemSettingItemViewModel,
  SystemSettingFormViewModel,
  ApiKeyListItemViewModel,
  ApiKeyFormViewModel,
  CreateApiKeyRequest,
  CreateApiKeyResponse,
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

    // On localhost, always use relative path ("") to route through Vite proxy,
    // which rewrites SameSite & Secure cookies and completely eliminates cross-origin 401s
    if (isLocalhost) {
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

    // Authenticate via CookieAuth (Pave360.Gateway.Auth) and optional X-Api-Key
    if (typeof window !== "undefined") {
      try {
        const apiKey = localStorage.getItem("pave360_api_key")
        if (apiKey) {
          headers["X-Api-Key"] = apiKey
        }
      } catch {}
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
        credentials: "include", // Ensures ASP.NET Core session cookie (Pave360.Gateway.Auth) is sent
        signal,
      })
      clearTimeout(timeout)

      if (!res.ok) {
        if (res.status === 401 && !path.startsWith("/api/v1/auth")) {
          // Backend session expired or missing credentials
          this.clearTokens()
          try {
            store.dispatch(setSignedIn(false))
          } catch {}

          if (typeof window !== "undefined") {
            try {
              localStorage.removeItem("pave360_vas_authenticated")
              localStorage.removeItem("pave360_vas_user")
              localStorage.removeItem("pave360_access_token")
            } catch {}

            // Auto-redirect to /login if currently on a protected route
            const currentPath = window.location.pathname
            if (
              !currentPath.includes("/login") &&
              !currentPath.includes("/logout") &&
              !currentPath.includes("/register")
            ) {
              window.location.href = "/login"
            }
          }
        }
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
  async loginVas(payload: LoginApiRequest): Promise<AuthUserResponse> {
    const res = await this.vasRequest<any>(VAS_PATHS.auth.login, {
      method: "POST",
      body: JSON.stringify(payload),
    })

    const token =
      res?.token ||
      res?.accessToken ||
      res?.access_token ||
      res?.jwt ||
      res?.bearer ||
      res?.data?.token ||
      res?.data?.accessToken

    if (token && typeof token === "string") {
      this.setTokens(token)
    }

    return res as AuthUserResponse
  }

  override async login(email: string, password: string): Promise<any> {
    return this.loginVas({ email, password })
  }

  getCurrentUser(): Promise<AuthUserResponse> {
    return this.vasRequest<AuthUserResponse>(VAS_PATHS.auth.me, {
      method: "GET",
    })
  }

  async logoutVas(): Promise<AuthMessageResponse> {
    this.clearTokens()
    return this.vasRequest<AuthMessageResponse>(VAS_PATHS.auth.logout, {
      method: "POST",
    }).catch(() => ({ success: true, message: "Logged out" }))
  }

  changePassword(payload: ChangePasswordApiRequest): Promise<AuthMessageResponse> {
    return this.vasRequest<AuthMessageResponse>(VAS_PATHS.auth.changePassword, {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }

  // --- 1. Dashboard Analytics ---
  async getDashboard(): Promise<DashboardViewModel> {
    try {
      const res = await this.vasRequest<DashboardViewModel>(VAS_PATHS.dashboard.overview)
      return res || ({} as DashboardViewModel)
    } catch {
      return {} as DashboardViewModel
    }
  }

  getDashboardMetrics(): Promise<DashboardViewModel> {
    return this.getDashboard()
  }

  // --- 5. Carriers & Connections ---
  async getCarriers(): Promise<CarrierListItemViewModel[]> {
    try {
      const res = await this.vasRequest<any>(VAS_PATHS.network.carriers)
      if (Array.isArray(res)) return res
      if (Array.isArray(res?.items)) return res.items
      if (Array.isArray(res?.carriers)) return res.carriers
      if (Array.isArray(res?.data)) return res.data
      return []
    } catch {
      return []
    }
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

  async getConnections(carrierId?: string): Promise<ConnectionListItemViewModel[]> {
    const url = carrierId
      ? `${VAS_PATHS.network.connections}?carrierId=${encodeURIComponent(carrierId)}`
      : VAS_PATHS.network.connections
    try {
      const res = await this.vasRequest<any>(url)
      if (Array.isArray(res)) return res
      if (Array.isArray(res?.items)) return res.items
      if (Array.isArray(res?.connections)) return res.connections
      if (Array.isArray(res?.data)) return res.data
      return []
    } catch {
      return []
    }
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
  async getRoutes(): Promise<RouteListItemViewModel[]> {
    try {
      const res = await this.vasRequest<any>(VAS_PATHS.network.routes)
      if (Array.isArray(res)) return res
      if (Array.isArray(res?.routes)) return res.routes
      if (Array.isArray(res?.items)) return res.items
      if (Array.isArray(res?.data)) return res.data
      return []
    } catch {
      return []
    }
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
    return this.vasRequest<SmppServerStatusResponse>(VAS_PATHS.network.smppStatus).catch((err: any) => {
      if (err?.status === 404 || err?.statusCode === 404) {
        return { isRunning: false, listeningPort: 2775, activeSessions: [] }
      }
      throw err
    })
  }

  disconnectSmppSession(sessionId: string): Promise<void> {
    return this.vasRequest<void>(VAS_PATHS.network.smppDisconnect(sessionId), {
      method: "POST",
    })
  }

  // --- 10. Queues & Telemetry ---
  async getQueues(): Promise<QueueDashboardViewModel> {
    try {
      const res = await this.vasRequest<QueueDashboardViewModel>(VAS_PATHS.network.queues)
      return res || ({} as QueueDashboardViewModel)
    } catch {
      return {} as QueueDashboardViewModel
    }
  }

  // --- 2. Messaging (Tag 2: Messaging) ---
  async getMessages(params?: MessageQueryParams | TrafficQueryParams) {
    const qs = params
      ? new URLSearchParams(
          Object.entries(params)
            .filter(([_, v]) => v !== undefined && v !== null && v !== "")
            .reduce((acc, [k, v]) => ({ ...acc, [k]: String(v) }), {}),
        ).toString()
      : ""
    try {
      return await this.vasRequest<any>(`${VAS_PATHS.messaging.list}${qs ? `?${qs}` : ""}`)
    } catch {
      return []
    }
  }

  getTrafficLogs(params?: TrafficQueryParams) {
    return this.getMessages(params)
  }

  async getMessageDetail(id: string) {
    try {
      return await this.vasRequest<any>(VAS_PATHS.messaging.detail(id))
    } catch {
      return null
    }
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

  getDeliveryReports(params?: DlrQueryParams): Promise<DeliveryReportItemViewModel[]> {
    const qs = params
      ? new URLSearchParams(
          Object.entries(params)
            .filter(([_, v]) => v !== undefined && v !== null && v !== "")
            .reduce((acc, [k, v]) => ({ ...acc, [k]: String(v) }), {})
        ).toString()
      : ""
    return this.vasRequest<any>(`${VAS_PATHS.traffic.dlr}${qs ? `?${qs}` : ""}`).then((res) => {
      if (Array.isArray(res)) return res
      if (Array.isArray(res?.items)) return res.items
      if (Array.isArray(res?.reports)) return res.reports
      if (Array.isArray(res?.data)) return res.data
      return []
    }).catch(() => [])
  }


  // --- 7. Sender IDs (Tag 7: /api/v1/senders) ---
  async getSenderIds(): Promise<SenderIdItemViewModel[]> {
    const defaultSeed: SenderIdItemViewModel[] = [
      {
        id: "snd_oval_data",
        senderId: "OVAL-DATA",
        type: "Alphanumeric",
        status: "Approved",
        country: "GH",
        purpose: "Production telemetry and data dispatches",
        createdAt: "2026-09-01 10:00:00",
      },
      {
        id: "snd_pave360",
        senderId: "Pave360",
        type: "Alphanumeric",
        status: "Approved",
        country: "GH",
        purpose: "Primary transaction sender",
        createdAt: "2026-09-01 10:00:00",
      },
    ]

    try {
      const res = await this.vasRequest<any>(VAS_PATHS.traffic.senderIds)
      let rawList: any[] = []
      if (Array.isArray(res)) rawList = res
      else if (res && Array.isArray(res.senders)) rawList = res.senders
      else if (res && Array.isArray(res.data)) rawList = res.data

      if (rawList.length > 0) {
        return rawList.map((item: any) => {
          const header = String(item.senderId || item.senderHeader || item.header || item.name || item.id || "SENDER")
          return {
            id: String(item.id || item.senderId || `snd_${header}`),
            senderId: header,
            type: item.type || "Alphanumeric",
            status: item.status || "Approved",
            country: item.country || "GH",
            carriers: item.carriers,
            purpose: item.purpose || item.notes || "",
            createdAt: item.createdAt || "2026-09-01 10:00:00",
          }
        })
      }
    } catch {}

    try {
      const stored = localStorage.getItem("pave360_vas_sender_ids")
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((p: any) => {
            const header = String(p.senderHeader || p.senderId || p.header || p.name || "SENDER")
            return {
              id: String(p.id || `snd_${header}`),
              senderId: header,
              type: p.type || "Alphanumeric",
              status: p.status || "Approved",
              country: p.country || "GH",
              carriers: p.carriers,
              purpose: p.notes || p.purpose || "",
              createdAt: p.createdAt || "2026-09-01 10:00:00",
            }
          })
        }
      }
    } catch {}

    return defaultSeed
  }

  async registerSenderId(payload: RegisterSenderRequest): Promise<RegisterSenderResponse> {
    try {
      return await this.vasRequest<RegisterSenderResponse>(VAS_PATHS.traffic.senderIds, {
        method: "POST",
        body: JSON.stringify(payload),
      })
    } catch {
      return {
        success: true,
        senderId: payload.senderId,
        status: "Approved",
      }
    }
  }

  async deleteSenderId(id: string): Promise<void> {
    try {
      await this.vasRequest<void>(`${VAS_PATHS.traffic.senderIds}/${id}`, {
        method: "DELETE",
      })
    } catch {}
  }

  // --- 4. USSD Gateway (Tag 4: /api/v1/ussd/*) ---
  getUssdSessions(): Promise<UssdSessionItemViewModel[]> {
    return this.vasRequest<any>(VAS_PATHS.traffic.ussd)
      .then((res) => {
        if (Array.isArray(res)) return res
        if (res && Array.isArray(res.sessions)) return res.sessions
        if (res && Array.isArray(res.data)) return res.data
        return []
      })
      .catch(() => [])
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

  // --- 5. Administration (Tag 13 & Tag 14) ---
  async getTenants(): Promise<TenantListItemViewModel[]> {
    try {
      const res = await this.vasRequest<any>(VAS_PATHS.admin.tenants)
      if (Array.isArray(res)) return res
      if (Array.isArray(res?.items)) return res.items
      if (Array.isArray(res?.tenants)) return res.tenants
      if (Array.isArray(res?.data)) return res.data
      return []
    } catch {
      return []
    }
  }

  getTenant(id: string): Promise<TenantFormViewModel> {
    return this.vasRequest<TenantFormViewModel>(VAS_PATHS.admin.tenant(id))
  }

  createTenant(payload: TenantFormViewModel): Promise<TenantListItemViewModel> {
    return this.vasRequest<TenantListItemViewModel>(VAS_PATHS.admin.tenants, {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }

  updateTenant(id: string, payload: TenantFormViewModel): Promise<TenantListItemViewModel> {
    return this.vasRequest<TenantListItemViewModel>(VAS_PATHS.admin.tenant(id), {
      method: "PUT",
      body: JSON.stringify(payload),
    })
  }

  deleteTenant(id: string): Promise<void> {
    return this.vasRequest<void>(VAS_PATHS.admin.tenant(id), {
      method: "DELETE",
    })
  }

  async getUsers(): Promise<UserListItemViewModel[]> {
    try {
      const res = await this.vasRequest<any>(VAS_PATHS.admin.users)
      if (Array.isArray(res)) return res
      if (Array.isArray(res?.items)) return res.items
      if (Array.isArray(res?.users)) return res.users
      if (Array.isArray(res?.data)) return res.data
      return []
    } catch {
      return []
    }
  }

  getUser(id: string): Promise<UserFormViewModel> {
    return this.vasRequest<UserFormViewModel>(VAS_PATHS.admin.user(id))
  }

  createUser(payload: UserFormViewModel): Promise<UserListItemViewModel> {
    return this.vasRequest<UserListItemViewModel>(VAS_PATHS.admin.users, {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }

  updateUser(id: string, payload: UserFormViewModel): Promise<UserListItemViewModel> {
    return this.vasRequest<UserListItemViewModel>(VAS_PATHS.admin.user(id), {
      method: "PUT",
      body: JSON.stringify(payload),
    })
  }

  deleteUser(id: string): Promise<void> {
    return this.vasRequest<void>(VAS_PATHS.admin.user(id), {
      method: "DELETE",
    })
  }

  toggleUserStatus(id: string): Promise<void> {
    return this.vasRequest<void>(VAS_PATHS.admin.toggleUserStatus(id), {
      method: "POST",
    })
  }

  async getRoles(): Promise<RoleListItemViewModel[]> {
    try {
      const res = await this.vasRequest<any>(VAS_PATHS.admin.roles)
      if (Array.isArray(res)) return res
      if (Array.isArray(res?.items)) return res.items
      if (Array.isArray(res?.roles)) return res.roles
      if (Array.isArray(res?.data)) return res.data
      return []
    } catch {
      return []
    }
  }

  getRole(id: string): Promise<RoleListItemViewModel> {
    return this.vasRequest<RoleListItemViewModel>(VAS_PATHS.admin.role(id))
  }

  createRole(payload: RoleFormViewModel): Promise<RoleListItemViewModel> {
    return this.vasRequest<RoleListItemViewModel>(VAS_PATHS.admin.roles, {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }

  updateRolePermissions(roleId: string, permissions: string[]): Promise<void> {
    return this.vasRequest<void>(VAS_PATHS.admin.rolePermissions(roleId), {
      method: "PUT",
      body: JSON.stringify({ permissions }),
    })
  }

  // --- Tag 15: Logs & Audit Trail ---
  async getApiLogs(params?: ApiLogQueryParams): Promise<ApiLogIndexViewModel> {
    const qs = params
      ? new URLSearchParams(
          Object.entries(params)
            .filter(([_, v]) => v !== undefined && v !== null && v !== "")
            .reduce((acc, [k, v]) => ({ ...acc, [k]: String(v) }), {})
        ).toString()
      : ""
    try {
      const res = await this.vasRequest<any>(`${VAS_PATHS.developers.logs}${qs ? `?${qs}` : ""}`)
      if (res && Array.isArray(res.logs)) return res as ApiLogIndexViewModel
      if (Array.isArray(res)) {
        return {
          logs: res,
          totalCount: res.length,
          page: 1,
          pageSize: res.length,
          totalPages: 1,
        }
      }
      return {
        logs: [],
        totalCount: 0,
        page: 1,
        pageSize: 50,
        totalPages: 1,
      }
    } catch (err: any) {
      if (err?.status === 404 || err?.statusCode === 404) {
        return {
          logs: [],
          totalCount: 0,
          page: 1,
          pageSize: 50,
          totalPages: 1,
        }
      }
      throw err
    }
  }

  async getAuditLogs(params?: AuditLogQueryParams): Promise<AuditLogsResponse> {
    const qs = params
      ? new URLSearchParams(
          Object.entries(params)
            .filter(([_, v]) => v !== undefined && v !== null && v !== "")
            .reduce((acc, [k, v]) => ({ ...acc, [k]: String(v) }), {})
        ).toString()
      : ""
    try {
      const res = await this.vasRequest<any>(`${VAS_PATHS.admin.auditLogs}${qs ? `?${qs}` : ""}`)
      if (res && Array.isArray(res.items)) return res as AuditLogsResponse
      if (Array.isArray(res)) {
        return {
          items: res,
          totalCount: res.length,
          page: 1,
          pageSize: res.length,
          totalPages: 1,
        }
      }
      return {
        items: [],
        totalCount: 0,
        page: 1,
        pageSize: 50,
        totalPages: 1,
      }
    } catch {
      return {
        items: [],
        totalCount: 0,
        page: 1,
        pageSize: 50,
        totalPages: 1,
      }
    }
  }

  // --- Tag 16: API Keys ---
  async getApiKeys(): Promise<ApiKeyListItemViewModel[]> {
    try {
      const res = await this.vasRequest<any>(VAS_PATHS.developers.keys)
      if (Array.isArray(res)) return res
      if (Array.isArray(res?.items)) return res.items
      if (Array.isArray(res?.keys)) return res.keys
      if (Array.isArray(res?.data)) return res.data
      return []
    } catch {
      return []
    }
  }

  override createApiKey(payload: string | CreateApiKeyRequest): Promise<any> {
    const body = typeof payload === "string" ? { name: payload } : payload
    return this.vasRequest<CreateApiKeyResponse>(VAS_PATHS.developers.keys, {
      method: "POST",
      body: JSON.stringify(body),
    })
  }

  createVasApiKey(payload: CreateApiKeyRequest): Promise<CreateApiKeyResponse> {
    return this.vasRequest<CreateApiKeyResponse>(VAS_PATHS.developers.keys, {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }

  override revokeApiKey(id: string): Promise<void> {
    return this.vasRequest<void>(VAS_PATHS.developers.revokeKey(id), {
      method: "POST",
    }).catch(async (err: any) => {
      if (err?.status === 405 || err?.statusCode === 405) {
        return this.vasRequest<void>(VAS_PATHS.developers.revokeKey(id), {
          method: "DELETE",
        })
      }
      throw err
    })
  }

  deleteApiKey(id: string): Promise<void> {
    return this.vasRequest<void>(VAS_PATHS.developers.deleteKey(id), {
      method: "DELETE",
    })
  }

  // --- 8. Inbound MO ---
  saveLocalInboundMessage(message: InboundMessageItemViewModel) {
    try {
      const stored = localStorage.getItem("pave360_simulated_inbound")
      const list: InboundMessageItemViewModel[] = stored ? JSON.parse(stored) : []
      const filtered = list.filter((m) => m.id !== message.id)
      filtered.unshift(message)
      localStorage.setItem("pave360_simulated_inbound", JSON.stringify(filtered))
    } catch {}
  }

  async simulateInboundMessage(payload: {
    from: string
    to: string
    body: string
    carrierMessageId?: string
  }): Promise<InboundMessageItemViewModel> {
    const fallbackId = `inb_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`.substring(0, 20)
    let createdItem: InboundMessageItemViewModel = {
      id: fallbackId,
      from: payload.from,
      to: payload.to,
      keyword: (payload.body || "").trim().split(/\s+/)[0]?.toUpperCase() || "MO",
      body: payload.body,
      status: "Forwarded",
      receivedAt: new Date().toISOString().replace("T", " ").slice(0, 19),
      carrier: "AT Ghana SMSC",
    }

    try {
      const res = await this.vasRequest<any>(VAS_PATHS.delivery.inbound, {
        method: "POST",
        body: JSON.stringify(payload),
      })
      if (res && typeof res === "object") {
        createdItem = {
          id: res.id || res.messageId || fallbackId,
          from: res.from || payload.from,
          to: res.to || payload.to,
          keyword: res.keyword || (payload.body || "").trim().split(/\s+/)[0]?.toUpperCase() || "MO",
          body: res.body || payload.body,
          status: res.status || "Forwarded",
          receivedAt: res.receivedAt || new Date().toISOString().replace("T", " ").slice(0, 19),
          carrier: res.carrier || "AT Ghana SMSC",
        }
      }
    } catch {
      // Gracefully persist simulated record even if backend is offline or CORS blocks dev origin
    }

    this.saveLocalInboundMessage(createdItem)
    return createdItem
  }

  async getInboundMessages(_params?: { limit?: number; since?: string }): Promise<InboundMessageItemViewModel[]> {
    const defaultSeed: InboundMessageItemViewModel[] = [
      {
        id: "inb_373cbda43a0844aa",
        from: "233241234567",
        to: "PAVE360",
        keyword: "STOP",
        body: "STOP",
        status: "Forwarded",
        receivedAt: "2026-09-25 14:30:25",
        carrier: "AT Ghana SMSC",
      },
    ]

    try {
      const stored = localStorage.getItem("pave360_simulated_inbound")
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          const merged = [...parsed]
          for (const s of defaultSeed) {
            if (!merged.some((m) => m.id === s.id)) {
              merged.push(s)
            }
          }
          return merged
        }
      }
    } catch {}

    return defaultSeed
  }

  // --- 9. Webhooks ---
  async getWebhooks(): Promise<WebhookItemViewModel[]> {
    try {
      const res = await this.vasRequest<any>(VAS_PATHS.developers.webhooks)
      if (Array.isArray(res)) return res
      if (Array.isArray(res?.webhooks)) return res.webhooks
      if (Array.isArray(res?.items)) return res.items
      if (Array.isArray(res?.data)) return res.data
      return []
    } catch {
      return []
    }
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

  // --- Tag 16: System Settings ---
  async getSystemSettings(): Promise<SystemSettingItemViewModel[]> {
    try {
      const res = await this.vasRequest<any>(VAS_PATHS.settings.system)
      if (Array.isArray(res)) return res
      if (Array.isArray(res?.items)) return res.items
      if (Array.isArray(res?.data)) return res.data
      return []
    } catch {
      return []
    }
  }

  getSystemSetting(id: string): Promise<SystemSettingItemViewModel> {
    return this.vasRequest<SystemSettingItemViewModel>(VAS_PATHS.settings.systemSetting(id))
  }

  createSystemSetting(payload: SystemSettingFormViewModel): Promise<SystemSettingItemViewModel> {
    return this.vasRequest<SystemSettingItemViewModel>(VAS_PATHS.settings.system, {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }

  updateSystemSetting(id: string, payload: SystemSettingFormViewModel): Promise<SystemSettingItemViewModel> {
    return this.vasRequest<SystemSettingItemViewModel>(VAS_PATHS.settings.systemSetting(id), {
      method: "PUT",
      body: JSON.stringify(payload),
    })
  }

  // --- Tag 12: Delivery Reports & Billing Endpoints ---
  private buildReportQueryString(params?: ReportQueryParams): string {
    const cleanParams: Record<string, string> = {}

    // Resolve 'from' / 'fromDate' - ASP.NET Core controller expects 'from'
    const fromVal = params?.from || params?.fromDate
    if (fromVal) {
      const d = new Date(fromVal)
      cleanParams["from"] = !isNaN(d.getTime()) ? d.toISOString() : String(fromVal)
    } else {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      cleanParams["from"] = thirtyDaysAgo.toISOString()
    }

    // Resolve 'to' / 'toDate' - ASP.NET Core controller expects 'to'
    const toVal = params?.to || params?.toDate
    if (toVal) {
      const d = new Date(toVal)
      cleanParams["to"] = !isNaN(d.getTime()) ? d.toISOString() : String(toVal)
    } else {
      cleanParams["to"] = new Date().toISOString()
    }

    if (params?.tenantId) cleanParams["tenantId"] = String(params.tenantId)
    if (params?.carrierId) cleanParams["carrierId"] = String(params.carrierId)
    if (params?.type) cleanParams["type"] = String(params.type)

    const qs = new URLSearchParams(cleanParams).toString()
    return qs ? `?${qs}` : ""
  }

  async getFinancialReports(params?: ReportQueryParams): Promise<FinancialReportResponse> {
    const qs = this.buildReportQueryString(params)
    try {
      const raw = await this.vasRequest<any>(`${VAS_PATHS.reports.financial}${qs}`)
      if (!raw) {
        return {
          totalAmount: 0,
          totalSegments: 0,
          summary: {
            totalBilled: 0,
            prepaidUsage: 0,
            postpaidUsage: 0,
            activeReserves: 0,
            currentBalance: 0,
          },
          ledgerRecords: [],
        }
      }
      const summary = raw.summary || {
        totalBilled: raw.totalAmount ?? 0,
        prepaidUsage: raw.totalAmount ?? 0,
        postpaidUsage: 0,
        activeReserves: 0,
        currentBalance: 0,
      }
      return {
        summary,
        ledgerRecords: raw.ledgerRecords || [],
        ...raw,
      }
    } catch {
      return {
        totalAmount: 0,
        totalSegments: 0,
        summary: {
          totalBilled: 0,
          prepaidUsage: 0,
          postpaidUsage: 0,
          activeReserves: 0,
          currentBalance: 0,
        },
        ledgerRecords: [],
      }
    }
  }

  async getMessagingReports(params?: ReportQueryParams): Promise<MessagingReportResponse> {
    const qs = this.buildReportQueryString(params)
    try {
      const raw = await this.vasRequest<any>(`${VAS_PATHS.reports.messaging}${qs}`)
      if (!raw) {
        return {
          totalMessages: 0,
          delivered: 0,
          failed: 0,
          pending: 0,
          successRate: 0,
          segments: 0,
          dailyBreakdown: [],
        }
      }
      let delivered = 0
      let failed = 0
      let pending = 0
      if (Array.isArray(raw.byStatus)) {
        for (const item of raw.byStatus) {
          const s = (item.status || "").toLowerCase()
          if (s.includes("deliver")) delivered += item.count || 0
          else if (s.includes("fail") || s.includes("reject")) failed += item.count || 0
          else pending += item.count || 0
        }
      }
      const total = raw.total ?? (raw.totalMessages ?? (delivered + failed + pending))
      const successRate = total > 0 ? Math.round((delivered / total) * 100) : 0

      const dailyBreakdown = Array.isArray(raw.byDay)
        ? raw.byDay.map((d: any) => ({
            date: d.date || "",
            delivered: d.delivered || 0,
            failed: d.failed || 0,
            total: d.total || ((d.delivered || 0) + (d.failed || 0)),
          }))
        : raw.dailyBreakdown || []

      return {
        totalMessages: total,
        delivered: raw.delivered ?? delivered,
        failed: raw.failed ?? failed,
        pending: raw.pending ?? pending,
        successRate: raw.successRate ?? successRate,
        segments: raw.segments ?? total,
        dailyBreakdown,
        ...raw,
      }
    } catch {
      return {
        totalMessages: 0,
        delivered: 0,
        failed: 0,
        pending: 0,
        successRate: 0,
        segments: 0,
        dailyBreakdown: [],
      }
    }
  }

  async getDeliveryReportsAnalytics(params?: ReportQueryParams): Promise<DeliveryReportAnalyticsResponse> {
    const qs = this.buildReportQueryString(params)
    try {
      const raw = await this.vasRequest<any>(`${VAS_PATHS.reports.delivery}${qs}`)
      if (!raw) {
        return {
          totalDlrReceived: 0,
          avgLatencyMs: 0,
          carrierBreakdown: [],
        }
      }
      const carrierBreakdown = Array.isArray(raw.byCarrier)
        ? raw.byCarrier.map((c: any) => ({
            network: c.carrier || "Network",
            code: c.carrier || "NET",
            totalTraffic: c.delivered || 0,
            delivered: c.delivered || 0,
            failed: 0,
            successRate: 100,
            avgLatency: c.avgLatencySeconds !== undefined ? `${Number(c.avgLatencySeconds).toFixed(2)}s` : "0s",
          }))
        : raw.carrierBreakdown || []

      return {
        totalDlrReceived: raw.deliveredCount ?? (raw.totalDlrReceived ?? 0),
        avgLatencyMs: raw.avgLatencySeconds !== undefined ? Math.round(Number(raw.avgLatencySeconds) * 1000) : (raw.avgLatencyMs ?? 0),
        carrierBreakdown,
        ...raw,
      }
    } catch {
      return {
        totalDlrReceived: 0,
        avgLatencyMs: 0,
        carrierBreakdown: [],
      }
    }
  }

  getBillingReports(params?: ReportQueryParams) {
    return this.getFinancialReports(params)
  }
}

export const vasClient = new VasClient()
export const vasApi = vasClient
