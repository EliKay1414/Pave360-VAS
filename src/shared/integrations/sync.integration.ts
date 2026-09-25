import { env } from "../config/env"

export async function syncAllFromCore() {
  if (env.isSandbox) return { ok: true as const, errors: [] }
  return { ok: true as const, errors: [] }
}
