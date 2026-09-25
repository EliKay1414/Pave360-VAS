import * as React from "react"
import { Plus, X } from "lucide-react"

export interface SenderIdRecord {
  id: string
  senderHeader: string
  displayName: string
  type: "Alphanumeric" | "Shortcode" | "Longcode" | string
  status: "Approved" | "Pending" | "Rejected" | string
  country: string
  notes?: string
}

const STORAGE_KEY = "pave360_vas_sender_ids"

const INITIAL_SENDERS: SenderIdRecord[] = [
  {
    id: "pave360",
    senderHeader: "Pave360",
    displayName: "Pave360 Main",
    type: "Alphanumeric",
    status: "Approved",
    country: "GH",
    notes: "test sender id",
  },
]

export function SenderIdsView() {
  const [senders, setSenders] = React.useState<SenderIdRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch {
      // Fallback
    }
    return INITIAL_SENDERS
  })

  // Modal States
  const [isRegisterOpen, setIsRegisterOpen] = React.useState(false)
  const [editingSender, setEditingSender] = React.useState<SenderIdRecord | null>(null)

  // Form State for Register Modal (matching media_1790348900238.png)
  const [registerForm, setRegisterForm] = React.useState({
    senderHeader: "",
    displayName: "",
    type: "Alphanumeric",
    country: "GH",
    status: "Pending",
    notes: "",
  })

  // Form State for Edit Modal (matching media_1790348906539.png)
  const [editForm, setEditForm] = React.useState({
    senderHeader: "",
    displayName: "",
    type: "Alphanumeric",
    country: "GH",
    status: "Approved",
    notes: "",
  })

  // Save Senders helper
  const saveSenders = (updated: SenderIdRecord[]) => {
    setSenders(updated)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch {
      // Ignore
    }
  }

  // Open Edit Modal
  const handleOpenEdit = (sender: SenderIdRecord) => {
    setEditingSender(sender)
    setEditForm({
      senderHeader: sender.senderHeader,
      displayName: sender.displayName,
      type: sender.type,
      country: sender.country,
      status: sender.status,
      notes: sender.notes || "",
    })
  }

  // Handle Register Submit
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!registerForm.senderHeader.trim()) return

    const newId = registerForm.senderHeader.trim().toLowerCase().replace(/[^a-z0-9]/g, "_") || `sender_${Date.now()}`
    const newSender: SenderIdRecord = {
      id: newId,
      senderHeader: registerForm.senderHeader.trim(),
      displayName: registerForm.displayName.trim() || registerForm.senderHeader.trim(),
      type: registerForm.type,
      country: registerForm.country.trim() || "GH",
      status: registerForm.status,
      notes: registerForm.notes.trim(),
    }

    saveSenders([...senders, newSender])
    setIsRegisterOpen(false)
    setRegisterForm({
      senderHeader: "",
      displayName: "",
      type: "Alphanumeric",
      country: "GH",
      status: "Pending",
      notes: "",
    })
  }

  // Handle Save Changes in Edit Modal
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingSender || !editForm.senderHeader.trim()) return

    const updated = senders.map((s) => {
      if (s.id === editingSender.id) {
        return {
          ...s,
          senderHeader: editForm.senderHeader.trim(),
          displayName: editForm.displayName.trim() || editForm.senderHeader.trim(),
          type: editForm.type,
          country: editForm.country.trim() || "GH",
          status: editForm.status,
          notes: editForm.notes.trim(),
        }
      }
      return s
    })

    saveSenders(updated)
    setEditingSender(null)
  }

  // Handle Delete
  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this Sender ID?")) {
      const updated = senders.filter((s) => s.id !== id)
      saveSenders(updated)
      if (editingSender && editingSender.id === id) {
        setEditingSender(null)
      }
    }
  }

  // Render Status Badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#eefaf3] text-[#059669] border border-[#a7f3d0]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
            Approved
          </span>
        )
      case "Pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Pending
          </span>
        )
      case "Rejected":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
            Rejected
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
            {status}
          </span>
        )
    }
  }

  return (
    <div className="space-y-4 font-sans select-none pb-8">
      {/* 1. Subheader: Page Description & Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <p className="text-[13.5px] text-[#5b6e82] font-normal leading-normal">
          Whitelisted sender headers for outbound SMS dispatch & compliance.
        </p>

        {/* Register Sender Button matching screenshot */}
        <button
          type="button"
          onClick={() => setIsRegisterOpen(true)}
          className="px-4 py-2 bg-[#005944] hover:bg-[#004837] text-white text-[13px] font-semibold rounded-lg shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Register Sender</span>
        </button>
      </div>

      {/* 2. Sender IDs Data Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden mt-3">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-white">
                <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                  SENDER HEADER
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                  DISPLAY NAME
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                  TYPE
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                  STATUS
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase">
                  COUNTRY
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#7c8ea2] tracking-wider uppercase text-right">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {senders.length > 0 ? (
                senders.map((sender) => (
                  <tr key={sender.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* SENDER HEADER */}
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-slate-900 text-sm">
                      {sender.senderHeader}
                    </td>

                    {/* DISPLAY NAME */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                      {sender.displayName}
                    </td>

                    {/* TYPE */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {sender.type}
                    </td>

                    {/* STATUS BADGE */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderStatusBadge(sender.status)}
                    </td>

                    {/* COUNTRY */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                      {sender.country}
                    </td>

                    {/* ACTIONS: Edit & Delete */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-xs">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(sender)}
                          className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(sender.id)}
                          className="px-3 py-1.5 bg-white hover:bg-red-50 border border-red-200 text-red-600 font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-16 text-center text-sm text-[#5b6e82] font-normal"
                  >
                    No Sender IDs registered. Click "+ Register Sender" to add one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Register Sender ID Modal matching screenshot media_1790348900238.png */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-[1px] animate-in fade-in-0 duration-150 font-sans">
          <div className="relative w-full max-w-140 bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-6 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-1">
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Register Sender ID
              </h3>
              <button
                type="button"
                onClick={() => setIsRegisterOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              {/* Sender ID (Alphanumeric Header) */}
              <div>
                <label
                  htmlFor="reg-sender-header"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Sender ID (Alphanumeric Header)
                </label>
                <input
                  id="reg-sender-header"
                  type="text"
                  required
                  placeholder="e.g. Pave360"
                  value={registerForm.senderHeader}
                  onChange={(e) =>
                    setRegisterForm({ ...registerForm, senderHeader: e.target.value })
                  }
                  className="w-full h-10 px-3.5 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-[#005944] text-slate-900 placeholder:text-slate-400 font-mono"
                />
              </div>

              {/* Display Name */}
              <div>
                <label
                  htmlFor="reg-display-name"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Display Name
                </label>
                <input
                  id="reg-display-name"
                  type="text"
                  placeholder="e.g. Pave360 Platform"
                  value={registerForm.displayName}
                  onChange={(e) =>
                    setRegisterForm({ ...registerForm, displayName: e.target.value })
                  }
                  className="w-full h-10 px-3.5 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-[#005944] text-slate-900 placeholder:text-slate-400"
                />
              </div>

              {/* Header Type & Country Code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="reg-header-type"
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                  >
                    Header Type
                  </label>
                  <select
                    id="reg-header-type"
                    value={registerForm.type}
                    onChange={(e) =>
                      setRegisterForm({ ...registerForm, type: e.target.value })
                    }
                    className="w-full h-10 px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-[#005944] text-slate-900 cursor-pointer"
                  >
                    <option value="Alphanumeric">Alphanumeric</option>
                    <option value="Shortcode">Shortcode</option>
                    <option value="Longcode">Longcode</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="reg-country-code"
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                  >
                    Country Code
                  </label>
                  <input
                    id="reg-country-code"
                    type="text"
                    value={registerForm.country}
                    onChange={(e) =>
                      setRegisterForm({ ...registerForm, country: e.target.value })
                    }
                    className="w-full h-10 px-3.5 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-[#005944] text-slate-900"
                    placeholder="GH"
                  />
                </div>
              </div>

              {/* Approval Status */}
              <div>
                <label
                  htmlFor="reg-approval-status"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Approval Status
                </label>
                <select
                  id="reg-approval-status"
                  value={registerForm.status}
                  onChange={(e) =>
                    setRegisterForm({ ...registerForm, status: e.target.value })
                  }
                  className="w-full h-10 px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-[#005944] text-slate-900 cursor-pointer"
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              {/* Operator Notes */}
              <div>
                <label
                  htmlFor="reg-operator-notes"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Operator Notes
                </label>
                <textarea
                  id="reg-operator-notes"
                  rows={3}
                  value={registerForm.notes}
                  onChange={(e) =>
                    setRegisterForm({ ...registerForm, notes: e.target.value })
                  }
                  placeholder="Optional justification or regulatory approval note"
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-[#005944] text-slate-900 placeholder:text-slate-400 resize-y"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsRegisterOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#005944] hover:bg-[#004837] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Edit Sender ID Modal matching screenshot media_1790348906539.png */}
      {editingSender && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-[1px] animate-in fade-in-0 duration-150 font-sans">
          <div className="relative w-full max-w-140 bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-6 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-1">
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Edit Sender ID
              </h3>
              {/* Close Button with border box as in screenshot */}
              <button
                type="button"
                onClick={() => setEditingSender(null)}
                className="p-1 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleEditSubmit} className="space-y-3.5">
              {/* Sender ID */}
              <div>
                <label
                  htmlFor="edit-sender-header"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Sender ID
                </label>
                <input
                  id="edit-sender-header"
                  type="text"
                  required
                  value={editForm.senderHeader}
                  onChange={(e) =>
                    setEditForm({ ...editForm, senderHeader: e.target.value })
                  }
                  className="w-full h-10 px-3.5 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-[#005944] text-slate-900 font-mono"
                />
              </div>

              {/* Display Name */}
              <div>
                <label
                  htmlFor="edit-display-name"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Display Name
                </label>
                <input
                  id="edit-display-name"
                  type="text"
                  value={editForm.displayName}
                  onChange={(e) =>
                    setEditForm({ ...editForm, displayName: e.target.value })
                  }
                  className="w-full h-10 px-3.5 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-[#005944] text-slate-900"
                />
              </div>

              {/* Type & Country */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="edit-header-type"
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                  >
                    Type
                  </label>
                  <select
                    id="edit-header-type"
                    value={editForm.type}
                    onChange={(e) =>
                      setEditForm({ ...editForm, type: e.target.value })
                    }
                    className="w-full h-10 px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-[#005944] text-slate-900 cursor-pointer"
                  >
                    <option value="Alphanumeric">Alphanumeric</option>
                    <option value="Shortcode">Shortcode</option>
                    <option value="Longcode">Longcode</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="edit-country-code"
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                  >
                    Country
                  </label>
                  <input
                    id="edit-country-code"
                    type="text"
                    value={editForm.country}
                    onChange={(e) =>
                      setEditForm({ ...editForm, country: e.target.value })
                    }
                    className="w-full h-10 px-3.5 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-[#005944] text-slate-900"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label
                  htmlFor="edit-approval-status"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Status
                </label>
                <select
                  id="edit-approval-status"
                  value={editForm.status}
                  onChange={(e) =>
                    setEditForm({ ...editForm, status: e.target.value })
                  }
                  className="w-full h-10 px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-[#005944] text-slate-900 cursor-pointer"
                >
                  <option value="Approved">Approved</option>
                  <option value="Pending">Pending</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label
                  htmlFor="edit-notes"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Notes
                </label>
                <textarea
                  id="edit-notes"
                  rows={3}
                  value={editForm.notes}
                  onChange={(e) =>
                    setEditForm({ ...editForm, notes: e.target.value })
                  }
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-[#005944] text-slate-900 resize-y"
                />
              </div>

              {/* Modal Actions: Delete Sender on left, Cancel & Save Changes on right */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleDelete(editingSender.id)}
                  className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Delete Sender
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingSender(null)}
                    className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#005944] hover:bg-[#004837] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export const VasSenderIdsView = SenderIdsView
export default SenderIdsView
