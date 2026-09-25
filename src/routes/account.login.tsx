import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/account/login")({
  beforeLoad: () => {
    throw redirect({ to: "/login" })
  },
})
