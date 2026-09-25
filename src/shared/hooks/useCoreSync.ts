import * as React from "react"
import { syncAllFromCore } from "../integrations/sync.integration"
import { env } from "../config/env"

/** Refresh stock, prices, orders, and sender names from Pave360 when in live mode. */
export function useCoreSync(enabled = true) {
  const [syncing, setSyncing] = React.useState(false)
  const [lastError, setLastError] = React.useState<string | null>(null)

  const refresh = React.useCallback(async () => {
    if (!enabled || env.isSandbox) return { ok: true as const }
    setSyncing(true)
    setLastError(null)
    try {
      const result = await syncAllFromCore()
      if (!result.ok && result.errors.length) {
        setLastError(result.errors[0])
      }
      return result
    } finally {
      setSyncing(false)
    }
  }, [enabled])

  React.useEffect(() => {
    if (enabled && env.isLive) {
      void refresh()
    }
  }, [enabled, refresh])

  return { syncing, lastError, refresh }
}
