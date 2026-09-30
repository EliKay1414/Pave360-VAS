import { useState, useMemo } from "react"
import type { SettingItem, SettingFormData } from "./system/types"
import {
  SettingsHeader,
  SettingsTable,
  SettingModal,
  INITIAL_SETTINGS,
} from "./system"
import { recordVasActivity } from "../../shared/lib/vasActivityStore"
import {
  useSystemSettings,
  useCreateSystemSetting,
  useUpdateSystemSetting,
} from "../../shared/hooks/useSystemSettings"
import { env } from "../../shared/config/env"
import { useAppSelector } from "../../shared/store"

const STORAGE_KEY = "pave360_vas_settings_data"

export function SettingsView() {
  const signedIn = useAppSelector((state) => state.auth.signedIn)
  const { data: apiSettings, isLoading } = useSystemSettings()
  const createSettingMutation = useCreateSystemSetting()
  const updateSettingMutation = useUpdateSystemSetting()

  const [localSettings, setLocalSettings] = useState<SettingItem[]>(() => {
    if (env.isLive && signedIn) {
      return []
    }
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

  const saveLocalSettings = (updated: SettingItem[]) => {
    setLocalSettings(updated)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch {
      /* ignore */
    }
  }

  const settings = useMemo<SettingItem[]>(() => {
    if (apiSettings && Array.isArray(apiSettings) && apiSettings.length > 0) {
      return apiSettings.map((s) => ({
        id: s.id,
        key: s.key,
        value: s.displayValue || s.value || "••••••••",
        description: s.description || "",
        updated: s.updatedAt ? new Date(s.updatedAt).toISOString().replace(/\.\d{3}/, "") : "",
        isMasked: s.isSecret ?? false,
      }))
    }
    if (!env.isLive || !signedIn) {
      return localSettings
    }
    return localSettings.length > 0 ? localSettings : INITIAL_SETTINGS
  }, [apiSettings, localSettings, signedIn])

  const handleOpenAdd = () => {
    setEditingSetting(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (item: SettingItem) => {
    setEditingSetting(item)
    setIsModalOpen(true)
  }

  const handleSaveSetting = async (data: SettingFormData) => {
    const nowIso = new Date().toISOString().replace(/\.\d{3}/, "")
    if (editingSetting) {
      if (env.isLive && signedIn) {
        try {
          await updateSettingMutation.mutateAsync({
            id: (editingSetting as any).id || editingSetting.key,
            payload: {
              key: data.key,
              value: data.value,
              description: data.description,
              isSecret: data.isMasked,
            },
          })
        } catch {
          // fallback
        }
      }

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
      saveLocalSettings(updatedSettings)
      recordVasActivity({
        action: "setting.update",
        entity: "Setting",
        summary: `Platform parameter '${editingSetting.key}' updated`,
      })
    } else {
      if (env.isLive && signedIn) {
        try {
          await createSettingMutation.mutateAsync({
            key: data.key,
            value: data.value,
            description: data.description,
            isSecret: data.isMasked,
          })
        } catch {
          // fallback
        }
      }

      const newSetting: SettingItem = {
        key: data.key,
        value: data.value,
        description: data.description,
        updated: nowIso,
        isMasked: data.isMasked,
      }
      const updatedSettings = [...settings, newSetting]
      saveLocalSettings(updatedSettings)
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
      {Boolean(isLoading && env.isLive && (!apiSettings || (apiSettings as any[])?.length === 0)) ? (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-12 text-center">
          <div className="inline-block animate-spin w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full mb-3" />
          <p className="text-xs text-slate-500 font-medium">Loading platform configuration parameters...</p>
        </div>
      ) : (
        <SettingsTable settings={settings} onEdit={handleOpenEdit} />
      )}

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
