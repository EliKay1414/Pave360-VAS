/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_MODE?: "sandbox" | "live"
  readonly VITE_PAVE360_BASE_URL?: string
  readonly VITE_VAS_API_URL?: string
  readonly VITE_HUBTEL_MIN_AMOUNT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
