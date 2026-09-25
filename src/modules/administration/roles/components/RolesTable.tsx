import type { RoleItem } from "../types"

interface RolesTableProps {
  roles: RoleItem[]
  onEdit: (role: RoleItem) => void
}

export function RolesTable({ roles, onEdit }: RolesTableProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200/80 bg-white">
              <th className="py-3.5 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                ROLE
              </th>
              <th className="py-3.5 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                DESCRIPTION
              </th>
              <th className="py-3.5 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                PERMISSIONS
              </th>
              <th className="py-3.5 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                USERS
              </th>
              <th className="py-3.5 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {roles.map((role) => (
              <tr
                key={role.id}
                className="hover:bg-slate-50/60 transition-colors"
              >
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-800">
                      {role.name}
                    </span>
                    {role.isSystem && (
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200/60 px-1.5 py-0.5 rounded tracking-wider">
                        SYSTEM
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-4 px-6 text-sm text-slate-600">
                  {role.description}
                </td>
                <td className="py-4 px-6 text-sm text-slate-700 font-mono text-xs">
                  {role.permissions.length}
                </td>
                <td className="py-4 px-6 text-sm text-slate-700 font-mono text-xs">
                  {role.usersCount}
                </td>
                <td className="py-4 px-6 text-right">
                  <button
                    type="button"
                    onClick={() => onEdit(role)}
                    className="text-sm font-semibold text-slate-700 hover:text-slate-900 cursor-pointer transition-colors"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
