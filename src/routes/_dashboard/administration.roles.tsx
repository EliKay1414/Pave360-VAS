import { createFileRoute } from "@tanstack/react-router"
import { RolesPermissionsView } from "../../modules/administration/RolesPermissionsView"

export const Route = createFileRoute("/_dashboard/administration/roles")({
  validateSearch: (search: Record<string, unknown>): { id?: string; roleId?: string } => ({
    id: (search.id as string) || (search.roleId as string) || undefined,
    roleId: (search.roleId as string) || undefined,
  }),
  component: RolesPermissionsView,
})
