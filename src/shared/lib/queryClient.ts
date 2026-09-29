import { QueryClient } from "@tanstack/react-query"

/**
 * Halts repeating query refetch intervals if the backend returns 401 (Unauthorized)
 * or 403 (Forbidden), preventing endless browser console error floods.
 */
export function stopPollingOnAuthError(intervalMs: number) {
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
      staleTime: 1000 * 60 * 2, // 2 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
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

