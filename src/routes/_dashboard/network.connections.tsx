import { createFileRoute } from "@tanstack/react-router"
import { ConnectionsView } from "../../modules/network/ConnectionsView"

export const Route = createFileRoute("/_dashboard/network/connections")({
  component: ConnectionsView,
})
