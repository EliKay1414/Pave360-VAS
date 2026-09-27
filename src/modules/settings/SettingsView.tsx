import { useState } from "react"
import type { SettingItem, SettingFormData } from "./system/types"
import {
  SettingsHeader,
  SettingsTable,
  SettingModal,
  INITIAL_SETTINGS,
} from "./system"
import { recordVasActivity } from "../../shared/lib/vasActivityStore"

const STORAGE_KEY = "pave360_vas_settings_data"

export function SettingsView() {
  const [settings, setSettings] = useState<SettingItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch {
      /* ignore */
    }
    return INITIAL_SETTINGS
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSetting, setEditingSetting] = useState<SettingItem | null>(null)

  const saveSettings = (updated: SettingItem[]) => {
    setSettings(updated)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch {
      /* ignore */
    }
  }

  const handleOpenAdd = () => {
    setEditingSetting(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (item: SettingItem) => {
    setEditingSetting(item)
    setIsModalOpen(true)
  }

  const handleSaveSetting = (data: SettingFormData) => {
    const nowIso = new Date().toISOString().replace(/\.\d{3}/, "")
    if (editingSetting) {
      const updatedSettings = settings.map((s) =>
        s.key === editingSetting.key
          ? {
              ...s,
              value: data.value,
              description: data.description,
              updated: nowIso,
              isMasked: data.isMasked,
            }
          : s
      )
      saveSettings(updatedSettings)
      recordVasActivity({
        action: "setting.update",
        entity: "Setting",
        summary: `Platform parameter '${editingSetting.key}' updated`,
      })
    } else {
      const newSetting: SettingItem = {
        key: data.key,
        value: data.value,
        description: data.description,
        updated: nowIso,
        isMasked: data.isMasked,
      }
      const updatedSettings = [...settings, newSetting]
      saveSettings(updatedSettings)
      recordVasActivity({
        action: "setting.create",
        entity: "Setting",
        summary: `New platform parameter '${data.key}' added`,
      })
    }
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Subtitle & Add Setting Action */}
      <SettingsHeader onAddClick={handleOpenAdd} />

      {/* Settings Table */}
      <SettingsTable settings={settings} onEdit={handleOpenEdit} />

      {/* Add / Edit Setting Modal */}
      <SettingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSetting}
        editingSetting={editingSetting}
      />
    </div>
  )
}

export const VasSettingsView = SettingsView
export default SettingsView
