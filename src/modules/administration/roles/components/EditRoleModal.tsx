import { useState, useEffect } from "react"
import { X } from "lucide-react"
import type { RoleItem } from "../types"
import { PERMISSION_CATEGORIES } from "../mockData"

interface EditRoleModalProps {
  role: RoleItem | null
  isOpen: boolean
  onClose: () => void
  onSave: (roleId: string, updatedPermissions: string[]) => void
}

export function EditRoleModal({
  role,
  isOpen,
  onClose,
  onSave,
}: EditRoleModalProps) {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])

  useEffect(() => {
    if (role) {
      setSelectedPermissions([...role.permissions])
    }
  }, [role, isOpen])

  if (!isOpen || !role) return null

  const handleTogglePermission = (key: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    )
  }

  const handleSave = () => {
    onSave(role.id, selectedPermissions)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
          <h3 className="text-base font-bold text-slate-900">Edit role</h3>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center border border-slate-700 rounded-md text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Role Info */}
          <div className="pb-4 border-b border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              ROLE
            </span>
            <h4 className="text-lg font-bold text-slate-900 mt-0.5">
              {role.name}
            </h4>
            <p className="text-xs text-slate-500 mt-1">{role.description}</p>
          </div>

          {/* Grouped Permissions */}
          <div className="space-y-6">
            {PERMISSION_CATEGORIES.map((cat) => (
              <div key={cat.name} className="space-y-2.5">
                <h5 className="text-xs font-bold text-slate-900">
                  {cat.name}
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {cat.permissions.map((perm) => {
                    const isChecked = selectedPermissions.includes(perm.key)
                    return (
                      <label
                        key={perm.key}
                        onClick={(e) => {
                          e.preventDefault()
                          handleTogglePermission(perm.key)
                        }}
                        className={`border rounded-lg p-3 flex items-start gap-3 bg-white transition-colors cursor-pointer select-none ${
                          isChecked
                            ? "border-emerald-600/50 bg-emerald-50/20"
                            : "border-slate-200/90 hover:border-slate-300"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="w-4 h-4 rounded border-slate-300 text-[#005743] focus:ring-[#005743] mt-0.5 pointer-events-none"
                        />
                        <div className="min-w-0 flex-1">
                          <span className="text-xs font-bold text-slate-800 block">
                            {perm.label}
                          </span>
                          <span className="text-[11px] font-mono text-slate-500 block mt-0.5">
                            {perm.key}
                          </span>
                        </div>
                      </label>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-white flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-9 px-4 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="h-9 px-5 rounded-lg bg-[#005743] hover:bg-[#004737] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            Save permissions
          </button>
        </div>
      </div>
    </div>
  )
}
