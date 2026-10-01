import { createFileRoute } from "@tanstack/react-router"
import { InboundMoView } from "../../modules/traffic/InboundMoView"

export const Route = createFileRoute("/_dashboard/traffic/inbound-mo")({
  validateSearch: (search: Record<string, unknown>): { messageId?: string; id?: string } => ({
    messageId: (search.messageId as string) || (search.id as string) || undefined,
    id: (search.id as string) || undefined,
  }),
  component: InboundMoView,
})
