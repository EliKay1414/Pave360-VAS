import { createFileRoute } from "@tanstack/react-router"
import { RolesPermissionsView } from "../../modules/administration/RolesPermissionsView"

export const Route = createFileRoute("/_dashboard/administration/roles")({
  component: RolesPermissionsView,
})
