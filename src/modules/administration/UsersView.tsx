import { useState } from "react"
import type { UserItem, UserFormData, UserStatus } from "./users/types"
import {
  UsersHeader,
  UsersTable,
  CreateUserModal,
  UserDetailsView,
  INITIAL_USERS,
} from "./users"

export function UsersView() {
  const [users, setUsers] = useState<UserItem[]>(INITIAL_USERS)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UserItem | null>(null)
  const [viewingUser, setViewingUser] = useState<UserItem | null>(null)

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
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextStatus: UserStatus = u.status === "Active" ? "Suspended" : "Active"
          const updated: UserItem = { ...u, status: nextStatus }
          if (viewingUser?.id === userId) {
            setViewingUser(updated)
          }
          return updated
        }
        return u
      })
    )
  }

  const handleSaveUser = (formData: UserFormData) => {
    const fullName = `${formData.firstName} ${formData.lastName}`.trim()
    const tenantName = formData.tenant === "pave360" ? "Pave360" : "Platform"
    const nextStatus: UserStatus = formData.isActive === false ? "Suspended" : "Active"

    if (editingUser) {
      setUsers((prev) =>
        prev.map((u) => {
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
      )
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
      setUsers((prev) => [newUser, ...prev])
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
