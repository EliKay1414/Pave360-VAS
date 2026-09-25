export type AppModuleId = "vas"

export interface AppConfig {
  id: AppModuleId
  name: string
  port: number
  defaultPath: string
  description: string
}

export const APPS: Record<AppModuleId, AppConfig> = {
  vas: {
    id: "vas",
    name: "Pave360 VAS",
    port: 5173,
    defaultPath: "/dashboard",
    description: "Pave360 VAS Telecom Operator Portal",
  },
}

export function getCurrentApp(): AppModuleId {
  return "vas"
}

export function getVasUrl(path: string = "/dashboard"): string {
  return path.startsWith("/") ? path : `/${path}`
}

export function getVasLoginUrl(): string {
  return "/login"
}

export function getVasLogoutUrl(): string {
  return "/logout"
}
