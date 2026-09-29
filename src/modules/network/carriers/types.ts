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
  notes?: string
}

export interface CarrierFormData {
  name: string
  code: string
  country: string
  mcc: string
  mnc: string
  status: "Active" | "Inactive"
  protocol: string
  priority: number
  supportsSms: boolean
  supportsDlrs: boolean
  supportsUnicode: boolean
  supportsConcatenated: boolean
  notes: string
}
