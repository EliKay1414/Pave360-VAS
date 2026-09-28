/**
 * Runtime configuration. Backend engineer: set these in `.env` (see `.env.example`).
 */
export type AppMode = "sandbox" | "live"

function readMode(): AppMode {
  const raw = (import.meta.env.VITE_APP_MODE as string | undefined)?.toLowerCase()
  if (raw === "sandbox") return "sandbox"
  return "live"
}

export const env = {
  /** sandbox = local Redux demo. live = call Pave360 VAS APIs. */
  mode: readMode(),
  isSandbox: readMode() === "sandbox",
  isLive: readMode() === "live",

  /** Core CPaaS — same as app.pave360.com */
  pave360BaseUrl: (import.meta.env.VITE_PAVE360_BASE_URL as string | undefined)?.replace(/\/$/, "") || "https://api.pave360.com",

  /** VAS Backend API */
  vasApiUrl: (import.meta.env.VITE_VAS_API_URL as string | undefined)?.replace(/\/$/, "") || "https://vas.pave360.com",

  /** Optional: minimum Hubtel load amount (match core when known) */
  hubtelMinAmount: Number(import.meta.env.VITE_HUBTEL_MIN_AMOUNT ?? 10),
} as const

export function isSandboxMode() {
  return env.isSandbox
}

export function isLiveMode() {
  return env.isLive && Boolean(env.vasApiUrl || env.pave360BaseUrl)
}

export function hasVasBackend() {
  return Boolean(env.vasApiUrl)
}
