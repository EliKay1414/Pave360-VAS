import { createFileRoute } from "@tanstack/react-router"
import { AuditLogsView } from "../../modules/settings/AuditLogsView"

export const Route = createFileRoute("/_dashboard/audit-logs")({
  component: AuditLogsView,
})
