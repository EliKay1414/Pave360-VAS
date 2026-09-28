import { useAppDispatch, useAppSelector } from "../store"
import {
  updateBrand as updateBrandAction,
  setTheme as setThemeAction,
  type ThemeMode,
} from "../store/slices/brandSlice"
import type { BrandConfig } from "../store/types"
import { resolveBrand } from "../lib/brand"

export function useBrand() {
  const dispatch = useAppDispatch()
  const brand = useAppSelector((state) => state.brand.brand)
  const theme = useAppSelector((state) => state.brand.theme)
  const user = useAppSelector((state) => state.auth.user)

  const resolved = resolveBrand(brand, user)

  const updateBrand = (patch: Partial<BrandConfig>) => {
    dispatch(updateBrandAction(patch))
  }

  const setTheme = (mode: ThemeMode) => {
    dispatch(setThemeAction(mode))
  }

  return {
    brand,
    theme,
    resolved,
    updateBrand,
    setTheme,
  }
}

