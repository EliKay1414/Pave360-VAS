import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_dashboard/swagger")({
  beforeLoad: () => {
    throw redirect({ to: "/developers/documentation" })
  },
})
