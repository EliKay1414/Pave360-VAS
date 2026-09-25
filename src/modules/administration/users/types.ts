export type UserStatus = "Active" | "Pending" | "Suspended" | "Inactive"

export interface UserItem {
  id: string
  firstName: string
  lastName: string
  name: string
  email: string
  tenant: string
  roles: string[]
  status: UserStatus
  lastLogin: string
  createdAt: string
}

export interface UserFormData {
  firstName: string
  lastName: string
  email: string
  password?: string
  tenant: string
  roles: string[]
  isActive?: boolean
}
