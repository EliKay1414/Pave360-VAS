import { createFileRoute } from "@tanstack/react-router"
import { DeliveryReportsView } from "../../modules/traffic/DeliveryReportsView"

export const Route = createFileRoute("/_dashboard/traffic/delivery-reports")({
  validateSearch: (search: Record<string, unknown>) => ({
    messageId: (search.messageId as string) || (search.id as string) || undefined,
    id: (search.id as string) || undefined,
  }),
  component: DeliveryReportsView,
})
