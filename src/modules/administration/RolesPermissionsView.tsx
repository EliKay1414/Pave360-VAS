import { useState, useMemo, useEffect } from "react"
import type { RoleItem } from "./roles/types"
import {
  RolesHeader,
  RolesTable,
  EditRoleModal,
  INITIAL_ROLES,
} from "./roles"
import { recordVasActivity } from "../../shared/lib/vasActivityStore"
import { useRoles, useUpdateRolePermissions } from "../../shared/hooks/useRoles"
import { env } from "../../shared/config/env"
import { useAppSelector } from "../../shared/store"

const STORAGE_KEY = "pave360_vas_roles_data"

export function RolesPermissionsView() {
  const signedIn = useAppSelector((state) => state.auth.signedIn)
  const { data: apiRoles, isLoading } = useRoles()
  const updatePermissionsMutation = useUpdateRolePermissions()

  const [localRoles, setLocalRoles] = useState<RoleItem[]>(() => {
    if (env.isLive && signedIn) {
      return []
    }
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

  const saveLocalRoles = (updated: RoleItem[]) => {
    setLocalRoles(updated)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch {
      /* ignore */
    }
  }

  const roles = useMemo<RoleItem[]>(() => {
    if (apiRoles && Array.isArray(apiRoles) && apiRoles.length > 0) {
      return apiRoles.map((r) => ({
        id: r.id,
        name: r.name,
        description: r.description || "",
        usersCount: r.userCount ?? 0,
        userCount: r.userCount ?? 0,
        permissions: r.permissions || [],
        isSystem: r.isSystemRole ?? false,
      }))
    }
    if (!env.isLive || !signedIn) {
      return localRoles
    }
    return localRoles.length > 0 ? localRoles : INITIAL_ROLES
  }, [apiRoles, localRoles, signedIn])

  const handleOpenEdit = (role: RoleItem) => {
    setEditingRole(role)
  }

  // Check URL query param for direct role linking
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const idParam = params.get("id") || params.get("roleId")
      if (idParam && !editingRole && roles.length > 0) {
        const found = roles.find((r) => r.id === idParam || r.name.toLowerCase() === idParam.toLowerCase())
        if (found) {
          setEditingRole(found)
        }
      }
    }
  }, [roles, editingRole])

  const handleCloseEdit = () => {
    setEditingRole(null)
  }

  const handleSavePermissions = async (
    roleId: string,
    updatedPermissions: string[]
  ) => {
    if (env.isLive && signedIn) {
      try {
        await updatePermissionsMutation.mutateAsync({
          roleId,
          permissions: updatedPermissions,
        })
      } catch {
        // fallback
      }
    }

    const targetRole = roles.find((r) => r.id === roleId)
    const updatedRoles = roles.map((r) =>
      r.id === roleId ? { ...r, permissions: updatedPermissions } : r
    )
    saveLocalRoles(updatedRoles)
    recordVasActivity({
      action: "role.update",
      entity: "Role",
      summary: `Updated privileges for role '${targetRole?.name || roleId}' (${updatedPermissions.length} permissions)`,
    })
    setEditingRole(null)
  }

  const isRolesLoading = Boolean(isLoading && env.isLive && (!apiRoles || (apiRoles as any[])?.length === 0))

  return (
    <div className="space-y-6">
      {/* Subtitle Header */}
      <RolesHeader />

      {/* Roles & Permissions Table */}
      {isRolesLoading ? (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-12 text-center">
          <div className="inline-block animate-spin w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full mb-3" />
          <p className="text-xs text-slate-500 font-medium">Loading platform roles & permissions...</p>
        </div>
      ) : (
        <RolesTable roles={roles} onEdit={handleOpenEdit} />
      )}

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
