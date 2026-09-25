export type AlertFilter = "all" | "open" | "acknowledged" | "resolved"

export interface AlertRule {
  id: string
  name: string
  type: string
  threshold: string
  severity: "Critical" | "Warning" | "Notice" | "Info" | string
  enabled: boolean | string
}

export interface AlertEvent {
  id: string
  when: string
  severity: "Critical" | "Warning" | "Notice" | "Info" | string
  title: string
  status: "Open" | "Acknowledged" | "Resolved" | string
}
