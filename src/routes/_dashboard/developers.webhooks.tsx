import { createFileRoute } from "@tanstack/react-router"
import { WebhooksView } from "../../modules/developers/WebhooksView"

export const Route = createFileRoute("/_dashboard/developers/webhooks")({
  validateSearch: (search: Record<string, unknown>) => ({
    id: (search.id as string) || undefined,
  }),
  component: WebhooksView,
})
