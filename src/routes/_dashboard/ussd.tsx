import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_dashboard/ussd")({
  beforeLoad: () => {
    throw redirect({ to: "/traffic/ussd-sessions" })
  },
})
