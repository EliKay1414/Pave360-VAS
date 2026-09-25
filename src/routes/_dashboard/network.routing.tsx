import { createFileRoute } from "@tanstack/react-router"
import { RoutingView } from "../../modules/network/RoutingView"

export const Route = createFileRoute("/_dashboard/network/routing")({
  component: RoutingView,
})
