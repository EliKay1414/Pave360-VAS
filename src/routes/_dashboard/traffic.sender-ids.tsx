import { createFileRoute } from "@tanstack/react-router"
import { SenderIdsView } from "../../modules/traffic/SenderIdsView"

export const Route = createFileRoute("/_dashboard/traffic/sender-ids")({
  component: SenderIdsView,
})
