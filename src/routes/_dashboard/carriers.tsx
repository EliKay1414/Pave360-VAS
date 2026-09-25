import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_dashboard/carriers")({
  beforeLoad: () => {
    throw redirect({ to: "/network/carriers" })
  },
})
