import type { SettingItem } from "../types"

interface SettingsTableProps {
  settings: SettingItem[]
  onEdit: (setting: SettingItem) => void
}

export function SettingsTable({ settings, onEdit }: SettingsTableProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200/80 bg-white">
              <th className="py-3.5 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                KEY
              </th>
              <th className="py-3.5 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                VALUE
              </th>
              <th className="py-3.5 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                DESCRIPTION
              </th>
              <th className="py-3.5 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                UPDATED
              </th>
              <th className="py-3.5 px-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {settings.map((item) => (
              <tr
                key={item.key}
                className="hover:bg-slate-50/60 transition-colors"
              >
                <td className="py-4 px-6 text-xs font-mono font-semibold text-slate-800">
                  {item.key}
                </td>
                <td className="py-4 px-6 text-xs font-mono text-slate-700">
                  {item.isMasked ? "••••••••" : item.value}
                </td>
                <td className="py-4 px-6 text-sm text-slate-600">
                  {item.description}
                </td>
                <td className="py-4 px-6 text-xs font-mono text-slate-500 whitespace-nowrap">
                  {item.updated}
                </td>
                <td className="py-4 px-6 text-right whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => onEdit(item)}
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
