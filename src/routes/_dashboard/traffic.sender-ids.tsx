import { createFileRoute } from "@tanstack/react-router"
import { SenderIdsView } from "../../modules/traffic/SenderIdsView"

export const Route = createFileRoute("/_dashboard/traffic/sender-ids")({
  validateSearch: (search: Record<string, unknown>) => ({
    id: (search.id as string) || (search.senderId as string) || undefined,
    senderId: (search.senderId as string) || undefined,
  }),
  component: SenderIdsView,
})
