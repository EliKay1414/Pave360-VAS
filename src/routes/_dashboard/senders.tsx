import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_dashboard/senders")({
  beforeLoad: () => {
    throw redirect({ to: "/traffic/sender-ids" })
  },
})
