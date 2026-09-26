import { useState } from "react"
import type { RoleItem } from "./roles/types"
import {
  RolesHeader,
  RolesTable,
  EditRoleModal,
  INITIAL_ROLES,
} from "./roles"
import { recordVasActivity } from "../../shared/lib/vasActivityStore"

export function RolesPermissionsView() {
  const [roles, setRoles] = useState<RoleItem[]>(INITIAL_ROLES)
  const [editingRole, setEditingRole] = useState<RoleItem | null>(null)

  const handleOpenEdit = (role: RoleItem) => {
    setEditingRole(role)
  }

  const handleCloseEdit = () => {
    setEditingRole(null)
  }

  const handleSavePermissions = (
    roleId: string,
    updatedPermissions: string[]
  ) => {
    const targetRole = roles.find((r) => r.id === roleId)
    setRoles((prev) =>
      prev.map((r) =>
        r.id === roleId ? { ...r, permissions: updatedPermissions } : r
      )
    )
    recordVasActivity({
      action: "role.update",
      entity: "Role",
      summary: `Updated privileges for role '${targetRole?.name || roleId}' (${updatedPermissions.length} permissions)`,
    })
    setEditingRole(null)
  }

  return (
    <div className="space-y-6">
      {/* Subtitle Header */}
      <RolesHeader />

      {/* Roles & Permissions Table */}
      <RolesTable roles={roles} onEdit={handleOpenEdit} />

      {/* Edit Role Modal */}
      <EditRoleModal
        role={editingRole}
        isOpen={!!editingRole}
        onClose={handleCloseEdit}
        onSave={handleSavePermissions}
      />
    </div>
  )
}

export const VasRolesPermissionsView = RolesPermissionsView
export default RolesPermissionsView
