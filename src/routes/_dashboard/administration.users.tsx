import { createFileRoute } from "@tanstack/react-router"
import { UsersView } from "../../modules/administration/UsersView"

export const Route = createFileRoute("/_dashboard/administration/users")({
  component: UsersView,
})
