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

export interface APIKey {
  id: string
  key: string
  name: string
  type: "LIVE" | "TEST"
  createdAt: string
  customerId?: string
  webhookUrl?: string
  webhookSecret?: string
}

export interface CoreApiCredentials {
  environment: "LIVE" | "TEST"
  accountId: string
  apiKey: string
  apiSecret: string
  defaultSenderId: string
  baseUrl: string
  callbackUrl: string
  paymentWebhookUrl: string
  deliveryWebhookUrl: string
  webhookSecret: string
  savedAt?: string
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

export interface NotificationItem {
  id: string
  title: string
  description: string
  type: "SYSTEM" | "WARNING" | "INFO" | "SUCCESS"
  createdAt: string
  read: boolean
}
