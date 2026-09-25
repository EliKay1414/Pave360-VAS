import { useState, useEffect } from "react"
import { X } from "lucide-react"
import type { UserItem, UserFormData } from "../types"
import {
  LEFT_COLUMN_ROLES,
  RIGHT_COLUMN_ROLES,
  AVAILABLE_TENANTS,
  DEFAULT_USER_FORM_DATA,
} from "../mockData"

interface CreateUserModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: UserFormData) => void
  editingUser?: UserItem | null
}

export function CreateUserModal({
  isOpen,
  onClose,
  onSave,
  editingUser,
}: CreateUserModalProps) {
  const [formData, setFormData] = useState<UserFormData>(DEFAULT_USER_FORM_DATA)

  useEffect(() => {
    if (editingUser) {
      setFormData({
        firstName: editingUser.firstName,
        lastName: editingUser.lastName,
        email: editingUser.email,
        password: "",
        tenant: editingUser.tenant === "Pave360" ? "pave360" : "none",
        roles: editingUser.roles,
        isActive: editingUser.status === "Active",
      })
    } else {
      setFormData(DEFAULT_USER_FORM_DATA)
    }
  }, [editingUser, isOpen])

  if (!isOpen) return null

  const handleToggleRole = (role: string) => {
    setFormData((prev) => {
      const exists = prev.roles.includes(role)
      const updated = exists
        ? prev.roles.filter((r) => r !== role)
        : [...prev.roles, role]
      return { ...prev, roles: updated }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">
            {editingUser ? "Edit user" : "Create user"}
          </h3>
          {editingUser ? (
            <button
              type="button"
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center border border-slate-700 rounded-md text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* First name & Last name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                required
                placeholder="First name"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#005743] focus:ring-1 focus:ring-[#005743]"
              />
            </div>
            <div>
              <input
                type="text"
                required
                placeholder="Last name"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#005743] focus:ring-1 focus:ring-[#005743]"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#005743] focus:ring-1 focus:ring-[#005743]"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {editingUser ? "Password (leave blank to keep)" : "Password"}
            </label>
            <input
              type="password"
              required={!editingUser}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#005743] focus:ring-1 focus:ring-[#005743]"
            />
          </div>

          {/* Tenant */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Tenant
            </label>
            <select
              value={formData.tenant}
              onChange={(e) =>
                setFormData({ ...formData, tenant: e.target.value })
              }
              className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm text-slate-800 bg-white focus:outline-hidden focus:border-[#005743] focus:ring-1 focus:ring-[#005743]"
            >
              {AVAILABLE_TENANTS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Roles Checkboxes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Roles
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-6">
              {/* Left Column */}
              <div className="space-y-2.5">
                {LEFT_COLUMN_ROLES.map((role) => (
                  <label
                    key={role}
                    className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={formData.roles.includes(role)}
                      onChange={() => handleToggleRole(role)}
                      className="w-4 h-4 rounded border-slate-300 text-[#005743] focus:ring-[#005743]"
                    />
                    <span>{role}</span>
                  </label>
                ))}
              </div>

              {/* Right Column */}
              <div className="space-y-2.5">
                {RIGHT_COLUMN_ROLES.map((role) => (
                  <label
                    key={role}
                    className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={formData.roles.includes(role)}
                      onChange={() => handleToggleRole(role)}
                      className="w-4 h-4 rounded border-slate-300 text-[#005743] focus:ring-[#005743]"
                    />
                    <span>{role}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Active Checkbox (shown in edit mode) */}
          {editingUser && (
            <div className="pt-2">
              <label className="flex items-center gap-2.5 text-xs text-slate-700 font-semibold cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.isActive ?? true}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-slate-300 text-[#005743] focus:ring-[#005743]"
                />
                <span>Active</span>
              </label>
            </div>
          )}

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="h-9 px-4 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-9 px-5 rounded-lg bg-[#005743] hover:bg-[#004737] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              {editingUser ? "Save" : "Create user"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
