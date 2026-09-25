import type { AlertRule, AlertEvent, AlertFilter } from "./types"

export const ALERT_FILTERS: { id: AlertFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "open", label: "Open" },
  { id: "acknowledged", label: "Acknowledged" },
  { id: "resolved", label: "Resolved" },
]

export const INITIAL_ALERT_RULES: AlertRule[] = []

export const SAMPLE_SYSTEM_RULES: AlertRule[] = [
  {
    id: "RULE-01",
    name: "SMPP Carrier Disconnect",
    type: "Connection",
    threshold: "Disconnected > 60s",
    severity: "Critical",
    enabled: "Yes",
  },
  {
    id: "RULE-02",
    name: "Submission Queue Congestion",
    type: "Queue",
    threshold: "Depth > 1,000 msgs",
    severity: "Warning",
    enabled: "Yes",
  },
  {
    id: "RULE-03",
    name: "High DLR Failure Rate",
    type: "Delivery",
    threshold: "Failure > 10% in 5m",
    severity: "Critical",
    enabled: "Yes",
  },
  {
    id: "RULE-04",
    name: "Worker Heartbeat Stale",
    type: "Worker",
    threshold: "Heartbeat > 30s",
    severity: "Warning",
    enabled: "Yes",
  },
]

export const INITIAL_ALERT_EVENTS: AlertEvent[] = []

export const SAMPLE_ALERT_EVENTS: AlertEvent[] = [
  {
    id: "EVT-101",
    when: "2026-09-25 11:57:02",
    severity: "Warning",
    title: "AT Ghana SMSC carrier connection dropped",
    status: "Acknowledged",
  },
  {
    id: "EVT-102",
    when: "2026-09-24 18:32:10",
    severity: "Critical",
    title: "SMS Submit queue depth crossed 1,500 threshold",
    status: "Resolved",
  },
]
