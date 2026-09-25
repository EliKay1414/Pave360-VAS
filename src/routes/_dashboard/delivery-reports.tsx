import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_dashboard/delivery-reports")({
  beforeLoad: () => {
    throw redirect({ to: "/traffic/delivery-reports" })
  },
})
