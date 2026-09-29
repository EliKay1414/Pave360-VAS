import * as React from "react"
import { X } from "lucide-react"
import type { RouteRule, RouteFormData } from "../types"

interface RouteFormModalProps {
  isOpen: boolean
  modalMode: "create" | "edit"
  currentRoute: RouteRule | null
  carrierOptions: string[]
  connectionOptions: string[]
  onClose: () => void
  onSubmit: (data: RouteFormData) => void
  isSubmitting?: boolean
}

export const RouteFormModal: React.FC<RouteFormModalProps> = ({
  isOpen,
  modalMode,
  currentRoute,
  carrierOptions,
  connectionOptions,
  onClose,
  onSubmit,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = React.useState<RouteFormData>({
    name: "",
    description: "",
    priority: 10,
    enabled: true,
    criteriaType: "Prefix",
    criteriaValue: "",
    primaryCarrier: carrierOptions[0] || "AT Ghana SMSC",
    primaryConnection: connectionOptions[0] || "AT Ghana SMSC",
    secondaryCarrier: "",
    secondaryConnection: "",
  })

  React.useEffect(() => {
    if (modalMode === "edit" && currentRoute) {
      setFormData({
        name: currentRoute.name,
        description: currentRoute.description,
        priority: currentRoute.priority,
        enabled: currentRoute.enabled,
        criteriaType: currentRoute.criteriaType,
        criteriaValue: currentRoute.criteriaValue,
        primaryCarrier: currentRoute.primaryCarrier,
        primaryConnection: currentRoute.primaryConnection,
        secondaryCarrier: currentRoute.secondaryCarrier || "",
        secondaryConnection: currentRoute.secondaryConnection || "",
      })
    } else {
      setFormData({
        name: "",
        description: "",
        priority: 10,
        enabled: true,
        criteriaType: "Prefix",
        criteriaValue: "",
        primaryCarrier: carrierOptions[0] || "AT Ghana SMSC",
        primaryConnection: connectionOptions[0] || "AT Ghana SMSC",
        secondaryCarrier: "",
        secondaryConnection: "",
      })
    }
  }, [modalMode, currentRoute, isOpen, carrierOptions, connectionOptions])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.primaryCarrier.trim()) return
    onSubmit(formData)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-[1px] animate-in fade-in-0 duration-150">
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden max-h-[92vh] flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            {modalMode === "create" ? "Create route rule" : "Edit route rule"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="route-name">
                Rule Name <span className="text-red-500">*</span>
              </label>
              <input
                id="route-name"
                type="text"
                required
                placeholder="e.g. Ghana Local MTN Priority"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005944]/20 focus:border-[#005944]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="route-priority">
                Priority
              </label>
              <input
                id="route-priority"
                type="number"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) || 10 })}
                className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005944]/20 focus:border-[#005944]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="route-desc">
              Description
            </label>
            <input
              id="route-desc"
              type="text"
              placeholder="e.g. Routes all 23324, 23354 prefixes to MTN primary SMPP bind"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005944]/20 focus:border-[#005944]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="route-p-carrier">
                Primary Carrier <span className="text-red-500">*</span>
              </label>
              <select
                id="route-p-carrier"
                value={formData.primaryCarrier}
                onChange={(e) => setFormData({ ...formData, primaryCarrier: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005944]/20 focus:border-[#005944]"
              >
                {carrierOptions.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="route-p-conn">
                Primary Connection
              </label>
              <select
                id="route-p-conn"
                value={formData.primaryConnection}
                onChange={(e) => setFormData({ ...formData, primaryConnection: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005944]/20 focus:border-[#005944]"
              >
                {connectionOptions.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="route-s-carrier">
                Secondary Carrier (Failover)
              </label>
              <select
                id="route-s-carrier"
                value={formData.secondaryCarrier}
                onChange={(e) => setFormData({ ...formData, secondaryCarrier: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005944]/20 focus:border-[#005944]"
              >
                <option value="">None (No failover)</option>
                {carrierOptions.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="route-s-conn">
                Secondary Connection
              </label>
              <select
                id="route-s-conn"
                value={formData.secondaryConnection}
                onChange={(e) => setFormData({ ...formData, secondaryConnection: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005944]/20 focus:border-[#005944]"
              >
                <option value="">None</option>
                {connectionOptions.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              id="route-enabled"
              type="checkbox"
              checked={formData.enabled}
              onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
              className="h-4 w-4 text-[#005944] rounded border-slate-300 focus:ring-[#005944]"
            />
            <label htmlFor="route-enabled" className="text-xs font-semibold text-slate-700 select-none cursor-pointer">
              Enable this routing rule for active outbound traffic
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 pb-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-[#005944] hover:bg-[#004837] text-white text-sm font-semibold rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : modalMode === "create" ? "Create rule" : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
