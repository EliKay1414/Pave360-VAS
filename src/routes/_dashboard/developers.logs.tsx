import { createFileRoute } from "@tanstack/react-router"
import { DeveloperLogsView } from "../../modules/developers/DeveloperLogsView"

export const Route = createFileRoute("/_dashboard/developers/logs")({
  component: DeveloperLogsView,
})
