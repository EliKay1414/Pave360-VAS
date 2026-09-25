import {
  LayoutGrid,
  Wifi,
  Link2,
  ArrowLeftRight,
  Server,
  AlignJustify,
  AlignLeft,
  ClipboardList,
  Inbox,
  CreditCard,
  Smartphone,
  BarChart3,
  Zap,
  Key,
  PlusCircle,
  BookOpen,
  Monitor,
  Bell,
  Building2,
  User,
  ShieldCheck,
  Eye,
  Settings,
  type LucideIcon,
} from "lucide-react"

export interface AdminNavItem {
  id: string
  title: string
  path: string
  icon: LucideIcon
  badgeKey?: string
}

export interface AdminNavGroup {
  heading: string
  items: AdminNavItem[]
}

export const TOP_NAV_ITEM: AdminNavItem = {
  id: "DASHBOARD",
  title: "Dashboard",
  path: "/dashboard",
  icon: LayoutGrid,
}

export const ADMIN_NAV_GROUPS: AdminNavGroup[] = [
  {
    heading: "NETWORK",
    items: [
      { id: "CARRIERS", title: "Carriers", path: "/network/carriers", icon: Wifi },
      { id: "CONNECTIONS", title: "Connections", path: "/network/connections", icon: Link2 },
      { id: "ROUTING", title: "Routing", path: "/network/routing", icon: ArrowLeftRight },
      { id: "SMPP_SERVER", title: "SMPP Server", path: "/network/smpp-server", icon: Server },
      { id: "QUEUES", title: "Queues", path: "/network/queues", icon: AlignJustify },
    ],
  },
  {
    heading: "TRAFFIC & LOGS",
    items: [
      { id: "TRAFFIC_LOGS", title: "Traffic Logs", path: "/traffic/logs", icon: AlignLeft },
      { id: "DELIVERY_REPORTS", title: "Delivery Reports", path: "/traffic/delivery-reports", icon: ClipboardList },
      { id: "INBOUND_MO", title: "Inbound SMS", path: "/traffic/inbound-mo", icon: Inbox },
      { id: "SENDER_IDS", title: "Sender IDs", path: "/traffic/sender-ids", icon: CreditCard },
      { id: "USSD_SESSIONS", title: "USSD", path: "/traffic/ussd-sessions", icon: Smartphone },
      { id: "REPORTS_BILLING", title: "Reports & Billing", path: "/traffic/reports-billing", icon: BarChart3 },
    ],
  },
  {
    heading: "DEVELOPERS",
    items: [
      { id: "DEVELOPER_LOGS", title: "Developer Logs", path: "/developers/logs", icon: Zap },
      { id: "API_KEYS", title: "API Keys", path: "/developers/api-keys", icon: Key },
      { id: "WEBHOOKS", title: "Webhooks", path: "/developers/webhooks", icon: PlusCircle },
      { id: "API_DOCS", title: "API Documentation", path: "/developers/documentation", icon: BookOpen },
    ],
  },
  {
    heading: "OPERATIONS",
    items: [
      { id: "MONITORING", title: "Monitoring", path: "/operations/monitoring", icon: Monitor },
      { id: "ALARMS", title: "Alarms", path: "/operations/alarms", icon: Bell },
    ],
  },
  {
    heading: "ADMINISTRATION",
    items: [
      { id: "TENANTS", title: "Tenants", path: "/administration/tenants", icon: Building2 },
      { id: "USERS", title: "Users", path: "/administration/users", icon: User },
      { id: "ROLES_PERMISSIONS", title: "Roles & Permissions", path: "/administration/roles", icon: ShieldCheck },
    ],
  },
]

export const BOTTOM_NAV_ITEMS: AdminNavItem[] = [
  { id: "AUDIT_LOGS", title: "Audit Logs", path: "/audit-logs", icon: Eye },
  { id: "SETTINGS", title: "Settings", path: "/settings", icon: Settings },
]

export const ADMIN_NAV_CONFIG: AdminNavGroup[] = ADMIN_NAV_GROUPS
