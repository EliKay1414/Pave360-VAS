import { env, isLiveMode, hasVasBackend } from "../config/env"

export function integrationMode() {
  return env.mode
}

export function useSandbox() {
  return env.isSandbox
}

export function useLiveCore() {
  return isLiveMode()
}

export function useVasBackend() {
  return hasVasBackend()
}
