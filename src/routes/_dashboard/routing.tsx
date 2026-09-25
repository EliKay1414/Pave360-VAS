import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_dashboard/routing")({
  beforeLoad: () => {
    throw redirect({ to: "/network/routing" })
  },
})
