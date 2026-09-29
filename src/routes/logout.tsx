import { createFileRoute, redirect } from "@tanstack/react-router"
import { logoutOperator } from "../shared/integrations/auth.integration"

export const Route = createFileRoute("/logout")({
  beforeLoad: async ({ preload }) => {
    // Never trigger logout side-effects during route preloading
    if (preload) return
    await logoutOperator()
    throw redirect({ to: "/login" })
  },
  component: () => null,
})
