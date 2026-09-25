/**
 * Real-Time Cross-Window / Cross-Tab Synchronization
 * Keeps Pave360 VAS portal in sync instantly across separate browser windows/tabs
 * using BroadcastChannel and window storage events with loop prevention.
 */

export interface SyncMessage {
  type: "STORE_SYNC" | "PING"
  originTabId: string
  timestamp: number
  payload?: any
}

const CHANNEL_NAME = "pave360_vas_sync"
export const TAB_ID = `tab_${Math.random().toString(36).slice(2, 9)}_${Date.now()}`

let channel: BroadcastChannel | null = null
let isRemoteSyncInProgress = false
const listeners: Array<(msg: SyncMessage) => void> = []

// Initialize BroadcastChannel if available in browser
if (typeof window !== "undefined" && "BroadcastChannel" in window) {
  try {
    channel = new BroadcastChannel(CHANNEL_NAME)
    channel.onmessage = (event: MessageEvent<SyncMessage>) => {
      const msg = event.data
      if (!msg || msg.originTabId === TAB_ID) return
      notifySubscribers(msg)
    }
  } catch (err) {
    console.warn("BroadcastChannel initialization warning:", err)
  }
}

// Fallback / complement: listen to storage events across windows
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e: StorageEvent) => {
    if (e.key === "pave360_vas_store_v1" && e.newValue) {
      notifySubscribers({
        type: "STORE_SYNC",
        originTabId: "storage_event",
        timestamp: Date.now(),
      })
    }
  })
}

export function notifySubscribers(msg: SyncMessage) {
  isRemoteSyncInProgress = true
  try {
    for (const listener of listeners) {
      try {
        listener(msg)
      } catch (e) {
        console.error("Error in cross-tab sync listener:", e)
      }
    }
  } finally {
    // Reset flag after microtask tick to ensure local dispatch doesn't echo back
    setTimeout(() => {
      isRemoteSyncInProgress = false
    }, 100)
  }
}

/**
 * Register a listener callback that executes whenever another window updates data
 */
export function subscribeToCrossTabSync(callback: (msg: SyncMessage) => void): () => void {
  listeners.push(callback)
  return () => {
    const idx = listeners.indexOf(callback)
    if (idx !== -1) listeners.splice(idx, 1)
  }
}

/**
 * Broadcast an update message to all other open tabs/windows
 */
export function broadcastCrossTabUpdate(type: SyncMessage["type"] = "STORE_SYNC", payload?: any) {
  if (isRemoteSyncInProgress) {
    // Don't re-broadcast changes that originated from a remote sync event
    return
  }

  const message: SyncMessage = {
    type,
    originTabId: TAB_ID,
    timestamp: Date.now(),
    payload,
  }

  if (channel) {
    try {
      channel.postMessage(message)
    } catch (e) {
      console.warn("Could not post cross-tab sync message:", e)
    }
  }
}

/**
 * Check if real-time cross-tab sync is supported and active in this browser environment
 */
export function isRealTimeSyncActive(): boolean {
  return typeof window !== "undefined" && ("BroadcastChannel" in window || "localStorage" in window)
}

/**
 * Decode JWT token payload without external libraries
 * Supports CPaaS tokens e.g. from app.pave360.com/sms/dashboard?token=...
 */
export function decodeJwtToken(token: string): { id?: number | string; email?: string; [key: string]: any } | null {
  if (!token || typeof token !== "string") return null
  try {
    const parts = token.trim().split(".")
    if (parts.length < 2) return null
    let base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/")
    while (base64.length % 4) {
      base64 += "="
    }
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    )
    return JSON.parse(jsonPayload)
  } catch (err) {
    console.warn("Failed to parse JWT token payload:", err)
    return null
  }
}
