export interface RouteRule {
  id: string
  name: string
  description: string
  priority: number
  enabled: boolean
  criteriaType: "Prefix" | "Regex" | "Country"
  criteriaValue: string
  primaryCarrier: string
  primaryConnection: string
  secondaryCarrier?: string
  secondaryConnection?: string
  matchCount?: number
}

export interface RouteFormData {
  name: string
  description: string
  priority: number
  enabled: boolean
  criteriaType: "Prefix" | "Regex" | "Country"
  criteriaValue: string
  primaryCarrier: string
  primaryConnection: string
  secondaryCarrier: string
  secondaryConnection: string
}
