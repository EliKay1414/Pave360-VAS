import type { UserItem, UserFormData } from "./types"

export const LEFT_COLUMN_ROLES = [
  "Developer",
  "Gateway Admin",
  "Read Only",
  "Support",
  "Tenant User",
]

export const RIGHT_COLUMN_ROLES = [
  "Finance",
  "Operations",
  "Super Admin",
  "Tenant Admin",
]

export const AVAILABLE_TENANTS = [
  { id: "none", name: "— Platform / none —" },
  { id: "pave360", name: "Pave360" },
]

export const INITIAL_USERS: UserItem[] = [
  {
    id: "USR-001",
    firstName: "Platform",
    lastName: "Admin",
    name: "Platform Admin",
    email: "admin@pave360.com",
    tenant: "Pave360",
    roles: ["Super Admin"],
    status: "Active",
    lastLogin: "2026-09-25 17:21",
    createdAt: "2026-09-21 20:42",
  },
]

export const DEFAULT_USER_FORM_DATA: UserFormData = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  tenant: "none",
  roles: [],
  isActive: true,
}
