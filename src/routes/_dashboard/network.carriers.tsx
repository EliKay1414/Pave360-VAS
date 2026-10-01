import { createFileRoute } from "@tanstack/react-router"
import { CarriersView } from "../../modules/network/CarriersView"

export const Route = createFileRoute("/_dashboard/network/carriers")({
  validateSearch: (search: Record<string, unknown>) => ({
    id: (search.id as string) || undefined,
    code: (search.code as string) || undefined,
  }),
  component: CarriersView,
})
