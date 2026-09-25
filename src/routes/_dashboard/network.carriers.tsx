import { createFileRoute } from "@tanstack/react-router"
import { CarriersView } from "../../modules/network/CarriersView"

export const Route = createFileRoute("/_dashboard/network/carriers")({
  component: CarriersView,
})
