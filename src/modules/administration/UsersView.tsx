import { useState } from "react"
import type { UserItem, UserFormData, UserStatus } from "./users/types"
import {
  UsersHeader,
  UsersTable,
  CreateUserModal,
  UserDetailsView,
  INITIAL_USERS,
} from "./users"
import { recordVasActivity } from "../../shared/lib/vasActivityStore"

const STORAGE_KEY = "pave360_vas_users_data"

export function UsersView() {
  const [users, setUsers] = useState<UserItem[]>(() => {
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

  const saveUsers = (updated: UserItem[]) => {
    setUsers(updated)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch {
      /* ignore */
    }
  }

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

  const handleToggleStatus = (userId: string) => {
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
    saveUsers(updatedUsers)
  }

  const handleSaveUser = (formData: UserFormData) => {
    const fullName = `${formData.firstName} ${formData.lastName}`.trim()
    const tenantName = formData.tenant === "pave360" ? "Pave360" : "Platform"
    const nextStatus: UserStatus = formData.isActive === false ? "Suspended" : "Active"

    if (editingUser) {
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
      saveUsers(updatedUsers)
      recordVasActivity({
        action: "user.update",
        entity: "User",
        summary: `User ${formData.email} details updated`,
      })
    } else {
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
      saveUsers(updatedUsers)
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
        /* Full User Details View matching screenshot */
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
          <UsersTable
            users={users}
            onView={handleOpenView}
            onEdit={handleOpenEdit}
          />
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
