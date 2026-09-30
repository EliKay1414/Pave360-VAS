import { QueryClient } from "@tanstack/react-query"

/**
 * Standard enterprise TanStack Query cache presets for React & Vite apps.
 * - staleTime determines when cached data is considered fresh (eliminates redundant server roundtrips)
 * - gcTime keeps inactive queries in memory for fast tab navigation
 * - refetchInterval manages background live updates
 */
export const QUERY_CONFIG = {
  /** Real-time telemetry, queues depth, active worker heartbeats */
  realtime: {
    staleTime: 10_000, // 10 seconds fresh
    gcTime: 1000 * 60 * 10, // 10 minutes memory cache
    refetchInterval: 15_000, // 15 seconds polling
  },
  /** High-frequency traffic logs, DLR delivery receipts, inbound MO */
  traffic: {
    staleTime: 15_000, // 15 seconds fresh
    gcTime: 1000 * 60 * 15, // 15 minutes memory cache
    refetchInterval: 20_000, // 20 seconds polling
  },
  /** Administrative tables: tenants, users, roles, carriers, connections, routing, settings, api-keys */
  standard: {
    staleTime: 60_000, // 1 minute fresh (instant response from memory)
    gcTime: 1000 * 60 * 30, // 30 minutes memory cache
    refetchInterval: false as const, // on-demand manual refresh
  },
  /** Reports, analytics, and financial ledger aggregates */
  reports: {
    staleTime: 1000 * 60 * 2, // 2 minutes fresh
    gcTime: 1000 * 60 * 30, // 30 minutes memory cache
    refetchInterval: 60_000, // 1 minute polling
  },
} as const

/**
 * Halts repeating query refetch intervals if the backend returns 401 (Unauthorized)
 * or 403 (Forbidden), preventing endless browser console error floods.
 */
export function stopPollingOnAuthError(intervalMs: number | false) {
  if (intervalMs === false) return false
  return (query: { state: { error: unknown } }) => {
    const err = query.state.error as { status?: number; statusCode?: number } | undefined
    if (
      err?.status === 401 ||
      err?.status === 403 ||
      err?.statusCode === 401 ||
      err?.statusCode === 403
    ) {
      return false
    }
    return intervalMs
  }
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: QUERY_CONFIG.standard.staleTime,
      gcTime: QUERY_CONFIG.standard.gcTime,
      refetchOnWindowFocus: false,
      retry: (failureCount, error: any) => {
        // Stop retrying if session is unauthorized or forbidden
        if (
          error?.status === 401 ||
          error?.status === 403 ||
          error?.statusCode === 401 ||
          error?.statusCode === 403
        ) {
          return false
        }
        return failureCount < 1
      },
    },
  },
})
