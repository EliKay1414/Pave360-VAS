import { createFileRoute, redirect } from "@tanstack/react-router"
import { store } from "../shared/store"

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    if (!store.getState().auth.signedIn) {
      throw redirect({ to: "/login" })
    }
    throw redirect({ to: "/dashboard" })
  },
})
