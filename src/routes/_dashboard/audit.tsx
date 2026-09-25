import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_dashboard/audit")({
  beforeLoad: () => {
    throw redirect({ to: "/audit-logs" })
  },
})
