import { createFileRoute } from "@tanstack/react-router"
import { ReportsBillingView } from "../../modules/traffic/ReportsBillingView"

export const Route = createFileRoute("/_dashboard/traffic/reports-billing")({
  validateSearch: (search: Record<string, unknown>) => search,
  component: ReportsBillingView,
})
