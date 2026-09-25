import * as React from "react"
import { X } from "lucide-react"

export interface RouteRule {
  id: string
  name: string
  description: string
  priority: number
  enabled: boolean
  primaryCarrier: string
  primaryConnection: string
  secondaryCarrier: string
  secondaryConnection: string
  countryCode: string
  prefix: string
  regexPattern: string
  rulesCount?: number
}

const DEFAULT_ROUTES: RouteRule[] = [
  {
    id: "1",
    name: "AT Ghana SMSC",
    description: "test route",
    priority: 100,
    enabled: true,
    primaryCarrier: "AT Ghana SMSC",
    primaryConnection: "AT Ghana SMSC",
    secondaryCarrier: "AT Ghana SMSC",
    secondaryConnection: "AT Ghana SMSC",
    countryCode: "GH",
    prefix: "024,050,026",
    regexPattern: "",
    rulesCount: 2,
  },
]

const STORAGE_KEY = "pave360_vas_routes_data"
const CARRIERS_STORAGE_KEY = "pave360_vas_carriers_data"
const CONNECTIONS_STORAGE_KEY = "pave360_vas_connections_data"

export function RoutingView() {
  // Load routes from localStorage or fallback
  const [routes, setRoutes] = React.useState<RouteRule[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch {
      // Fallback
    }
    return DEFAULT_ROUTES
  })

  // Load available carriers
  const [availableCarriers] = React.useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(CARRIERS_STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((c: any) => c.name || c.code).filter(Boolean)
        }
      }
    } catch {
      // Fallback
    }
    return ["AT Ghana SMSC", "MTN Ghana SMSC", "Telecel Ghana Core", "Hubtel Aggregator"]
  })

  // Load available connections
  const [availableConnections] = React.useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(CONNECTIONS_STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((c: any) => c.name).filter(Boolean)
        }
      }
    } catch {
      // Fallback
    }
    return ["AT Ghana SMSC", "MTN Primary SMPP", "Telecel GH Bind"]
  })

  // Modal State
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [modalMode, setModalMode] = React.useState<"create" | "edit">("create")
  const [currentRoute, setCurrentRoute] = React.useState<RouteRule | null>(null)

  // Delete Confirmation Modal
  const [deleteConfirmTarget, setDeleteConfirmTarget] = React.useState<RouteRule | null>(null)

  // Form State
  const [formData, setFormData] = React.useState({
    name: "",
    description: "",
    priority: 100,
    enabled: true,
    primaryCarrier: "",
    primaryConnection: "Any connection",
    secondaryCarrier: "None",
    secondaryConnection: "Any connection",
    countryCode: "GH",
    prefix: "",
    regexPattern: "",
  })

  // Persist routes
  const saveRoutes = (updated: RouteRule[]) => {
    setRoutes(updated)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch {
      // Ignore
    }
  }

  // Open "Create route" modal
  const handleOpenCreate = () => {
    setModalMode("create")
    setCurrentRoute(null)
    setFormData({
      name: "",
      description: "",
      priority: 100,
      enabled: true,
      primaryCarrier: "",
      primaryConnection: "Any connection",
      secondaryCarrier: "None",
      secondaryConnection: "Any connection",
      countryCode: "GH",
      prefix: "",
      regexPattern: "",
    })
    setIsModalOpen(true)
  }

  // Open "Edit route" modal
  const handleOpenEdit = (route: RouteRule) => {
    setModalMode("edit")
    setCurrentRoute(route)
    setFormData({
      name: route.name,
      description: route.description,
      priority: route.priority,
      enabled: route.enabled,
      primaryCarrier: route.primaryCarrier,
      primaryConnection: route.primaryConnection,
      secondaryCarrier: route.secondaryCarrier,
      secondaryConnection: route.secondaryConnection,
      countryCode: route.countryCode,
      prefix: route.prefix,
      regexPattern: route.regexPattern,
    })
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setCurrentRoute(null)
  }

  // Calculate rules count
  const calculateRulesCount = (prefix: string, countryCode: string, regexPattern: string) => {
    let count = 0
    if (countryCode.trim()) count++
    if (prefix.trim()) count++
    if (regexPattern.trim()) count++
    return Math.max(1, count)
  }

  // Handle Form Submit
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    const rulesCount = calculateRulesCount(formData.prefix, formData.countryCode, formData.regexPattern)

    if (modalMode === "create") {
      const newRoute: RouteRule = {
        id: String(Date.now()),
        name: formData.name.trim(),
        description: formData.description.trim(),
        priority: Number(formData.priority) || 100,
        enabled: formData.enabled,
        primaryCarrier: formData.primaryCarrier.trim() || formData.name.trim(),
        primaryConnection: formData.primaryConnection.trim() || "Any connection",
        secondaryCarrier: formData.secondaryCarrier.trim() || "None",
        secondaryConnection: formData.secondaryConnection.trim() || "Any connection",
        countryCode: formData.countryCode.trim() || "GH",
        prefix: formData.prefix.trim(),
        regexPattern: formData.regexPattern.trim(),
        rulesCount,
      }
      saveRoutes([...routes, newRoute])
    } else if (modalMode === "edit" && currentRoute) {
      const updated = routes.map((r) =>
        r.id === currentRoute.id
          ? {
              ...r,
              name: formData.name.trim(),
              description: formData.description.trim(),
              priority: Number(formData.priority) || 100,
              enabled: formData.enabled,
              primaryCarrier: formData.primaryCarrier.trim() || formData.name.trim(),
              primaryConnection: formData.primaryConnection.trim() || "Any connection",
              secondaryCarrier: formData.secondaryCarrier.trim() || "None",
              secondaryConnection: formData.secondaryConnection.trim() || "Any connection",
              countryCode: formData.countryCode.trim(),
              prefix: formData.prefix.trim(),
              regexPattern: formData.regexPattern.trim(),
              rulesCount,
            }
          : r
      )
      saveRoutes(updated)
    }

    handleCloseModal()
  }

  // Delete Route
  const handleDeleteRoute = (id: string) => {
    const updated = routes.filter((r) => r.id !== id)
    saveRoutes(updated)
    if (isModalOpen) handleCloseModal()
    if (deleteConfirmTarget) setDeleteConfirmTarget(null)
  }

  return (
    <div className="space-y-4 font-sans select-none">
      {/* 1. Subheader: Description on Left, "Create route" button on Right */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
        <p className="text-[13.5px] text-[#5b6e82] font-normal leading-normal">
          Least-cost among healthy primary/secondary connections. Disconnected binds are skipped.
        </p>
        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center px-4.5 py-2 bg-[#005944] hover:bg-[#004837] text-white text-sm font-semibold rounded-lg shadow-xs transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
        >
          Create route
        </button>
      </div>

      {/* 2. Routes Data Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden mt-4.5">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-white">
                <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                  ROUTE
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                  PRIORITY
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                  PRIMARY
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                  SECONDARY
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                  RULES
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                  STATUS
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase text-right">
                  {/* Actions Column */}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {routes.length > 0 ? (
                routes.map((route) => (
                  <tr
                    key={route.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(route)}
                        className="text-[#046a56] font-semibold text-sm hover:underline cursor-pointer text-left"
                      >
                        {route.name}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-800 font-medium text-sm">
                      {route.priority}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-800 font-medium text-sm">
                      {route.primaryCarrier}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-800 font-medium text-sm">
                      {route.secondaryCarrier}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-800 font-medium text-sm">
                      {route.rulesCount ?? 2}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {route.enabled ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#eefaf3] text-[#059669] border border-[#a7f3d0]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
                          Enabled
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                          Disabled
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(route)}
                          className="text-[#046a56] font-semibold text-sm hover:underline cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmTarget(route)}
                          className="text-[#dc2626] font-semibold text-sm hover:underline cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-slate-400 text-sm">
                    No routing rules configured yet. Click "Create route" to add one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Create / Edit Route Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-[1px] animate-in fade-in-0 duration-150">
          <div
            className="relative w-full max-w-162.5 bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden max-h-[92vh] flex flex-col font-sans"
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-7 pt-6 pb-3">
              <h2 className="text-[17px] font-bold text-slate-900 tracking-tight">
                {modalMode === "create" ? "Create route" : "Edit route"}
              </h2>
              <button
                type="button"
                onClick={handleCloseModal}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 border border-slate-300 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Form Scrollable Body */}
            <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto px-7 py-2 space-y-4">
              {/* Row 1: Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="route-name">
                  Name
                </label>
                <input
                  id="route-name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full h-10 px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-[#005944] focus:ring-1 focus:ring-[#005944] text-slate-900"
                />
              </div>

              {/* Row 2: Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="route-description">
                  Description
                </label>
                <textarea
                  id="route-description"
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-[#005944] focus:ring-1 focus:ring-[#005944] text-slate-900 resize-y"
                />
              </div>

              {/* Row 3: Priority & Enabled Checkbox */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="route-priority">
                    Priority
                  </label>
                  <input
                    id="route-priority"
                    type="number"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) })}
                    className="w-full h-10 px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-[#005944] focus:ring-1 focus:ring-[#005944] text-slate-900"
                  />
                </div>
                <div className="sm:pt-5">
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer select-none h-10">
                    <input
                      type="checkbox"
                      checked={formData.enabled}
                      onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer"
                    />
                    <span>Enabled</span>
                  </label>
                </div>
              </div>

              {/* Row 4: Primary carrier & Primary connection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="route-primary-carrier">
                    Primary carrier
                  </label>
                  <select
                    id="route-primary-carrier"
                    value={formData.primaryCarrier}
                    onChange={(e) => setFormData({ ...formData, primaryCarrier: e.target.value })}
                    className="w-full h-10 px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-[#005944] focus:ring-1 focus:ring-[#005944] text-slate-900 bg-white"
                  >
                    <option value="">Select carrier...</option>
                    {availableCarriers.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="route-primary-conn">
                    Primary connection
                  </label>
                  <select
                    id="route-primary-conn"
                    value={formData.primaryConnection}
                    onChange={(e) => setFormData({ ...formData, primaryConnection: e.target.value })}
                    className="w-full h-10 px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-[#005944] focus:ring-1 focus:ring-[#005944] text-slate-900 bg-white"
                  >
                    <option value="Any connection">Any connection</option>
                    {availableConnections.map((conn) => (
                      <option key={conn} value={conn}>
                        {conn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 5: Secondary carrier & Secondary connection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="route-secondary-carrier">
                    Secondary carrier
                  </label>
                  <select
                    id="route-secondary-carrier"
                    value={formData.secondaryCarrier}
                    onChange={(e) => setFormData({ ...formData, secondaryCarrier: e.target.value })}
                    className="w-full h-10 px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-[#005944] focus:ring-1 focus:ring-[#005944] text-slate-900 bg-white"
                  >
                    <option value="None">None</option>
                    {availableCarriers.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="route-secondary-conn">
                    Secondary connection
                  </label>
                  <select
                    id="route-secondary-conn"
                    value={formData.secondaryConnection}
                    onChange={(e) => setFormData({ ...formData, secondaryConnection: e.target.value })}
                    className="w-full h-10 px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-[#005944] focus:ring-1 focus:ring-[#005944] text-slate-900 bg-white"
                  >
                    <option value="Any connection">Any connection</option>
                    {availableConnections.map((conn) => (
                      <option key={conn} value={conn}>
                        {conn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 6: Country code, Prefix, Regex Pattern (3 cols) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="route-country">
                    Country code
                  </label>
                  <input
                    id="route-country"
                    type="text"
                    value={formData.countryCode}
                    onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                    className="w-full h-10 px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-[#005944] focus:ring-1 focus:ring-[#005944] text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="route-prefix">
                    Prefix (comma-separated)
                  </label>
                  <input
                    id="route-prefix"
                    type="text"
                    placeholder="e.g.  027, 057, 026, 056"
                    value={formData.prefix}
                    onChange={(e) => setFormData({ ...formData, prefix: e.target.value })}
                    className="w-full h-10 px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-[#005944] focus:ring-1 focus:ring-[#005944] text-slate-900 placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="route-regex">
                    Regex Pattern
                  </label>
                  <input
                    id="route-regex"
                    type="text"
                    placeholder="e.g. ^(027|057|026|056)"
                    value={formData.regexPattern}
                    onChange={(e) => setFormData({ ...formData, regexPattern: e.target.value })}
                    className="w-full h-10 px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-[#005944] focus:ring-1 focus:ring-[#005944] text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-5 pb-3 flex items-center justify-between border-t border-slate-100 mt-2">
                {modalMode === "edit" && currentRoute ? (
                  <button
                    type="button"
                    onClick={() => handleDeleteRoute(currentRoute.id)}
                    className="px-4 py-2 border border-red-200 text-red-600 bg-white hover:bg-red-50 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
                  >
                    Delete route
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4.5 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#005944] hover:bg-[#004837] text-white text-sm font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    {modalMode === "create" ? "Create route" : "Save"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Delete Confirmation Dialog */}
      {deleteConfirmTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-[1px] animate-in fade-in-0 duration-150 font-sans">
          <div className="relative w-full max-w-105 bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Delete Route
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Are you sure you want to delete route <span className="font-semibold text-slate-900">{deleteConfirmTarget.name}</span>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmTarget(null)}
                className="px-4.5 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteRoute(deleteConfirmTarget.id)}
                className="px-4.5 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RoutingView
