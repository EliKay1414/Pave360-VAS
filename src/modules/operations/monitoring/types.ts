export interface HealthCheckItem {
  name: string
  status: "Healthy" | "Degraded" | "Unhealthy" | string
}

export interface WorkerItem {
  name: string
  status: "Healthy" | "Degraded" | "Stopped" | string
  heartbeat: string
}

export interface CarrierConnectionItem {
  carrier: string
  connection: string
  status: "Connected" | "Disconnected" | "Connecting" | string
  enabled: boolean | string
  lastStatus: string
}

export interface MonitoringOverview {
  overallStatus: "Healthy" | "Degraded" | "Unhealthy" | string
  openAlerts: number
  last15MinTotal: number
  last15MinDelivered: number
  last15MinFailed: number
  smsSubmitQueue: number
  sideQueues: {
    dlr: number
    wh: number
    in: number
  }
}
