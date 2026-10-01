import { createFileRoute } from "@tanstack/react-router"
import { AlarmsView } from "../../modules/operations/AlarmsView"

export const Route = createFileRoute("/_dashboard/operations/alarms")({
  validateSearch: (search: Record<string, unknown>) => search,
  component: AlarmsView,
})
