export interface PermissionItem {
  key: string
  label: string
}

export interface PermissionCategory {
  name: string
  permissions: PermissionItem[]
}

export interface RoleItem {
  id: string
  name: string
  isSystem: boolean
  description: string
  permissions: string[]
  usersCount: number
}
