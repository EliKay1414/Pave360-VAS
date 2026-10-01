import { createFileRoute } from "@tanstack/react-router"
import { ConnectionsView } from "../../modules/network/ConnectionsView"

export const Route = createFileRoute("/_dashboard/network/connections")({
  validateSearch: (search: Record<string, unknown>): { id?: string } => ({
    id: (search.id as string) || undefined,
  }),
  component: ConnectionsView,
})
