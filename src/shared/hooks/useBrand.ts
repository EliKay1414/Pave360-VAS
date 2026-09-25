import { useAppDispatch, useAppSelector } from "../store"
import {
  updateBrand as updateBrandAction,
  setTheme as setThemeAction,
  updateShopDetails as updateShopDetailsAction,
  type ThemeMode,
} from "../store/slices/brandSlice"
import type { BrandConfig } from "../store/types"
import { resolveBrand } from "../lib/brand"

export function useBrand() {
  const dispatch = useAppDispatch()
  const brand = useAppSelector((state) => state.brand.brand)
  const theme = useAppSelector((state) => state.brand.theme)
  const shopName = useAppSelector((state) => state.brand.shopName)
  const shopWhatsApp = useAppSelector((state) => state.brand.shopWhatsApp)
  const shopWhatsAppGroup = useAppSelector((state) => state.brand.shopWhatsAppGroup)
  const shopHandle = useAppSelector((state) => state.brand.shopHandle)
  const shopIconUrl = useAppSelector((state) => state.brand.shopIconUrl)
  const shopPhotoUrl = useAppSelector((state) => state.brand.shopPhotoUrl)
  const user = useAppSelector((state) => state.auth.user)

  const resolved = resolveBrand(brand, shopName, user)

  const updateBrand = (patch: Partial<BrandConfig>) => {
    dispatch(updateBrandAction(patch))
  }

  const setTheme = (mode: ThemeMode) => {
    dispatch(setThemeAction(mode))
  }

  const updateShopDetails = (
    name?: string,
    whatsApp?: string,
    whatsAppGroup?: string,
    handle?: string,
    iconUrl?: string,
    photoUrl?: string,
  ) => {
    dispatch(
      updateShopDetailsAction({
        name,
        whatsApp,
        whatsAppGroup,
        handle,
        iconUrl,
        photoUrl,
      }),
    )
  }

  return {
    brand,
    theme,
    shopName,
    shopWhatsApp,
    shopWhatsAppGroup,
    shopHandle,
    shopIconUrl,
    shopPhotoUrl,
    resolved,
    updateBrand,
    setTheme,
    updateShopDetails,
  }
}
