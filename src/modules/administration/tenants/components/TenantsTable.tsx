import type { Tenant } from "../types"

interface TenantsTableProps {
  tenants: Tenant[]
  onEdit: (tenant: Tenant) => void
}

export function TenantsTable({ tenants, onEdit }: TenantsTableProps) {
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
                COMPANY
              </th>
              <th className="py-3.5 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                SLUG
              </th>
              <th className="py-3.5 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                STATUS
              </th>
              <th className="py-3.5 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                CONTACT
              </th>
              <th className="py-3.5 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                WALLET / BALANCE
              </th>
              <th className="py-3.5 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                USERS
              </th>
              <th className="py-3.5 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                CREATED
              </th>
              <th className="py-3.5 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tenants.map((t) => (
              <tr
                key={t.id}
                className="hover:bg-slate-50/60 transition-colors"
              >
                <td className="py-4 px-6 text-sm font-bold text-emerald-700">
                  {t.company}
                </td>
                <td className="py-4 px-6 text-xs font-mono text-slate-500">
                  {t.slug}
                </td>
                <td className="py-4 px-6 text-sm">
                  {getStatusBadge(t.status)}
                </td>
                <td className="py-4 px-6 text-sm text-slate-700">
                  {t.contact}
                </td>
                <td className="py-4 px-6 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-800">
                      {t.balance}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                      {t.billingType}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6 text-sm text-blue-600 font-medium">
                  {t.usersCount}
                </td>
                <td className="py-4 px-6 text-xs text-slate-600 font-mono">
                  {t.created}
                </td>
                <td className="py-4 px-6 text-right">
                  <button
                    type="button"
                    onClick={() => onEdit(t)}
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
