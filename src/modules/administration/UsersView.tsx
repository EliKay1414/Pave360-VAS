import { useState, useMemo, useEffect } from "react"
import type { UserItem, UserFormData, UserStatus } from "./users/types"
import {
  UsersHeader,
  UsersTable,
  CreateUserModal,
  UserDetailsView,
  INITIAL_USERS,
} from "./users"
import { recordVasActivity } from "../../shared/lib/vasActivityStore"
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useToggleUserStatus,
} from "../../shared/hooks/useUsers"
import { env } from "../../shared/config/env"
import { useAppSelector } from "../../shared/store"

const STORAGE_KEY = "pave360_vas_users_data"

export function UsersView() {
  const signedIn = useAppSelector((state) => state.auth.signedIn)
  const { data: apiUsers, isLoading } = useUsers()
  const createUserMutation = useCreateUser()
  const updateUserMutation = useUpdateUser()
  const toggleStatusMutation = useToggleUserStatus()

  const [localUsers, setLocalUsers] = useState<UserItem[]>(() => {
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
    return INITIAL_USERS
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UserItem | null>(null)
  const [viewingUser, setViewingUser] = useState<UserItem | null>(null)

  const saveLocalUsers = (updated: UserItem[]) => {
    setLocalUsers(updated)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch {
      /* ignore */
    }
  }

  const users = useMemo<UserItem[]>(() => {
    if (apiUsers && Array.isArray(apiUsers) && apiUsers.length > 0) {
      return apiUsers.map((u) => {
        const calculatedStatus: UserStatus =
          u.isActive === false || u.status === "Suspended" ? "Suspended" : "Active"
        return {
          id: u.id,
          name:
            u.displayName ||
            `${u.firstName || ""} ${u.lastName || ""}`.trim() ||
            u.email.split("@")[0],
          firstName: u.firstName || "",
          lastName: u.lastName || "",
          email: u.email,
          tenant: u.tenantName || "Platform",
          roles: Array.isArray(u.roles) && u.roles.length > 0 ? u.roles : ["Read Only"],
          status: calculatedStatus,
          lastLogin: u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : "Never",
          createdAt: u.createdAt
            ? new Date(u.createdAt).toISOString().replace("T", " ").slice(0, 16)
            : "",
        }
      })
    }
    if (!env.isLive || !signedIn) {
      return localUsers
    }
    return localUsers.length > 0 ? localUsers : INITIAL_USERS
  }, [apiUsers, localUsers, signedIn])

  const handleOpenCreate = () => {
    setEditingUser(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (user: UserItem) => {
    setEditingUser(user)
    setIsModalOpen(true)
  }

  const handleOpenView = (user: UserItem) => {
    setViewingUser(user)
  }

  // Direct deep link query param synchronization
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const idParam = params.get("id") || params.get("userId")
      if (idParam && !viewingUser && users.length > 0) {
        const found = users.find((u) => u.id === idParam || u.email.toLowerCase() === idParam.toLowerCase())
        if (found) {
          setViewingUser(found)
        }
      }
    }
  }, [users, viewingUser])

  const handleToggleStatus = async (userId: string) => {
    if (env.isLive && signedIn) {
      try {
        await toggleStatusMutation.mutateAsync(userId)
      } catch {
        // fallback
      }
    }

    const updatedUsers = users.map((u) => {
      if (u.id === userId) {
        const nextStatus: UserStatus = u.status === "Active" ? "Suspended" : "Active"
        const updated: UserItem = { ...u, status: nextStatus }
        if (viewingUser?.id === userId) {
          setViewingUser(updated)
        }
        recordVasActivity({
          action: "user.status_toggle",
          entity: "User",
          summary: `User ${u.email} status changed to ${nextStatus}`,
        })
        return updated
      }
      return u
    })
    saveLocalUsers(updatedUsers)
  }

  const handleSaveUser = async (formData: UserFormData) => {
    const fullName = `${formData.firstName} ${formData.lastName}`.trim()
    const tenantName = formData.tenant === "pave360" ? "Pave360" : "Platform"
    const nextStatus: UserStatus = formData.isActive === false ? "Suspended" : "Active"

    if (editingUser) {
      if (env.isLive && signedIn) {
        try {
          await updateUserMutation.mutateAsync({
            id: editingUser.id,
            payload: {
              email: formData.email,
              firstName: formData.firstName,
              lastName: formData.lastName,
              roles: formData.roles,
              isActive: formData.isActive,
            },
          })
        } catch {
          // fallback
        }
      }

      const updatedUsers = users.map((u) => {
        if (u.id === editingUser.id) {
          const updated: UserItem = {
            ...u,
            firstName: formData.firstName,
            lastName: formData.lastName,
            name: fullName || u.name,
            email: formData.email,
            tenant: tenantName,
            roles: formData.roles.length > 0 ? formData.roles : ["Read Only"],
            status: nextStatus,
          }
          if (viewingUser?.id === editingUser.id) {
            setViewingUser(updated)
          }
          return updated
        }
        return u
      })
      saveLocalUsers(updatedUsers)
      recordVasActivity({
        action: "user.update",
        entity: "User",
        summary: `User ${formData.email} details updated`,
      })
    } else {
      if (env.isLive && signedIn) {
        try {
          await createUserMutation.mutateAsync({
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            password: formData.password || "TemporaryPass123!",
            roles: formData.roles,
            isActive: formData.isActive,
          })
        } catch {
          // fallback
        }
      }

      const newUser: UserItem = {
        id: `USR-${Date.now().toString().slice(-3)}`,
        firstName: formData.firstName,
        lastName: formData.lastName,
        name: fullName || "New User",
        email: formData.email,
        tenant: tenantName,
        roles: formData.roles.length > 0 ? formData.roles : ["Read Only"],
        status: nextStatus,
        lastLogin: "Never",
        createdAt: new Date().toISOString().replace("T", " ").slice(0, 16),
      }
      const updatedUsers = [newUser, ...users]
      saveLocalUsers(updatedUsers)
      recordVasActivity({
        action: "user.create",
        entity: "User",
        summary: `New user ${formData.email} registered (${formData.roles.join(", ") || "User"})`,
      })
    }
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-6">
      {viewingUser ? (
        /* Full User Details View */
        <UserDetailsView
          user={viewingUser}
          onBack={() => setViewingUser(null)}
          onEdit={handleOpenEdit}
          onToggleStatus={handleToggleStatus}
        />
      ) : (
        /* Standard Users Table View */
        <>
          <UsersHeader onCreateClick={handleOpenCreate} />
          {Boolean(isLoading && env.isLive && (!apiUsers || (apiUsers as any[])?.length === 0)) ? (
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-12 text-center">
              <div className="inline-block animate-spin w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full mb-3" />
              <p className="text-xs text-slate-500 font-medium">Loading user accounts from server...</p>
            </div>
          ) : (
            <UsersTable
              users={users}
              onView={handleOpenView}
              onEdit={handleOpenEdit}
            />
          )}
        </>
      )}

      {/* Create / Edit User Modal */}
      <CreateUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveUser}
        editingUser={editingUser}
      />
    </div>
  )
}

export const VasUsersView = UsersView
export default UsersView
