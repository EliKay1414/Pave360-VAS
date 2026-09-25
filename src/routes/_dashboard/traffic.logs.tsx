import { createFileRoute } from "@tanstack/react-router"
import { TrafficLogsView } from "../../modules/traffic/TrafficLogsView"

export const Route = createFileRoute("/_dashboard/traffic/logs")({
  component: TrafficLogsView,
})
