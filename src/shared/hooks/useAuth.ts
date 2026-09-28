import { useAppDispatch, useAppSelector } from "../store"
import {
  setSignedIn,
  setUser,
  updateProfile as updateProfileAction,
  switchPersona as switchPersonaAction,
  setActiveCustomer as setActiveCustomerAction,
  emptyOperator,
  type PersonaMode,
} from "../store/slices/authSlice"
import { updateBrand } from "../store/slices/brandSlice"
import {
  loginOperator,
  verifyOperatorOtp,
  logoutOperator,
  registerOperator,
} from "../integrations/auth.integration"
import type { User } from "../store/types"

export function useAuth() {
  const dispatch = useAppDispatch()
  const signedIn = useAppSelector((state) => state.auth.signedIn)
  const user = useAppSelector((state) => state.auth.user)
  const activePersona = useAppSelector((state) => state.auth.activePersona)
  const activeCustomerId = useAppSelector((state) => state.auth.activeCustomerId)
  const otpPending = useAppSelector((state) => state.auth.otpPending)
  const loginEmail = useAppSelector((state) => state.auth.loginEmail)

  const completeLogin = async (email: string, password = "") => {
    return loginOperator(email, password)
  }

  const completeOtp = async (otp: string) => {
    const email = loginEmail || user?.email || ""
    return verifyOperatorOtp(email, otp)
  }

  const completeSignup = (details: { name: string; email: string; company: string }) => {
    registerOperator(details, dispatch)
  }

  const updateProfile = (patch: Partial<User>) => {
    dispatch(updateProfileAction(patch))
    const company = patch.company?.trim()
    if (company) {
      dispatch(updateBrand({ brandName: company }))
    }
  }

  const signOut = async () => {
    await logoutOperator()
  }

  return {
    signedIn,
    user,
    activePersona,
    isAdmin: activePersona === "ADMIN",
    isClient: activePersona === "CLIENT",
    activeCustomerId,
    otpPending,
    loginEmail,
    setSignedIn: (val: boolean) => dispatch(setSignedIn(val)),
    setUser: (u: User | null) => dispatch(setUser(u)),
    updateProfile,
    switchPersona: (mode: PersonaMode) => dispatch(switchPersonaAction(mode)),
    setActiveCustomer: (customerId: string | null) => dispatch(setActiveCustomerAction(customerId)),
    signOut,
    completeLogin,
    completeOtp,
    completeSignup,
    legacyCompleteLogin: (email: string) => {
      dispatch(setUser({ ...(user || emptyOperator()), email: email.trim() }))
      dispatch(setSignedIn(true))
      dispatch(switchPersonaAction("ADMIN"))
    },
  }
}
