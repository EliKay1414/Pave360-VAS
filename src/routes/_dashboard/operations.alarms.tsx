import { createFileRoute } from "@tanstack/react-router"
import { AlarmsView } from "../../modules/operations/AlarmsView"

export const Route = createFileRoute("/_dashboard/operations/alarms")({
  component: AlarmsView,
})
