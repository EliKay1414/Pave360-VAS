import type {
  HealthCheckItem,
  WorkerItem,
  CarrierConnectionItem,
  MonitoringOverview,
} from "./types"

export const INITIAL_MONITORING_OVERVIEW: MonitoringOverview = {
  overallStatus: "Healthy",
  openAlerts: 0,
  last15MinTotal: 0,
  last15MinDelivered: 0,
  last15MinFailed: 0,
  smsSubmitQueue: 0,
  sideQueues: {
    dlr: 0,
    wh: 0,
    in: 0,
  },
}

export const INITIAL_HEALTH_CHECKS: HealthCheckItem[] = [
  { name: "mysql", status: "Healthy" },
  { name: "redis", status: "Healthy" },
  { name: "rabbitmq", status: "Healthy" },
]

export const INITIAL_WORKERS: WorkerItem[] = [
  { name: "AlertEvaluatorWorker", status: "Healthy", heartbeat: "17:33:14" },
  { name: "DeliveryReportWorker", status: "Healthy", heartbeat: "17:33:15" },
  { name: "InboundMessageWorker", status: "Healthy", heartbeat: "17:33:15" },
  { name: "MessageSubmissionWorker", status: "Healthy", heartbeat: "17:33:15" },
  { name: "WebhookWorker", status: "Healthy", heartbeat: "17:33:15" },
]

export const INITIAL_CARRIER_CONNECTIONS: CarrierConnectionItem[] = [
  {
    carrier: "AT Ghana SMSC",
    connection: "AT Ghana SMSC",
    status: "Disconnected",
    enabled: "Yes",
    lastStatus: "2026-09-25 11:57",
  },
]
