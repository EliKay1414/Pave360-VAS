import type { SettingItem, SettingFormData } from "./types"

export const INITIAL_SETTINGS: SettingItem[] = [
  {
    key: "at.smsc.port",
    value: "3010",
    description: "AT SMSC SMPP port (3010, not 5010 from the VPN form).",
    updated: "2026-09-23 11:13:28Z",
    isMasked: false,
  },
  {
    key: "billing.enforce_wallet",
    value: "true",
    description: "Reject sends when wallet balance is insufficient",
    updated: "2026-09-21 20:42:15Z",
    isMasked: false,
  },
  {
    key: "compliance.nca_sender_registration",
    value: "required",
    description: "Ghana NCA sender ID registration expectation",
    updated: "2026-09-21 20:42:15Z",
    isMasked: false,
  },
  {
    key: "messaging.require_approved_sender",
    value: "true",
    description: "Require approved sender IDs for outbound SMS",
    updated: "2026-09-21 20:42:15Z",
    isMasked: false,
  },
  {
    key: "platform.country",
    value: "GH",
    description: "Primary operating country (ISO)",
    updated: "2026-09-21 20:42:15Z",
    isMasked: false,
  },
  {
    key: "platform.support_email",
    value: "support@pave360.com",
    description: "Support contact email",
    updated: "2026-09-21 20:42:15Z",
    isMasked: false,
  },
  {
    key: "platform.timezone",
    value: "Africa/Accra",
    description: "Default platform timezone",
    updated: "2026-09-21 20:42:15Z",
    isMasked: false,
  },
  {
    key: "rate_limit.api_per_minute",
    value: "120",
    description: "Default API fixed-window limit per IP",
    updated: "2026-09-21 20:42:15Z",
    isMasked: false,
  },
]

export const DEFAULT_SETTING_FORM: SettingFormData = {
  key: "",
  value: "",
  description: "",
  isMasked: false,
}
