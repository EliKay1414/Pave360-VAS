import { createFileRoute } from "@tanstack/react-router"
import { UssdSessionsView } from "../../modules/traffic/UssdSessionsView"

export const Route = createFileRoute("/_dashboard/traffic/ussd-sessions")({
  component: UssdSessionsView,
})
