import { useState, useEffect } from "react"
import type { UserItem } from "../types"

interface UserDetailsViewProps {
  user: UserItem
  onBack: () => void
  onEdit: (user: UserItem) => void
  onToggleStatus: (userId: string) => void
}

export function UserDetailsView({
  user,
  onBack,
  onEdit,
  onToggleStatus,
}: UserDetailsViewProps) {
  const [newPassword, setNewPassword] = useState("")
  const [passwordResetSuccess, setPasswordResetSuccess] = useState(false)

  // Dispatch custom event so the global Header displays the user's name
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("pave_set_page_title", { detail: user.name })
    )
    return () => {
      window.dispatchEvent(
        new CustomEvent("pave_set_page_title", { detail: null })
      )
    }
  }, [user.name])

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword.length >= 8) {
      setPasswordResetSuccess(true)
      setNewPassword("")
      setTimeout(() => setPasswordResetSuccess(false), 3000)
    }
  }

  const isActive = user.status === "Active"

  return (
    <div className="pt-2">
      <div className="bg-white rounded-xl border border-slate-200/80 p-8 shadow-xs max-w-2xl">
        {/* Top Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 leading-tight">
              {user.name}
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">{user.email}</p>
          </div>

          <div>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                isActive
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                  : "bg-rose-50 text-rose-700 border border-rose-200/60"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isActive ? "bg-emerald-500" : "bg-rose-500"
                }`}
              />
              {user.status}
            </span>
          </div>
        </div>

        {/* 2-Column Info Grid */}
        <div className="grid grid-cols-2 gap-y-6 gap-x-8 mt-6">
          <div>
            <span className="text-xs text-slate-400 font-medium block">
              Tenant
            </span>
            <span className="text-sm font-semibold text-slate-800 mt-1 block">
              {user.tenant}
            </span>
          </div>

          <div>
            <span className="text-xs text-slate-400 font-medium block">
              Roles
            </span>
            <span className="text-sm font-semibold text-slate-800 mt-1 block">
              {user.roles.join(", ")}
            </span>
          </div>

          <div>
            <span className="text-xs text-slate-400 font-medium block">
              Created
            </span>
            <span className="text-sm font-semibold text-slate-800 mt-1 block font-mono text-xs">
              {user.createdAt}
            </span>
          </div>

          <div>
            <span className="text-xs text-slate-400 font-medium block">
              Last login
            </span>
            <span className="text-sm font-semibold text-slate-800 mt-1 block font-mono text-xs">
              {user.lastLogin}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 mt-7 pt-2">
          <button
            type="button"
            onClick={() => onEdit(user)}
            className="h-9 px-4 bg-[#005743] hover:bg-[#004737] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() => onToggleStatus(user.id)}
            className={`h-9 px-4 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer ${
              isActive
                ? "bg-[#b93826] hover:bg-[#a02f1f]"
                : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {isActive ? "Deactivate" : "Activate"}
          </button>

          <button
            type="button"
            onClick={onBack}
            className="h-9 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            Back to users
          </button>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100 my-8" />

        {/* Reset Password */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-3">
            Reset password
          </h3>

          <form onSubmit={handleResetPassword}>
            <input
              type="password"
              placeholder="New password (min 8 characters)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm text-slate-800 placeholder-slate-400 mb-3 focus:outline-hidden focus:border-[#005743] focus:ring-1 focus:ring-[#005743]"
            />

            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="h-9 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
              >
                Set new password
              </button>

              {passwordResetSuccess && (
                <span className="text-xs text-emerald-600 font-semibold animate-in fade-in">
                  Password updated successfully
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
