import type { UserItem } from "../types"

interface UsersTableProps {
  users: UserItem[]
  onView: (user: UserItem) => void
  onEdit: (user: UserItem) => void
}

export function UsersTable({ users, onView, onEdit }: UsersTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Active
          </span>
        )
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Pending
          </span>
        )
      case "suspended":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Suspended
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-50 text-slate-700 border border-slate-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
            {status}
          </span>
        )
    }
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200/80 bg-white">
              <th className="py-3.5 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                USER
              </th>
              <th className="py-3.5 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                TENANT
              </th>
              <th className="py-3.5 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                ROLES
              </th>
              <th className="py-3.5 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                STATUS
              </th>
              <th className="py-3.5 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                LAST LOGIN
              </th>
              <th className="py-3.5 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-slate-50/60 transition-colors"
              >
                <td className="py-4 px-6">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-800">
                      {user.name}
                    </span>
                    <span className="text-xs text-slate-500 mt-0.5">
                      {user.email}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6 text-sm text-slate-700">
                  {user.tenant}
                </td>
                <td className="py-4 px-6 text-sm text-slate-700">
                  {user.roles.join(", ")}
                </td>
                <td className="py-4 px-6 text-sm">
                  {getStatusBadge(user.status)}
                </td>
                <td className="py-4 px-6 text-xs text-slate-600 font-mono">
                  {user.lastLogin}
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => onView(user)}
                      className="text-sm font-semibold text-slate-700 hover:text-slate-900 cursor-pointer transition-colors"
                    >
                      View
                    </button>
                    <button
                      type="button"
                      onClick={() => onEdit(user)}
                      className="text-sm font-semibold text-slate-700 hover:text-slate-900 cursor-pointer transition-colors"
                    >
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
