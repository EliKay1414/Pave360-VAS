export interface SmppSession {
  id: string
  systemId: string
  remoteEndpoint: string
  bindState: "TRANSCEIVER" | "TRANSMITTER" | "RECEIVER" | "BOUND_TRX" | "BOUND_TX" | "BOUND_RX"
  submits: number
  dlrs: number
  connectedAt: string
  lastActivity: string
}
