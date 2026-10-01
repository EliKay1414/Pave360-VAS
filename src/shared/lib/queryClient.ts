import { QueryClient } from "@tanstack/react-query"

/**
 * Standard enterprise TanStack Query cache presets for React & Vite apps.
 * - staleTime determines when cached data is considered fresh (eliminates redundant server roundtrips)
 * - gcTime keeps inactive queries in memory for fast tab navigation
 * - refetchInterval manages background live updates
 */
export const QUERY_CONFIG = {
  /** Real-time telemetry, queues depth, active worker heartbeats - cached & reused */
  realtime: {
    staleTime: 1000 * 60 * 10, // 10 minutes fresh
    gcTime: 1000 * 60 * 60, // 60 minutes memory cache
    refetchInterval: false as const, // Fetch once and reuse
  },
  /** High-frequency traffic logs, DLR delivery receipts, inbound MO - cached & reused */
  traffic: {
    staleTime: 1000 * 60 * 10, // 10 minutes fresh
    gcTime: 1000 * 60 * 60, // 60 minutes memory cache
    refetchInterval: false as const, // Fetch once and reuse
  },
  /** Administrative tables: tenants, users, roles, carriers, connections, routing, settings, api-keys */
  standard: {
    staleTime: 1000 * 60 * 15, // 15 minutes fresh
    gcTime: 1000 * 60 * 60, // 60 minutes memory cache
    refetchInterval: false as const, // on-demand manual refresh
  },
  /** Reports, analytics, and financial ledger aggregates */
  reports: {
    staleTime: 1000 * 60 * 15, // 15 minutes fresh
    gcTime: 1000 * 60 * 60, // 60 minutes memory cache
    refetchInterval: false as const, // on-demand manual refresh
  },
} as const

/**
 * Halts repeating query refetch intervals across the entire app.
 * Guarantees zero repeated polling.
 */
export function stopPollingOnAuthError(_intervalMs?: number | false) {
  return false as const
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 30, // 30 minutes cache
      gcTime: 1000 * 60 * 60, // 60 minutes memory
      refetchInterval: false, // Zero repeated calls
      refetchIntervalInBackground: false,
      refetchOnWindowFocus: false, // Do not refetch on window focus
      refetchOnReconnect: false, // Do not refetch on network reconnect
      refetchOnMount: false, // Reuse cached data when components mount
      retry: false, // Do not retry on failure
    },
    mutations: {
      retry: false, // Never retry mutations
    },
  },
})
