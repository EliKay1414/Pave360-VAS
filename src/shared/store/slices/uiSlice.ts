import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { NotificationItem } from "../types"

export interface UIState {
  notifications: NotificationItem[]
  sidebarOpen: boolean
  activeTab: string
}

const initialState: UIState = {
  notifications: [],
  sidebarOpen: false,
  activeTab: "overview",
}

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    resetUi: (state) => {
      state.notifications = []
      state.sidebarOpen = false
      state.activeTab = "overview"
    },
    addNotification: (
      state,
      action: PayloadAction<Omit<NotificationItem, "id" | "createdAt" | "read">>,
    ) => {
      state.notifications.unshift({
        ...action.payload,
        id: `NOTIF-${Date.now().toString().slice(-4)}`,
        createdAt: new Date().toISOString().slice(0, 16).replace("T", " "),
        read: false,
      })
    },
    markNotificationRead: (state, action: PayloadAction<string>) => {
      const n = state.notifications.find((item) => item.id === action.payload)
      if (n) n.read = true
    },
    markAllNotificationsRead: (state) => {
      state.notifications.forEach((n) => {
        n.read = true
      })
    },
    archiveAllNotifications: (state) => {
      state.notifications = []
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload
    },
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload
    },
  },
})

export const {
  resetUi,
  addNotification,
  markNotificationRead,
  markAllNotificationsRead,
  archiveAllNotifications,
  setSidebarOpen,
  setActiveTab,
} = uiSlice.actions

export default uiSlice.reducer
