import { store } from "../store"
import { vasClient } from "../services/vas/vasClient"
import {
  setSignedIn,
  setUser,
  setOtpPending,
  clearAuth,
  emptyOperator,
  switchPersona,
} from "../store/slices/authSlice"
import type { AppDispatch } from "../store"
import { env } from "../config/env"
import type { User } from "../store/types"
import type { AuthUserResponse } from "../services/vas/types"
import { recordVasActivity } from "../lib/vasActivityStore"
import { queryClient } from "../lib/queryClient"

export type LoginResult =
  | { ok: true; requiresOtp?: false }
  | { ok: true; requiresOtp: true }
  | { ok: false; error: string }

export type OtpResult = { ok: true } | { ok: false; error: string }

export function deriveDisplayName(email: string): string {
  const local = email.split("@")[0] || "admin"
  return (
    local
      .split(/[._-]/)
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ") || "Admin"
  )
}

export function mapVasUser(raw: AuthUserResponse, fallbackEmail?: string): User {
  const base = emptyOperator()
  const email = (raw.email || fallbackEmail || "").trim()
  const defaultName = email ? deriveDisplayName(email) : "Admin"
  const primaryRole = (raw.roles?.[0] || "").toUpperCase()
  const role: User["role"] =
    primaryRole === "SUPERADMIN" || primaryRole === "SUPER_ADMIN"
      ? "SUPER_ADMIN"
      : primaryRole === "OPERATOR"
      ? "OPERATOR"
      : "ADMIN"

  return {
    ...base,
    id: raw.id || (email ? `operator-${email.toLowerCase().replace(/[^a-z0-9]/g, "_")}` : base.id),
    name: raw.fullName || defaultName,
    email,
    phone: "",
    company: raw.tenantName || "Pave360 VAS",
    status: "ACTIVE",
    role,
    profileCompleted: 100,
    tenantId: raw.tenantId,
    tenantName: raw.tenantName,
    isPlatformUser: raw.isPlatformUser,
    roles: raw.roles || [],
    permissions: raw.permissions || [],
    lastLoginAt: raw.lastLoginAt,
  }
}

export async function loginOperator(
  email: string,
  password: string,
  rememberMe = true,
): Promise<LoginResult> {
  const trimmed = email.trim()
  if (!trimmed) return { ok: false, error: "Enter your email." }
  if (!password) return { ok: false, error: "Enter your password." }

  const dynamicName = deriveDisplayName(trimmed)
  const operatorUser: User = {
    id: `operator-${trimmed.toLowerCase().replace(/[^a-z0-9]/g, "_")}`,
    name: dynamicName,
    email: trimmed,
    phone: "",
    company: "Pave360 VAS",
    status: "ACTIVE",
    role: "ADMIN",
    profileCompleted: 100,
  }

  // Sandbox Mode: Use local state
  if (env.isSandbox) {
    store.dispatch(setUser(operatorUser))
    store.dispatch(setSignedIn(true))
    store.dispatch(switchPersona("ADMIN"))
    store.dispatch(setOtpPending({ pending: false, email: null }))
    recordVasActivity({
      action: "auth.login",
      entity: "User",
      summary: `User ${trimmed} signed in (Sandbox)`,
      user: trimmed,
    })
    return { ok: true }
  }

  // Live Mode: Connect to VAS Gateway (ASP.NET Core Cookie Auth)
  try {
    const authUser = await vasClient.loginVas({
      email: trimmed,
      password,
      rememberMe,
    })

    const userProfile = mapVasUser(authUser, trimmed)
    store.dispatch(setUser(userProfile))
    store.dispatch(setSignedIn(true))
    store.dispatch(switchPersona("ADMIN"))
    store.dispatch(setOtpPending({ pending: false, email: null }))

    if (typeof window !== "undefined") {
      localStorage.setItem("pave360_vas_authenticated", "true")
      localStorage.setItem("pave360_vas_user", JSON.stringify(userProfile))
    }

    recordVasActivity({
      action: "auth.login",
      entity: "User",
      summary: `User ${trimmed} signed in via VAS Gateway`,
      user: trimmed,
    })
    return { ok: true }
  } catch (err: unknown) {
    const apiErr = err as { message?: string; status?: number; data?: Record<string, unknown> }
    const status = apiErr.status
    let errorMsg = apiErr.message || "Sign-in failed. Please verify your credentials."

    if (apiErr.data?.detail && typeof apiErr.data.detail === "string") {
      errorMsg = apiErr.data.detail
    } else if (status === 408) {
      errorMsg = "Gateway request timed out. The server is taking longer than expected. Please try again."
    } else if (errorMsg === "Failed to fetch") {
      errorMsg = "Unable to connect to https://vas.pave360.com. Please check your internet connection or server status."
    }

    // Return real validation/auth errors
    if (status === 400 || status === 401 || status === 408 || status === 423) {
      return { ok: false, error: errorMsg }
    }

    // Graceful offline fallback if server is unreachable
    if (!env.isLive && (status === undefined || status === 0 || status >= 500)) {
      console.warn("VAS Gateway unreachable; falling back to offline demo session:", errorMsg)
      store.dispatch(setUser(operatorUser))
      store.dispatch(setSignedIn(true))
      store.dispatch(switchPersona("ADMIN"))
      store.dispatch(setOtpPending({ pending: false, email: null }))
      if (typeof window !== "undefined") {
        localStorage.setItem("pave360_vas_authenticated", "true")
        localStorage.setItem("pave360_vas_user", JSON.stringify(operatorUser))
      }
      return { ok: true }
    }

    return { ok: false, error: errorMsg }
  }
}

/**
 * Check if the user has an active session cookie on the VAS Gateway
 * (Called on app load or reload to rehydrate operator session)
 */
export async function checkAuthSession(): Promise<boolean> {
  if (env.isSandbox) {
    return store.getState().auth.signedIn
  }

  try {
    const authUser = await vasClient.getCurrentUser()
    if (!authUser || !authUser.id) {
      return store.getState().auth.signedIn
    }

    const userProfile = mapVasUser(authUser)
    store.dispatch(setUser(userProfile))
    store.dispatch(setSignedIn(true))
    store.dispatch(switchPersona("ADMIN"))
    if (typeof window !== "undefined") {
      localStorage.setItem("pave360_vas_authenticated", "true")
      localStorage.setItem("pave360_vas_user", JSON.stringify(userProfile))
    }
    return true
  } catch (err: any) {
    if (err?.status === 401 || err?.statusCode === 401) {
      // Backend explicitly rejected the session
      store.dispatch(setSignedIn(false))
      if (typeof window !== "undefined") {
        localStorage.removeItem("pave360_vas_authenticated")
        localStorage.removeItem("pave360_vas_user")
        localStorage.removeItem("pave360_access_token")
      }
      return false
    }

    // Preserve local session on background verification or network/CORS issues
    const hasLocalSession =
      store.getState().auth.signedIn ||
      (typeof window !== "undefined" && localStorage.getItem("pave360_vas_authenticated") === "true")

    if (hasLocalSession) {
      if (!store.getState().auth.signedIn) {
        store.dispatch(setSignedIn(true))
      }
      return true
    }

    return false
  }
}

export async function verifyOperatorOtp(email: string, _otp: string): Promise<OtpResult> {
  const trimmed = email.trim()
  const dynamicName = deriveDisplayName(trimmed)
  const operatorUser: User = {
    id: `operator-${trimmed.toLowerCase().replace(/[^a-z0-9]/g, "_")}`,
    name: dynamicName,
    email: trimmed,
    phone: "",
    company: "Pave360 VAS",
    status: "ACTIVE",
    role: "ADMIN",
    profileCompleted: 100,
  }

  store.dispatch(setUser(operatorUser))
  store.dispatch(setSignedIn(true))
  store.dispatch(setOtpPending({ pending: false, email: null }))
  return { ok: true }
}

export function registerOperator(
  details: { name: string; email: string; company: string },
  dispatch: AppDispatch,
) {
  dispatch(
    setUser({
      id: "operator-01",
      name: details.name,
      email: details.email,
      phone: "",
      company: details.company || "Pave360 VAS",
      status: "ACTIVE",
      role: "ADMIN",
      profileCompleted: 100,
    }),
  )
  dispatch(setSignedIn(true))
}

export function logoutOperator() {
  const currentEmail = store.getState().auth?.user?.email || "admin@pave360.com"
  recordVasActivity({
    action: "auth.logout",
    entity: "User",
    summary: `User signed out`,
    user: currentEmail,
  })

  if (typeof window !== "undefined") {
    localStorage.removeItem("pave360_vas_authenticated")
    localStorage.removeItem("pave360_vas_user")
  }

  // Cancel any active background queries and purge cache
  queryClient.cancelQueries()
  queryClient.clear()

  // Reset Redux authentication state immediately
  store.dispatch(clearAuth())
}

export async function changePasswordOperator(
  currentPassword: string,
  newPassword: string,
): Promise<{ ok: boolean; message: string }> {
  try {
    const res = await vasClient.changePassword({ currentPassword, newPassword })
    return { ok: true, message: res.message || "Password changed successfully." }
  } catch (err: unknown) {
    const apiErr = err as { message?: string }
    return { ok: false, message: apiErr.message || "Failed to update password." }
  }
}

export function restoreSessionFromStorage() {
  // Session is handled via localStorage Redux hydration and checkAuthSession
}

