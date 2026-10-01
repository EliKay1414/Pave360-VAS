import { createFileRoute } from "@tanstack/react-router"
import { UssdSessionsView } from "../../modules/traffic/UssdSessionsView"

export const Route = createFileRoute("/_dashboard/traffic/ussd-sessions")({
  validateSearch: (search: Record<string, unknown>) => ({
    sessionId: (search.sessionId as string) || (search.id as string) || undefined,
    id: (search.id as string) || undefined,
  }),
  component: UssdSessionsView,
})
