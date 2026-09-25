import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { BrandConfig } from "../types"
import { PAVE } from "../../lib/theme"

export type ThemeMode = "LIGHT" | "DARK" | "SYSTEM"

export interface BrandState {
  brand: BrandConfig
  theme: ThemeMode
  shopName: string
  shopWhatsApp: string
  shopWhatsAppGroup: string
  shopHandle: string
  shopIconUrl: string
  shopPhotoUrl: string
}

const initialState: BrandState = {
  brand: {
    brandName: "",
    brandTagline: "",
    brandColor: PAVE.teal,
    brandLogoUrl: "",
    brandDomain: "",
    domainStatus: "PENDING",
  },
  theme: "LIGHT",
  shopName: "",
  shopWhatsApp: "",
  shopWhatsAppGroup: "",
  shopHandle: "",
  shopIconUrl: "",
  shopPhotoUrl: "",
}

export const brandSlice = createSlice({
  name: "brand",
  initialState,
  reducers: {
    resetBrand: () => initialState,
    updateBrand: (state, action: PayloadAction<Partial<BrandConfig>>) => {
      state.brand = { ...state.brand, ...action.payload }
    },
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.theme = action.payload
    },
    updateShopDetails: (
      state,
      action: PayloadAction<{
        name?: string
        whatsApp?: string
        whatsAppGroup?: string
        handle?: string
        iconUrl?: string
        photoUrl?: string
      }>,
    ) => {
      if (action.payload.name !== undefined) state.shopName = action.payload.name
      if (action.payload.whatsApp !== undefined) state.shopWhatsApp = action.payload.whatsApp
      if (action.payload.whatsAppGroup !== undefined) state.shopWhatsAppGroup = action.payload.whatsAppGroup
      if (action.payload.handle !== undefined) state.shopHandle = action.payload.handle
      if (action.payload.iconUrl !== undefined) state.shopIconUrl = action.payload.iconUrl
      if (action.payload.photoUrl !== undefined) state.shopPhotoUrl = action.payload.photoUrl
    },
  },
})

export const { updateBrand, setTheme, updateShopDetails, resetBrand } = brandSlice.actions
export default brandSlice.reducer
