import { createFileRoute } from "@tanstack/react-router"
import { VasDashboardView } from "../../modules/dashboard/VasDashboardView"

export const Route = createFileRoute("/_dashboard/dashboard")({
  component: VasDashboardView,
})
