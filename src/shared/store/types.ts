export interface User {
  id: string
  name: string
  email: string
  phone: string
  company: string
  avatar?: string
  status: "ACTIVE" | "PENDING"
  role: "ADMIN" | "OPERATOR" | "SUPER_ADMIN"
  profileCompleted: number
  country?: string
  industry?: string
  address?: string
  clientType?: string
}

export interface BrandConfig {
  brandName: string
  brandTagline: string
  brandColor: string
  brandLogoUrl: string
  brandDomain: string
  domainStatus: "PENDING" | "ACTIVE" | "FAILED"
}

export interface SenderIdItem {
  id: string
  name: string
  status: "APPROVED" | "PENDING" | "REJECTED"
  createdAt: string
  customerId?: string
  customerName?: string
  purpose?: string
  registrationNumber?: string
  rejectionReason?: string
  networks?: string[]
}

