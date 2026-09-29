export interface Connection {
  id: string
  name: string
  carrier: string
  protocol: "SMPP" | "HTTP"
  host: string
  port: number | string
  systemId: string
  password?: string
  systemType: string
  bindType: "Transceiver" | "Transmitter" | "Receiver"
  sourceIp: string
  useTls: boolean
  ton: number
  npi: number
  tpsLimit: number
  windowSize: number
  timeoutSeconds: number
  enquireLinkInterval: number
  reconnectDelay: number
  maxReconnectAttempts: number
  status: "Connected" | "Disconnected" | "Connecting"
}

export interface ConnectionFormData {
  name: string
  carrier: string
  protocol: "SMPP" | "HTTP"
  host: string
  port: number | string
  systemId: string
  password?: string
  systemType: string
  bindType: "Transceiver" | "Transmitter" | "Receiver"
  sourceIp: string
  useTls: boolean
  ton: number
  npi: number
  tpsLimit: number
  windowSize: number
  timeoutSeconds: number
  enquireLinkInterval: number
  reconnectDelay: number
  maxReconnectAttempts: number
}
