import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_dashboard/inbound")({
  beforeLoad: () => {
    throw redirect({ to: "/traffic/inbound-mo" })
  },
})
