import { createFileRoute } from "@tanstack/react-router"
import { DeliveryReportsView } from "../../modules/traffic/DeliveryReportsView"

export const Route = createFileRoute("/_dashboard/traffic/delivery-reports")({
  component: DeliveryReportsView,
})
