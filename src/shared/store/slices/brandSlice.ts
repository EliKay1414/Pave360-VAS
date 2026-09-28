import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { BrandConfig } from "../types"
import { PAVE } from "../../lib/theme"

export type ThemeMode = "LIGHT" | "DARK" | "SYSTEM"

export interface BrandState {
  brand: BrandConfig
  theme: ThemeMode
}

const initialState: BrandState = {
  brand: {
    brandName: "Pave360 VAS",
    brandTagline: "Enterprise Telecom Switching & Operator Telemetry",
    brandColor: PAVE.teal,
    brandLogoUrl: "/images/pave.png",
    brandDomain: "dev-vas.pave360.com",
    domainStatus: "ACTIVE",
  },
  theme: "LIGHT",
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
  },
})

export const { updateBrand, setTheme, resetBrand } = brandSlice.actions
export default brandSlice.reducer

