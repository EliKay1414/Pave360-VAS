import { createFileRoute } from "@tanstack/react-router"
import { QueuesView } from "../../modules/network/QueuesView"

export const Route = createFileRoute("/_dashboard/network/queues")({
  component: QueuesView,
})
