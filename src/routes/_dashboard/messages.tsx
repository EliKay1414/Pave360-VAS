import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_dashboard/messages")({
  beforeLoad: () => {
    throw redirect({ to: "/traffic/logs" })
  },
})
