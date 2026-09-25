import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_dashboard/webhooks")({
  beforeLoad: () => {
    throw redirect({ to: "/developers/webhooks" })
  },
})
