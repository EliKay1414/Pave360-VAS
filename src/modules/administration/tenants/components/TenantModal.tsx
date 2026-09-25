import { useState, useEffect } from "react"
import { X } from "lucide-react"
import type { Tenant, TenantFormData } from "../types"
import { DEFAULT_FORM_DATA } from "../mockData"

interface TenantModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: TenantFormData) => void
  editingTenant?: Tenant | null
}

export function TenantModal({
  isOpen,
  onClose,
  onSave,
  editingTenant,
}: TenantModalProps) {
  const [formData, setFormData] = useState<TenantFormData>(DEFAULT_FORM_DATA)

  useEffect(() => {
    if (editingTenant) {
      setFormData({
        company: editingTenant.company,
        slug: editingTenant.slug,
        status: editingTenant.status,
        contactName: editingTenant.contactName || "",
        contactEmail: editingTenant.contact || "",
        contactPhone: editingTenant.contactPhone || "",
        country: editingTenant.country || "GH",
        timeZone: editingTenant.timeZone || "Africa/Accra",
        notes: editingTenant.notes || "",
      })
    } else {
      setFormData(DEFAULT_FORM_DATA)
    }
  }, [editingTenant, isOpen])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">
            {editingTenant ? "Edit tenant" : "Create tenant"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Company name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Company name
            </label>
            <input
              type="text"
              required
              value={formData.company}
              onChange={(e) =>
                setFormData({ ...formData, company: e.target.value })
              }
              className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#005743] focus:ring-1 focus:ring-[#005743]"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Slug
            </label>
            <input
              type="text"
              placeholder="auto-generated if empty"
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#005743] focus:ring-1 focus:ring-[#005743]"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value as any })
              }
              className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm text-slate-800 bg-white focus:outline-hidden focus:border-[#005743] focus:ring-1 focus:ring-[#005743]"
            >
              <option value="Pending">Pending</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
              <option value="Terminated">Terminated</option>
            </select>
          </div>

          {/* Contact name & Contact email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Contact name
              </label>
              <input
                type="text"
                value={formData.contactName}
                onChange={(e) =>
                  setFormData({ ...formData, contactName: e.target.value })
                }
                className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#005743] focus:ring-1 focus:ring-[#005743]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Contact email
              </label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) =>
                  setFormData({ ...formData, contactEmail: e.target.value })
                }
                className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#005743] focus:ring-1 focus:ring-[#005743]"
              />
            </div>
          </div>

          {/* Contact phone & Country */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Contact phone
              </label>
              <input
                type="text"
                value={formData.contactPhone}
                onChange={(e) =>
                  setFormData({ ...formData, contactPhone: e.target.value })
                }
                className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#005743] focus:ring-1 focus:ring-[#005743]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Country
              </label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
                className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#005743] focus:ring-1 focus:ring-[#005743]"
              />
            </div>
          </div>

          {/* Time zone */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Time zone
            </label>
            <input
              type="text"
              value={formData.timeZone}
              onChange={(e) =>
                setFormData({ ...formData, timeZone: e.target.value })
              }
              className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#005743] focus:ring-1 focus:ring-[#005743]"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Notes
            </label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className="w-full p-3 rounded-lg border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#005743] focus:ring-1 focus:ring-[#005743] resize-none"
            />
          </div>

          {/* Modal Footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="h-9 px-4 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-9 px-5 rounded-lg bg-[#005743] hover:bg-[#004737] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              {editingTenant ? "Save changes" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
