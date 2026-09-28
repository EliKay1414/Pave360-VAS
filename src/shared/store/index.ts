import { configureStore, combineReducers } from "@reduxjs/toolkit"
import { type TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import authReducer from "./slices/authSlice"
import brandReducer from "./slices/brandSlice"

const STORAGE_KEY = "pave360_vas_store_v1"

const rootReducer = combineReducers({
  auth: authReducer,
  brand: brandReducer,
})

// Load persisted state from localStorage
const loadPersistedState = () => {
  try {
    const isAuthenticated = typeof window !== "undefined" && localStorage.getItem("pave360_vas_authenticated") === "true"
    const savedUserRaw = typeof window !== "undefined" ? localStorage.getItem("pave360_vas_user") : null
    const savedUser = savedUserRaw ? JSON.parse(savedUserRaw) : null

    const serialized = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null
    const state = serialized ? JSON.parse(serialized) : {}

    if (isAuthenticated) {
      state.auth = {
        ...state.auth,
        signedIn: true,
        user: state.auth?.user?.email ? state.auth.user : savedUser || state.auth?.user,
      }
    }
    return state
  } catch {
    return undefined
  }
}

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: loadPersistedState(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

// Save state to localStorage on every state change
store.subscribe(() => {
  try {
    const state = store.getState()
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        auth: state.auth,
        brand: state.brand,
      })
    )
  } catch {
    /* ignore */
  }
})

export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
