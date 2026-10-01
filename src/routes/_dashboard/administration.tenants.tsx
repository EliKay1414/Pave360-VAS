import { createFileRoute } from "@tanstack/react-router"
import { TenantsView } from "../../modules/administration/TenantsView"

export const Route = createFileRoute("/_dashboard/administration/tenants")({
  validateSearch: (search: Record<string, unknown>): { id?: string } => ({
    id: (search.id as string) || undefined,
  }),
  component: TenantsView,
})
