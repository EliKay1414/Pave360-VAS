import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { APIKey, CoreApiCredentials } from "../types"

export interface ApiKeyState {
  coreApi: CoreApiCredentials
  apiKeys: APIKey[]
}

export const emptyCoreApi = (): CoreApiCredentials => ({
  environment: "LIVE",
  accountId: "",
  apiKey: "",
  apiSecret: "",
  defaultSenderId: "",
  baseUrl: "",
  callbackUrl: "",
  paymentWebhookUrl: "",
  deliveryWebhookUrl: "",
  webhookSecret: "",
})

const initialState: ApiKeyState = {
  coreApi: emptyCoreApi(),
  apiKeys: [],
}

export const apiKeySlice = createSlice({
  name: "apiKey",
  initialState,
  reducers: {
    resetApiKeys: (state) => {
      state.coreApi = emptyCoreApi()
      state.apiKeys = []
    },
    saveCoreApiCredentials: (state, action: PayloadAction<Partial<CoreApiCredentials>>) => {
      state.coreApi = {
        ...state.coreApi,
        ...action.payload,
        savedAt: new Date().toISOString().slice(0, 16).replace("T", " "),
      }
    },
    createApiKey: (state, action: PayloadAction<{ name: string; type: "LIVE" | "TEST"; customerId?: string }>) => {
      const prefix = action.payload.type === "LIVE" ? "lk_" : "tk_"
      const random = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
      state.apiKeys.unshift({
        id: `KEY-${Date.now().toString().slice(-4)}`,
        name: action.payload.name,
        key: `${prefix}${random}`,
        type: action.payload.type,
        createdAt: new Date().toISOString().slice(0, 10),
        customerId: action.payload.customerId,
      })
    },
    revokeApiKey: (state, action: PayloadAction<string>) => {
      state.apiKeys = state.apiKeys.filter((k) => k.id !== action.payload)
    },
  },
})

export const {
  resetApiKeys,
  saveCoreApiCredentials,
  createApiKey,
  revokeApiKey,
} = apiKeySlice.actions

export default apiKeySlice.reducer
