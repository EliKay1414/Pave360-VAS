import { useState, useEffect } from "react"
import { X } from "lucide-react"
import type { SettingItem, SettingFormData } from "../types"
import { DEFAULT_SETTING_FORM } from "../mockData"

interface SettingModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: SettingFormData) => void
  editingSetting?: SettingItem | null
}

export function SettingModal({
  isOpen,
  onClose,
  onSave,
  editingSetting,
}: SettingModalProps) {
  const [formData, setFormData] = useState<SettingFormData>(DEFAULT_SETTING_FORM)

  useEffect(() => {
    if (editingSetting) {
      setFormData({
        key: editingSetting.key,
        value: editingSetting.value,
        description: editingSetting.description,
        isMasked: !!editingSetting.isMasked,
      })
    } else {
      setFormData(DEFAULT_SETTING_FORM)
    }
  }, [editingSetting, isOpen])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">
            {editingSetting ? "Edit setting" : "Add setting"}
          </h3>
          {editingSetting ? (
            <button
              type="button"
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center border border-slate-700 rounded-md text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Key */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Key
            </label>
            <input
              type="text"
              required
              placeholder="platform.support_email"
              disabled={!!editingSetting}
              value={formData.key}
              onChange={(e) =>
                setFormData({ ...formData, key: e.target.value })
              }
              className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs font-mono text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#005743] focus:ring-1 focus:ring-[#005743] disabled:bg-slate-50 disabled:text-slate-700"
            />
          </div>

          {/* Value */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Value
            </label>
            <textarea
              rows={3}
              required
              value={formData.value}
              onChange={(e) =>
                setFormData({ ...formData, value: e.target.value })
              }
              className="w-full p-3 rounded-lg border border-slate-200 text-xs font-mono text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#005743] focus:ring-1 focus:ring-[#005743]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Description
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#005743] focus:ring-1 focus:ring-[#005743]"
            />
          </div>

          {/* Mask value in list */}
          <div className="pt-1">
            <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.isMasked}
                onChange={(e) =>
                  setFormData({ ...formData, isMasked: e.target.checked })
                }
                className="w-4 h-4 rounded border-slate-300 text-[#005743] focus:ring-[#005743]"
              />
              <span>Mask value in list</span>
            </label>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
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
              {editingSetting ? "Save" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
