import { createFileRoute } from "@tanstack/react-router"
import { SenderIdsView } from "../../modules/traffic/SenderIdsView"

export const Route = createFileRoute("/_dashboard/senders")({
  validateSearch: (search: Record<string, unknown>) => search,
  component: SenderIdsView,
})

