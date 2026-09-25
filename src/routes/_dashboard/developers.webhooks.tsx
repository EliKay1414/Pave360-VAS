import { createFileRoute } from "@tanstack/react-router"
import { WebhooksView } from "../../modules/developers/WebhooksView"

export const Route = createFileRoute("/_dashboard/developers/webhooks")({
  component: WebhooksView,
})
