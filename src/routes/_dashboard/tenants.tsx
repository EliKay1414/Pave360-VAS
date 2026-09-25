import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_dashboard/tenants")({
  beforeLoad: () => {
    throw redirect({ to: "/administration/tenants" })
  },
})
