import { createFileRoute } from "@tanstack/react-router"
import { MonitoringView } from "../../modules/operations/MonitoringView"

export const Route = createFileRoute("/_dashboard/operations/monitoring")({
  component: MonitoringView,
})
