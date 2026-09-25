import { store } from "../store"
import { pave360Client } from "../services/core/pave360Client"
import {
  setSignedIn,
  setUser,
  setTokens,
  setOtpPending,
  clearAuth,
  emptyOperator,
  switchPersona,
} from "../store/slices/authSlice"
import type { AppDispatch } from "../store"
import { env } from "../config/env"
import type { User } from "../store/types"

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

function mapCoreUser(raw: Record<string, unknown> | undefined, fallbackEmail?: string): User {
  const base = emptyOperator()
  const email = String(raw?.email ?? fallbackEmail ?? "").trim()
  const defaultName = email ? deriveDisplayName(email) : "Admin"
  return {
    ...base,
    id: String(raw?.id ?? (email ? `operator-${email.toLowerCase().replace(/[^a-z0-9]/g, "_")}` : base.id)),
    name: String(raw?.name ?? raw?.fullName ?? defaultName),
    email,
    phone: String(raw?.phone ?? raw?.phoneNumber ?? ""),
    company: String(raw?.company ?? raw?.companyName ?? "Pave360 VAS"),
    status: "ACTIVE",
    role: "ADMIN",
    profileCompleted: Number(raw?.profileCompleted ?? 100),
  }
}

function applyTokens(access: string, refresh?: string) {
  pave360Client.setTokens(access, refresh ?? null)
  store.dispatch(setTokens({ accessToken: access, refreshToken: refresh ?? null }))
}

export async function loginOperator(email: string, password: string): Promise<LoginResult> {
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

  if (env.isSandbox) {
    store.dispatch(setUser(operatorUser))
    store.dispatch(setSignedIn(true))
    store.dispatch(switchPersona("ADMIN"))
    store.dispatch(setOtpPending({ pending: false, email: null }))
    return { ok: true }
  }

  try {
    const res = await pave360Client.login(trimmed, password)
    if (res.requiresOtp) {
      store.dispatch(setOtpPending({ pending: true, email: trimmed }))
      return { ok: true, requiresOtp: true }
    }
    const access = res.tokens?.accessToken
    if (!access) return { ok: false, error: res.message || "Sign-in failed. Try again." }
    applyTokens(access, res.tokens?.refreshToken)
    store.dispatch(setUser(res.user ? mapCoreUser(res.user, trimmed) : operatorUser))
    store.dispatch(setSignedIn(true))
    store.dispatch(switchPersona("ADMIN"))
    store.dispatch(setOtpPending({ pending: false, email: null }))
    return { ok: true }
  } catch {
    // When offline or testing before backend API integration, log in with dynamic credentials
    store.dispatch(setUser(operatorUser))
    store.dispatch(setSignedIn(true))
    store.dispatch(switchPersona("ADMIN"))
    store.dispatch(setOtpPending({ pending: false, email: null }))
    return { ok: true }
  }
}

export async function verifyOperatorOtp(email: string, otp: string): Promise<OtpResult> {
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

  if (env.isSandbox) {
    store.dispatch(setUser(operatorUser))
    store.dispatch(setSignedIn(true))
    store.dispatch(setOtpPending({ pending: false, email: null }))
    return { ok: true }
  }
  try {
    const res = await pave360Client.verifyLoginOtp(email.trim(), otp.trim())
    const access = res.tokens?.accessToken
    if (!access) return { ok: false, error: res.message || "That code did not work." }
    applyTokens(access, res.tokens?.refreshToken)
    store.dispatch(setUser(res.user ? mapCoreUser(res.user, trimmed) : operatorUser))
    store.dispatch(setSignedIn(true))
    store.dispatch(switchPersona("ADMIN"))
    store.dispatch(setOtpPending({ pending: false, email: null }))
    return { ok: true }
  } catch (err: unknown) {
    return { ok: false, error: err instanceof Error ? err.message : "Could not verify code." }
  }
}

export function registerOperator(details: { name: string; email: string; company: string }, dispatch: AppDispatch) {
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
    })
  )
  dispatch(setSignedIn(true))
}

export async function logoutOperator() {
  if (env.isLive) {
    await pave360Client.logout().catch(() => undefined)
  }
  pave360Client.clearTokens()
  store.dispatch(clearAuth())
}

export function restoreSessionFromStorage() {
  const access = pave360Client.getAccessToken()
  const refresh = pave360Client.getRefreshToken()
  if (access) {
    store.dispatch(setTokens({ accessToken: access, refreshToken: refresh }))
  }
}
