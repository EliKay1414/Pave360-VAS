import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_dashboard/api-keys")({
  beforeLoad: () => {
    throw redirect({ to: "/developers/api-keys" })
  },
})
