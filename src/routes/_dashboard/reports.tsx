import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_dashboard/reports")({
  beforeLoad: () => {
    throw redirect({ to: "/traffic/reports-billing" })
  },
})
