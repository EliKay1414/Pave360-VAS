import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_dashboard/smpp-server")({
  beforeLoad: () => {
    throw redirect({ to: "/network/smpp-server" })
  },
})
