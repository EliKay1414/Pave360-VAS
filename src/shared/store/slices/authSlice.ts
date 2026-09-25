import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { User } from "../types"

export type PersonaMode = "ADMIN" | "CLIENT"

export interface AuthState {
  signedIn: boolean
  user: User | null
  activePersona: PersonaMode
  activeCustomerId: string | null
  accessToken: string | null
  refreshToken: string | null
  otpPending: boolean
  loginEmail: string | null
}

export const emptyOperator = (): User => ({
  id: "operator",
  name: "",
  email: "",
  phone: "",
  company: "",
  status: "ACTIVE",
  role: "ADMIN",
  profileCompleted: 0,
})

const initialState: AuthState = {
  signedIn: false,
  user: emptyOperator(),
  activePersona: "ADMIN",
  activeCustomerId: null,
  accessToken: null,
  refreshToken: null,
  otpPending: false,
  loginEmail: null,
}

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSignedIn: (state, action: PayloadAction<boolean>) => {
      state.signedIn = action.payload
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload
    },
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
      }
    },
    switchPersona: (state, action: PayloadAction<PersonaMode>) => {
      state.activePersona = action.payload
    },
    setActiveCustomer: (state, action: PayloadAction<string | null>) => {
      state.activeCustomerId = action.payload
    },
    setTokens: (
      state,
      action: PayloadAction<{ accessToken: string | null; refreshToken?: string | null }>,
    ) => {
      state.accessToken = action.payload.accessToken
      if (action.payload.refreshToken !== undefined) {
        state.refreshToken = action.payload.refreshToken
      }
    },
    setOtpPending: (state, action: PayloadAction<{ pending: boolean; email: string | null }>) => {
      state.otpPending = action.payload.pending
      state.loginEmail = action.payload.email
    },
    clearAuth: (state) => {
      state.signedIn = false
      state.user = emptyOperator()
      state.activePersona = "ADMIN"
      state.activeCustomerId = null
      state.accessToken = null
      state.refreshToken = null
      state.otpPending = false
      state.loginEmail = null
    },
    signOut: (state) => {
      state.signedIn = false
      state.user = emptyOperator()
      state.activePersona = "ADMIN"
      state.activeCustomerId = null
      state.accessToken = null
      state.refreshToken = null
      state.otpPending = false
      state.loginEmail = null
    },
  },
})

export const {
  setSignedIn,
  setUser,
  updateProfile,
  switchPersona,
  setActiveCustomer,
  setTokens,
  setOtpPending,
  clearAuth,
  signOut,
} = authSlice.actions

export default authSlice.reducer
