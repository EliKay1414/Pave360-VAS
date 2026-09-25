/**
 * Modular Architecture for Pave360 VAS
 * Direct mapping to Pave360 VAS Operator Navigation
 */


export * from "./nav/AdminNav"

// Layout
export * from "./layout/VasLayoutView"
export * from "./layout/Header"
export * from "./layout/SidebarContent"
export * from "./layout/BottomNavigation"

// Dashboard
export * from "./dashboard/VasDashboardView"

// Network
export * from "./network/CarriersView"
export * from "./network/ConnectionsView"
export * from "./network/RoutingView"
export * from "./network/SmppServerView"
export * from "./network/QueuesView"

// Traffic & Logs
export * from "./traffic/TrafficLogsView"
export * from "./traffic/DeliveryReportsView"
export * from "./traffic/InboundMoView"
export * from "./traffic/SenderIdsView"
export * from "./traffic/UssdSessionsView"
export * from "./traffic/ReportsBillingView"

// Developers
export * from "./developers/DeveloperLogsView"
export * from "./developers/ApiKeysView"
export * from "./developers/WebhooksView"
export * from "./developers/DocumentationView"

// Operations
export * from "./operations/MonitoringView"
export * from "./operations/AlarmsView"

// Administration
export * from "./administration/TenantsView"
export * from "./administration/UsersView"
export * from "./administration/RolesPermissionsView"

// Settings
export * from "./settings/SettingsView"
export * from "./settings/AuditLogsView"
