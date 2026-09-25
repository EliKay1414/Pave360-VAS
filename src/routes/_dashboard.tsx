import { createFileRoute, redirect } from "@tanstack/react-router"
import { store } from "../shared/store"
import { VasLayoutView } from "../modules/layout/VasLayoutView"

export const Route = createFileRoute("/_dashboard")({
  beforeLoad: () => {
    if (!store.getState().auth.signedIn) {
      throw redirect({ to: "/login" })
    }
  },
  component: VasLayoutView,
})
