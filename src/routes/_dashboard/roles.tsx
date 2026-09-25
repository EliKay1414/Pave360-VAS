import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_dashboard/roles")({
  beforeLoad: () => {
    throw redirect({ to: "/administration/roles" })
  },
})
