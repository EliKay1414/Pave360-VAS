export interface SettingItem {
  key: string
  value: string
  description: string
  updated: string
  isMasked?: boolean
}

export interface SettingFormData {
  key: string
  value: string
  description: string
  isMasked: boolean
}
