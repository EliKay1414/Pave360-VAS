import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_dashboard/monitoring")({
  beforeLoad: () => {
    throw redirect({ to: "/operations/monitoring" })
  },
})
