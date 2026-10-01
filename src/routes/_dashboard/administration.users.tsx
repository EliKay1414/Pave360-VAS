import { createFileRoute } from "@tanstack/react-router"
import { UsersView } from "../../modules/administration/UsersView"

export const Route = createFileRoute("/_dashboard/administration/users")({
  validateSearch: (search: Record<string, unknown>): { id?: string; userId?: string } => ({
    id: (search.id as string) || (search.userId as string) || undefined,
    userId: (search.userId as string) || undefined,
  }),
  component: UsersView,
})
