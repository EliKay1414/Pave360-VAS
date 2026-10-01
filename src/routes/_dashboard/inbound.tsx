import { createFileRoute } from "@tanstack/react-router"
import { InboundMoView } from "../../modules/traffic/InboundMoView"

export const Route = createFileRoute("/_dashboard/inbound")({
  validateSearch: (search: Record<string, unknown>) => search,
  component: InboundMoView,
})
