import { useState } from "react"
import type { RoleItem } from "./roles/types"
import {
  RolesHeader,
  RolesTable,
  EditRoleModal,
  INITIAL_ROLES,
} from "./roles"
import { recordVasActivity } from "../../shared/lib/vasActivityStore"

const STORAGE_KEY = "pave360_vas_roles_data"

export function RolesPermissionsView() {
  const [roles, setRoles] = useState<RoleItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch {
      /* ignore */
    }
    return INITIAL_ROLES
  })
  const [editingRole, setEditingRole] = useState<RoleItem | null>(null)

  const saveRoles = (updated: RoleItem[]) => {
    setRoles(updated)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch {
      /* ignore */
    }
  }

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
    const updatedRoles = roles.map((r) =>
      r.id === roleId ? { ...r, permissions: updatedPermissions } : r
    )
    saveRoles(updatedRoles)
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
