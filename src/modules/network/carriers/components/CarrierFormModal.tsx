import * as React from "react"
import { X } from "lucide-react"
import type { CarrierFormData, Carrier } from "../types"

interface CarrierFormModalProps {
  isOpen: boolean
  modalMode: "create" | "edit"
  currentCarrier: Carrier | null
  onClose: () => void
  onSubmit: (data: CarrierFormData) => void
  isSubmitting?: boolean
}

export const CarrierFormModal: React.FC<CarrierFormModalProps> = ({
  isOpen,
  modalMode,
  currentCarrier,
  onClose,
  onSubmit,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = React.useState<CarrierFormData>({
    name: "",
    code: "",
    country: "GH",
    mcc: "",
    mnc: "",
    status: "Inactive",
    protocol: "SMPP",
    priority: 100,
    supportsSms: true,
    supportsDlrs: true,
    supportsUnicode: true,
    supportsConcatenated: true,
    notes: "",
  })

  React.useEffect(() => {
    if (modalMode === "edit" && currentCarrier) {
      setFormData({
        name: currentCarrier.name,
        code: currentCarrier.code,
        country: currentCarrier.country,
        mcc: currentCarrier.mcc,
        mnc: currentCarrier.mnc,
        status: currentCarrier.status,
        protocol: currentCarrier.protocol || "SMPP",
        priority: currentCarrier.priority,
        supportsSms: currentCarrier.supportsSms,
        supportsDlrs: currentCarrier.supportsDlrs,
        supportsUnicode: currentCarrier.supportsUnicode,
        supportsConcatenated: currentCarrier.supportsConcatenated,
        notes: currentCarrier.notes || "",
      })
    } else {
      setFormData({
        name: "",
        code: "",
        country: "GH",
        mcc: "",
        mnc: "",
        status: "Inactive",
        protocol: "SMPP",
        priority: 100,
        supportsSms: true,
        supportsDlrs: true,
        supportsUnicode: true,
        supportsConcatenated: true,
        notes: "",
      })
    }
  }, [modalMode, currentCarrier, isOpen])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.code.trim()) return
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
            {modalMode === "create" ? "Create carrier" : "Edit carrier"}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="carrier-name">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                id="carrier-name"
                type="text"
                required
                placeholder="e.g. Telecel Ghana"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005944]/20 focus:border-[#005944]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="carrier-code">
                Code <span className="text-red-500">*</span>
              </label>
              <input
                id="carrier-code"
                type="text"
                required
                placeholder="e.g. TEL-GH"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005944]/20 focus:border-[#005944]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="carrier-country">
                Country
              </label>
              <input
                id="carrier-country"
                type="text"
                placeholder="GH"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005944]/20 focus:border-[#005944]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="carrier-mcc">
                MCC
              </label>
              <input
                id="carrier-mcc"
                type="text"
                placeholder="620"
                value={formData.mcc}
                onChange={(e) => setFormData({ ...formData, mcc: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005944]/20 focus:border-[#005944]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="carrier-mnc">
                MNC
              </label>
              <input
                id="carrier-mnc"
                type="text"
                placeholder="02"
                value={formData.mnc}
                onChange={(e) => setFormData({ ...formData, mnc: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005944]/20 focus:border-[#005944]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="carrier-status">
                Status
              </label>
              <select
                id="carrier-status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as "Active" | "Inactive" })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005944]/20 focus:border-[#005944]"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="carrier-protocol">
                Default Protocol
              </label>
              <select
                id="carrier-protocol"
                value={formData.protocol}
                onChange={(e) => setFormData({ ...formData, protocol: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005944]/20 focus:border-[#005944]"
              >
                <option value="SMPP">SMPP</option>
                <option value="HTTP">HTTP</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="carrier-priority">
                Priority
              </label>
              <input
                id="carrier-priority"
                type="number"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) || 100 })}
                className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005944]/20 focus:border-[#005944]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="carrier-notes">
              Notes
            </label>
            <textarea
              id="carrier-notes"
              rows={2}
              placeholder="Internal carrier routing notes..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005944]/20 focus:border-[#005944]"
            />
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
              {isSubmitting ? "Saving..." : modalMode === "create" ? "Create carrier" : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
