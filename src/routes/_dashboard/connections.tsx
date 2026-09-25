import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_dashboard/connections")({
  beforeLoad: () => {
    throw redirect({ to: "/network/connections" })
  },
})
