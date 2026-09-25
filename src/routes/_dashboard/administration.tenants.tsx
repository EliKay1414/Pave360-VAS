import { createFileRoute } from "@tanstack/react-router"
import { TenantsView } from "../../modules/administration/TenantsView"

export const Route = createFileRoute("/_dashboard/administration/tenants")({
  component: TenantsView,
})
