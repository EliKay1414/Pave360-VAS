import { X } from "lucide-react"
import type { UserItem } from "../types"

interface UserDetailsModalProps {
  user: UserItem | null
  isOpen: boolean
  onClose: () => void
  onEdit: (user: UserItem) => void
}

export function UserDetailsModal({
  user,
  isOpen,
  onClose,
  onEdit,
}: UserDetailsModalProps) {
  if (!isOpen || !user) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-base font-bold text-slate-900">User Profile</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Account information and security permissions
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-12 h-12 rounded-full bg-[#005743] text-white font-bold text-base flex items-center justify-center shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-800">{user.name}</h4>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>
            <div className="ml-auto">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {user.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px]">
                Tenant
              </span>
              <span className="text-slate-800 font-medium text-sm mt-0.5 block">
                {user.tenant}
              </span>
            </div>

            <div>
              <span className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px]">
                Last Login
              </span>
              <span className="text-slate-800 font-mono text-xs mt-0.5 block">
                {user.lastLogin}
              </span>
            </div>

            <div className="col-span-2">
              <span className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px] mb-1.5">
                Assigned Roles
              </span>
              <div className="flex flex-wrap gap-1.5">
                {user.roles.map((role) => (
                  <span
                    key={role}
                    className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              onClose()
              onEdit(user)
            }}
            className="px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            Edit user
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
