import { createFileRoute } from "@tanstack/react-router"
import { MonitoringView } from "../../modules/operations/MonitoringView"

export const Route = createFileRoute("/_dashboard/operations/monitoring")({
  validateSearch: (search: Record<string, unknown>) => search,
  component: MonitoringView,
})
