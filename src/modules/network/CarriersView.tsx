import * as React from "react"
import { X, CheckCircle2 } from "lucide-react"

export interface Carrier {
  id: string
  name: string
  code: string
  country: string
  mcc: string
  mnc: string
  status: "Active" | "Inactive"
  protocol: string
  priority: number
  connections: string
  supportsSms: boolean
  supportsDlrs: boolean
  supportsUnicode: boolean
  supportsConcatenated: boolean
  notes: string
}

const DEFAULT_CARRIERS: Carrier[] = [
  {
    id: "1",
    name: "AT Ghana SMSC",
    code: "AT-GH",
    country: "GH",
    mcc: "620",
    mnc: "03",
    status: "Active",
    protocol: "SMPP",
    priority: 100,
    connections: "1 / 1 enabled",
    supportsSms: true,
    supportsDlrs: true,
    supportsUnicode: true,
    supportsConcatenated: true,
    notes: "AT Ghana carrier",
  },
]

const STORAGE_KEY = "pave360_vas_carriers_data"

export function CarriersView() {
  // Load carriers from localStorage or fallback to template default
  const [carriers, setCarriers] = React.useState<Carrier[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch {
      // Fallback
    }
    return DEFAULT_CARRIERS
  })

  // Modal state
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [modalMode, setModalMode] = React.useState<"create" | "edit">("create")
  const [currentCarrier, setCurrentCarrier] = React.useState<Carrier | null>(null)

  // Form fields
  const [formData, setFormData] = React.useState({
    name: "",
    code: "",
    country: "GH",
    mcc: "",
    mnc: "",
    status: "Inactive" as "Active" | "Inactive",
    protocol: "SMPP",
    priority: 100,
    supportsSms: true,
    supportsDlrs: true,
    supportsUnicode: true,
    supportsConcatenated: true,
    notes: "",
  })

  // Delete confirmation modal state
  const [deleteConfirmTarget, setDeleteConfirmTarget] = React.useState<Carrier | null>(null)

  // Persist carriers
  const saveCarriers = (updated: Carrier[]) => {
    setCarriers(updated)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch {
      // Ignore
    }
  }

  // Open "Create carrier" modal
  const handleOpenCreate = () => {
    setModalMode("create")
    setCurrentCarrier(null)
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
    setIsModalOpen(true)
  }

  // Open "Edit carrier" modal
  const handleOpenEdit = (carrier: Carrier) => {
    setModalMode("edit")
    setCurrentCarrier(carrier)
    setFormData({
      name: carrier.name,
      code: carrier.code,
      country: carrier.country,
      mcc: carrier.mcc,
      mnc: carrier.mnc,
      status: carrier.status,
      protocol: carrier.protocol,
      priority: carrier.priority,
      supportsSms: carrier.supportsSms,
      supportsDlrs: carrier.supportsDlrs,
      supportsUnicode: carrier.supportsUnicode,
      supportsConcatenated: carrier.supportsConcatenated,
      notes: carrier.notes,
    })
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setCurrentCarrier(null)
  }

  // Save form
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    if (modalMode === "create") {
      const newCarrier: Carrier = {
        id: String(Date.now()),
        name: formData.name.trim(),
        code: formData.code.trim() || formData.name.toUpperCase().slice(0, 5),
        country: formData.country.trim() || "GH",
        mcc: formData.mcc.trim(),
        mnc: formData.mnc.trim(),
        status: formData.status,
        protocol: formData.protocol,
        priority: Number(formData.priority) || 100,
        connections: "0 / 0 enabled",
        supportsSms: formData.supportsSms,
        supportsDlrs: formData.supportsDlrs,
        supportsUnicode: formData.supportsUnicode,
        supportsConcatenated: formData.supportsConcatenated,
        notes: formData.notes.trim(),
      }
      saveCarriers([...carriers, newCarrier])
    } else if (modalMode === "edit" && currentCarrier) {
      const updated = carriers.map((c) =>
        c.id === currentCarrier.id
          ? {
              ...c,
              name: formData.name.trim(),
              code: formData.code.trim(),
              country: formData.country.trim(),
              mcc: formData.mcc.trim(),
              mnc: formData.mnc.trim(),
              status: formData.status,
              protocol: formData.protocol,
              priority: Number(formData.priority) || 100,
              supportsSms: formData.supportsSms,
              supportsDlrs: formData.supportsDlrs,
              supportsUnicode: formData.supportsUnicode,
              supportsConcatenated: formData.supportsConcatenated,
              notes: formData.notes.trim(),
            }
          : c
      )
      saveCarriers(updated)
    }

    handleCloseModal()
  }

  // Delete directly
  const handleDeleteCarrier = (id: string) => {
    const updated = carriers.filter((c) => c.id !== id)
    saveCarriers(updated)
    if (isModalOpen) handleCloseModal()
    if (deleteConfirmTarget) setDeleteConfirmTarget(null)
  }

  return (
    <div className="space-y-4 font-sans select-none">
      {/* 1. Subheader: Description on Left, "Create carrier" button on Right */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
        <p className="text-sm text-[#5b6e82] font-normal">
          Telecommunications operators available for routing and connectivity.
        </p>
        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center px-4 py-2 bg-[#005944] hover:bg-[#004837] text-white text-sm font-semibold rounded-lg shadow-xs transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
        >
          Create carrier
        </button>
      </div>

      {/* 2. Carriers Data Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-white">
                <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                  CARRIER
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                  CODE
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                  COUNTRY
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                  MCC/MNC
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                  STATUS
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                  PRIORITY
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                  CONNECTIONS
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase text-right">
                  {/* Actions column */}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {carriers.length > 0 ? (
                carriers.map((carrier) => (
                  <tr
                    key={carrier.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(carrier)}
                        className="text-[#046a56] font-semibold text-sm hover:underline cursor-pointer text-left"
                      >
                        {carrier.name}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-800 font-medium text-sm">
                      {carrier.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-800 font-medium text-sm">
                      {carrier.country}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-600 font-normal text-sm">
                      {carrier.mcc ? `${carrier.mcc} / ${carrier.mnc}` : "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {carrier.status === "Active" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#eefaf3] text-[#059669] border border-[#a7f3d0]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-800 font-medium text-sm">
                      {carrier.priority}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-700 font-medium text-sm">
                      {carrier.connections}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(carrier)}
                          className="text-[#046a56] font-semibold text-sm hover:underline cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmTarget(carrier)}
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
                  <td colSpan={8} className="px-6 py-10 text-center text-slate-400 text-sm">
                    No carriers configured yet. Click "Create carrier" to add one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Create / Edit Carrier Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-[1px] animate-in fade-in-0 duration-150">
          <div
            className="relative w-full max-w-155 bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden max-h-[92vh] flex flex-col"
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-3">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                {modalMode === "create" ? "Create carrier" : "Edit carrier"}
              </h2>
              <button
                type="button"
                onClick={handleCloseModal}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Form Scrollable Body */}
            <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto px-6 py-2 space-y-4">
              {/* Row 1: Name & Code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="carrier-name">
                    Name
                  </label>
                  <input
                    id="carrier-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-[#005944] focus:ring-1 focus:ring-[#005944] text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="carrier-code">
                    Code
                  </label>
                  <input
                    id="carrier-code"
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-[#005944] focus:ring-1 focus:ring-[#005944] text-slate-900"
                  />
                </div>
              </div>

              {/* Row 2: Country, Mcc, Mnc */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="carrier-country">
                    Country
                  </label>
                  <input
                    id="carrier-country"
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-[#005944] focus:ring-1 focus:ring-[#005944] text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="carrier-mcc">
                    Mcc
                  </label>
                  <input
                    id="carrier-mcc"
                    type="text"
                    value={formData.mcc}
                    onChange={(e) => setFormData({ ...formData, mcc: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-[#005944] focus:ring-1 focus:ring-[#005944] text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="carrier-mnc">
                    Mnc
                  </label>
                  <input
                    id="carrier-mnc"
                    type="text"
                    value={formData.mnc}
                    onChange={(e) => setFormData({ ...formData, mnc: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-[#005944] focus:ring-1 focus:ring-[#005944] text-slate-900"
                  />
                </div>
              </div>

              {/* Row 3: Status, Default protocol, Priority */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="carrier-status">
                    Status
                  </label>
                  <select
                    id="carrier-status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as "Active" | "Inactive" })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-[#005944] focus:ring-1 focus:ring-[#005944] text-slate-900 bg-white"
                  >
                    <option value="Inactive">Inactive</option>
                    <option value="Active">Active</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="carrier-protocol">
                    Default protocol
                  </label>
                  <select
                    id="carrier-protocol"
                    value={formData.protocol}
                    onChange={(e) => setFormData({ ...formData, protocol: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-[#005944] focus:ring-1 focus:ring-[#005944] text-slate-900 bg-white"
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
                    onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-[#005944] focus:ring-1 focus:ring-[#005944] text-slate-900"
                  />
                </div>
              </div>

              {/* Row 4: 4 Checkboxes (2 columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 pt-2">
                <div className="space-y-3">
                  <label className="flex items-center gap-2.5 text-xs font-medium text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.supportsSms}
                      onChange={(e) => setFormData({ ...formData, supportsSms: e.target.checked })}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer"
                    />
                    <span>Supports SMS</span>
                  </label>
                  <label className="flex items-center gap-2.5 text-xs font-medium text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.supportsUnicode}
                      onChange={(e) => setFormData({ ...formData, supportsUnicode: e.target.checked })}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer"
                    />
                    <span>Supports Unicode</span>
                  </label>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-2.5 text-xs font-medium text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.supportsDlrs}
                      onChange={(e) => setFormData({ ...formData, supportsDlrs: e.target.checked })}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer"
                    />
                    <span>Supports DLRs</span>
                  </label>
                  <label className="flex items-center gap-2.5 text-xs font-medium text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.supportsConcatenated}
                      onChange={(e) => setFormData({ ...formData, supportsConcatenated: e.target.checked })}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer"
                    />
                    <span>Supports concatenated</span>
                  </label>
                </div>
              </div>

              {/* Row 5: Notes */}
              <div className="pt-1">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="carrier-notes">
                  Notes
                </label>
                <textarea
                  id="carrier-notes"
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-[#005944] focus:ring-1 focus:ring-[#005944] text-slate-900 resize-y"
                />
              </div>

              {/* Modal Footer */}
              <div className="pt-4 pb-2 flex items-center justify-between border-t border-slate-100">
                {modalMode === "edit" && currentCarrier ? (
                  <button
                    type="button"
                    onClick={() => handleDeleteCarrier(currentCarrier.id)}
                    className="px-4 py-2 border border-red-200 text-red-600 bg-white hover:bg-red-50 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
                  >
                    Delete carrier
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#005944] hover:bg-[#004837] text-white text-sm font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    {modalMode === "create" ? "Create" : "Save"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Delete Confirmation Dialog */}
      {deleteConfirmTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-[1px] animate-in fade-in-0 duration-150">
          <div className="relative w-full max-w-105 bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Delete Carrier
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Are you sure you want to delete <span className="font-semibold text-slate-900">{deleteConfirmTarget.name}</span>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmTarget(null)}
                className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteCarrier(deleteConfirmTarget.id)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
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

export default CarriersView
