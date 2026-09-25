import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_dashboard/alerts")({
  beforeLoad: () => {
    throw redirect({ to: "/operations/alarms" })
  },
})
