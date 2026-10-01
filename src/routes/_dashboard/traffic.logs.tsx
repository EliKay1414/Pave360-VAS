import { createFileRoute } from "@tanstack/react-router"
import { TrafficLogsView } from "../../modules/traffic/TrafficLogsView"

export const Route = createFileRoute("/_dashboard/traffic/logs")({
  validateSearch: (search: Record<string, unknown>): { messageId?: string; id?: string } => ({
    messageId: (search.messageId as string) || (search.id as string) || undefined,
    id: (search.id as string) || undefined,
  }),
  component: TrafficLogsView,
})
