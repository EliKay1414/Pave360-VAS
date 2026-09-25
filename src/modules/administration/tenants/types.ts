export type TenantStatus = "Active" | "Pending" | "Suspended" | "Terminated"

export interface Tenant {
  id: string
  company: string
  slug: string
  status: TenantStatus
  contact: string
  contactName?: string
  contactPhone?: string
  country?: string
  timeZone?: string
  notes?: string
  balance: string
  billingType: "Prepaid" | "Postpaid"
  usersCount: number
  created: string
}

export interface TenantFormData {
  company: string
  slug: string
  status: TenantStatus
  contactName: string
  contactEmail: string
  contactPhone: string
  country: string
  timeZone: string
  notes: string
}
