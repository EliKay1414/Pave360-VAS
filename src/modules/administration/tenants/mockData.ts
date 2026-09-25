import type { Tenant, TenantFormData } from "./types"

export const INITIAL_TENANTS: Tenant[] = [
  {
    id: "TEN-001",
    company: "Pave360",
    slug: "pave360",
    status: "Active",
    contact: "admin@pave360.com",
    contactName: "Admin",
    contactPhone: "+233 24 898 5021",
    country: "GH",
    timeZone: "Africa/Accra",
    notes: "Core default operator tenant",
    balance: "999.32 GHS",
    billingType: "Prepaid",
    usersCount: 1,
    created: "2026-09-21",
  },
]

export const DEFAULT_FORM_DATA: TenantFormData = {
  company: "",
  slug: "",
  status: "Pending",
  contactName: "",
  contactEmail: "",
  contactPhone: "",
  country: "GH",
  timeZone: "Africa/Accra",
  notes: "",
}
