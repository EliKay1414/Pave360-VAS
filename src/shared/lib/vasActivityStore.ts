import * as React from "react"
import { store } from "../store"

export interface VasMetricData {
  messagesToday: number
  avgLatency: string
  messagesThisMonth: number
  deliveryRate: number
  currentTps: number
  submitted: number
  delivered: number
  failed: number
  pendingQueue: number
  queueDepth: number
  platform: {
    tenantsTotal: number
    tenantsActive: number
    usersTotal: number
    usersActive: number
    tenantsThisMonth: number
    activeCarriers: number
  }
  carrierConnections: Array<{
    id: string
    name: string
    status: "Connected" | "Disconnected" | "Connecting"
  }>
  recentAuditActivity: Array<{
    id: string
    when: string
    action: string
    entity: string
    summary: string
    user: string
  }>
}

const STORAGE_KEY = "pave360_vas_telemetry_v1"

const SEED_DATA: VasMetricData = {
  messagesToday: 2,
  avgLatency: "0s",
  messagesThisMonth: 22,
  deliveryRate: 100,
  currentTps: 0,
  submitted: 2,
  delivered: 2,
  failed: 0,
  pendingQueue: 0,
  queueDepth: 0,
  platform: {
    tenantsTotal: 2,
    tenantsActive: 2,
    usersTotal: 2,
    usersActive: 2,
    tenantsThisMonth: 1,
    activeCarriers: 3,
  },
  carrierConnections: [
    { id: "c1", name: "AT Ghana SMSC", status: "Connected" },
    { id: "c2", name: "MTN GH Primary", status: "Connected" },
    { id: "c3", name: "Telecel Core", status: "Connected" },
  ],
  recentAuditActivity: [
    {
      id: "a1",
      when: "2026-09-26 14:48",
      action: "auth.login",
      entity: "User",
      summary: "User admin@pave360.com signed in",
      user: "admin@pave360.com",
    },
    {
      id: "a2",
      when: "2026-09-26 14:12",
      action: "carrier.connect",
      entity: "Carrier",
      summary: "Carrier bind AT Ghana SMSC established",
      user: "system",
    },
    {
      id: "a3",
      when: "2026-09-26 13:49",
      action: "tenant.create",
      entity: "Tenant",
      summary: "Tenant 'Hubtel Ghana' onboarded",
      user: "admin@pave360.com",
    },
    {
      id: "a4",
      when: "2026-09-26 13:00",
      action: "routing.rule_add",
      entity: "Routing",
      summary: "Added routing prefix 62001 -> MTN Primary",
      user: "admin@pave360.com",
    },
  ],
}

function loadFromStorage(): VasMetricData {
  if (typeof window === "undefined") return SEED_DATA
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      saveToStorage(SEED_DATA)
      return SEED_DATA
    }
    const parsed = JSON.parse(raw)
    return {
      ...SEED_DATA,
      ...parsed,
      platform: { ...SEED_DATA.platform, ...(parsed.platform || {}) },
      carrierConnections: Array.isArray(parsed.carrierConnections) && parsed.carrierConnections.length > 0
        ? parsed.carrierConnections
        : SEED_DATA.carrierConnections,
      recentAuditActivity: Array.isArray(parsed.recentAuditActivity)
        ? parsed.recentAuditActivity
        : SEED_DATA.recentAuditActivity,
    }
  } catch {
    return SEED_DATA
  }
}

function saveToStorage(data: VasMetricData): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    /* ignore storage quota errors */
  }
}

let currentTelemetry: VasMetricData = loadFromStorage()
const listeners = new Set<() => void>()

function notifyListeners() {
  saveToStorage(currentTelemetry)
  listeners.forEach((listener) => {
    try {
      listener()
    } catch {
      /* ignore */
    }
  })
}

// Cross-tab synchronization
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === STORAGE_KEY && e.newValue) {
      try {
        currentTelemetry = JSON.parse(e.newValue)
        listeners.forEach((l) => l())
      } catch {
        /* ignore */
      }
    }
  })
}

export function formatActivityTimestamp(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, "0")
  const d = String(now.getDate()).padStart(2, "0")
  const hh = String(now.getHours()).padStart(2, "0")
  const mm = String(now.getMinutes()).padStart(2, "0")
  return `${y}-${m}-${d} ${hh}:${mm}`
}

function getCurrentUserEmail(): string {
  try {
    const state = store.getState()
    return state.auth?.user?.email || "admin@pave360.com"
  } catch {
    return "admin@pave360.com"
  }
}

export interface ActivityEntry {
  action: string
  entity: string
  summary: string
  user?: string
}

/**
 * Records an activity globally across the VAS app.
 * Automatically updates recentAuditActivity, increments relevant metrics,
 * and notifies all dashboard subscribers in real time.
 */
export function recordVasActivity(entry: ActivityEntry): void {
  const user = entry.user || getCurrentUserEmail()
  const timestamp = formatActivityTimestamp()

  const newActivity = {
    id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    when: timestamp,
    action: entry.action,
    entity: entry.entity,
    summary: entry.summary,
    user,
  }

  // Prepend to recent activities (keep latest 50)
  const updatedActivities = [newActivity, ...currentTelemetry.recentAuditActivity].slice(0, 50)

  // Dynamic metric adjustments based on action & entity
  const updatedPlatform = { ...currentTelemetry.platform }
  let { messagesToday, messagesThisMonth, submitted, delivered, failed } = currentTelemetry

  if (entry.entity === "Tenant") {
    if (entry.action.includes("create")) {
      updatedPlatform.tenantsTotal += 1
      updatedPlatform.tenantsActive += 1
      updatedPlatform.tenantsThisMonth += 1
    }
  } else if (entry.entity === "User") {
    if (entry.action.includes("create")) {
      updatedPlatform.usersTotal += 1
      updatedPlatform.usersActive += 1
    }
  } else if (entry.entity === "Carrier") {
    if (entry.action.includes("create") || entry.action.includes("connect")) {
      updatedPlatform.activeCarriers = Math.max(updatedPlatform.activeCarriers, currentTelemetry.carrierConnections.length + 1)
    }
  } else if (entry.entity === "Traffic" || entry.entity === "USSD") {
    messagesToday += 1
    messagesThisMonth += 1
    submitted += 1
    delivered += 1
  }

  const deliveryRate = submitted > 0 ? Math.round((delivered / submitted) * 100) : 100

  currentTelemetry = {
    ...currentTelemetry,
    messagesToday,
    messagesThisMonth,
    submitted,
    delivered,
    failed,
    deliveryRate,
    platform: updatedPlatform,
    recentAuditActivity: updatedActivities,
  }

  notifyListeners()
}

/**
 * Updates a carrier's live bind status dynamically on the consolidated dashboard.
 */
export function updateVasCarrierStatus(
  carrierId: string,
  name: string,
  status: "Connected" | "Disconnected" | "Connecting"
): void {
  const existing = [...currentTelemetry.carrierConnections]
  const idx = existing.findIndex((c) => c.id === carrierId || c.name.toLowerCase() === name.toLowerCase())

  if (idx >= 0) {
    existing[idx] = { ...existing[idx], status }
  } else {
    existing.push({ id: carrierId, name, status })
  }

  const activeCarriers = existing.filter((c) => c.status === "Connected").length

  currentTelemetry = {
    ...currentTelemetry,
    carrierConnections: existing,
    platform: {
      ...currentTelemetry.platform,
      activeCarriers,
    },
  }

  recordVasActivity({
    action: `carrier.${status.toLowerCase()}`,
    entity: "Carrier",
    summary: `Carrier interconnect '${name}' is now ${status}`,
  })
}

/**
 * Updates platform counts directly (e.g., when deleting or archiving).
 */
export function updateVasPlatformCounts(delta: Partial<VasMetricData["platform"]>): void {
  currentTelemetry = {
    ...currentTelemetry,
    platform: {
      ...currentTelemetry.platform,
      ...delta,
    },
  }
  notifyListeners()
}

/**
 * React persistent hook for real-time consolidated dashboard telemetry.
 * React 18/19 native subscription: 0ms lag, updates across any page action.
 */
export function useVasTelemetry(): VasMetricData {
  return React.useSyncExternalStore(
    (callback) => {
      listeners.add(callback)
      return () => listeners.delete(callback)
    },
    () => currentTelemetry,
    () => SEED_DATA
  )
}
