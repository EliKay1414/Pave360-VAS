import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_dashboard/queues")({
  beforeLoad: () => {
    throw redirect({ to: "/network/queues" })
  },
})
