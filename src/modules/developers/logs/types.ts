export interface ApiLogRecord {
  id: string
  status: number
  method: "POST" | "GET" | "PUT" | "DELETE" | string
  path: string
  duration: number
  tenant: string
  apiKey: string
  clientIp: string
  timestamp: string
  userAgent: string
  requestBody: string
  responseBody: string
  errorReason?: string
}

export const HTTP_METHODS_OPTIONS = [
  "All Methods",
  "POST",
  "GET",
  "PUT",
  "DELETE",
] as const

export const HTTP_STATUS_OPTIONS = [
  "All Statuses",
  "2xx Success",
  "4xx Client Error",
  "5xx Server Error",
  "200 OK",
  "400 Bad Request",
  "401 Unauthorized",
  "404 Not Found",
  "429 Rate Limit",
  "500 Server Error",
] as const

/**
 * Format date string "YYYY-MM-DD HH:mm:ss" to "Fri, 25 Sep 2026 11:55:25 GMT"
 */
export function formatGmtTimestamp(dateStr: string): string {
  const parts = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})$/)
  if (!parts) return dateStr
  const year = parseInt(parts[1], 10)
  const monthIndex = parseInt(parts[2], 10) - 1
  const day = parseInt(parts[3], 10)
  const hour = parseInt(parts[4], 10)
  const minute = parseInt(parts[5], 10)
  const second = parseInt(parts[6], 10)

  const d = new Date(Date.UTC(year, monthIndex, day, hour, minute, second))
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ]

  const pad = (n: number) => n.toString().padStart(2, "0")
  return `${days[d.getUTCDay()]}, ${d.getUTCDate()} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())} GMT`
}

/**
 * Generate Sanitized Request Headers matching media_1790354734617.png
 */
export function getSanitizedRequestHeaders(log: ApiLogRecord): string {
  const ip = log.clientIp.startsWith("::ffff:") ? log.clientIp.replace("::ffff:", "") : log.clientIp
  const resolvedIp = ip === "172.18.0.1" ? "154.160.0.151" : ip
  const keyPrefix = log.apiKey.replace(/\.+$/, "")
  const bodyLen = log.requestBody ? log.requestBody.replace(/\s/g, "").length + 20 : 108

  return `{\n  "Accept": "*/*",\n  "Connection": "close",\n  "Host": "vas.pave360.com",\n  "User-Agent": "${log.userAgent || "PostmanRuntime/2.6.0"}",\n  "Accept-Encoding": "gzip, deflate, br",\n  "Cache-Control": "no-cache",\n  "Content-Type": "application/json",\n  "Content-Length": "${bodyLen}",\n  "X-Real-IP": "${resolvedIp}",\n  "X-Forwarded-For": "${resolvedIp}",\n  "X-Forwarded-Proto": "https",\n  "x-api-key": "${keyPrefix}...[REDACTED]",\n  "Postman-Token": "0d1cc3e3-e758-4894-8205-5f8bdbe6ab40"\n}`
}

/**
 * Generate Response Headers matching media_1790354740679.png
 */
export function getResponseHeaders(log: ApiLogRecord): string {
  const gmtDate = formatGmtTimestamp(log.timestamp)
  return `{\n  "Connection": "close",\n  "Content-Type": "application/json; charset=utf-8",\n  "Date": "${gmtDate}",\n  "Server": "Kestrel",\n  "Transfer-Encoding": "chunked",\n  "X-Content-Type-Options": "nosniff",\n  "X-Frame-Options": "DENY",\n  "Referrer-Policy": "strict-origin-when-cross-origin",\n  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",\n  "X-XSS-Protection": "0",\n  "Content-Security-Policy": "default-src \\u0027self\\u0027; img-src \\u0027self\\u0027 data: https:;",\n  "X-RateLimit-Limit": "120",\n  "X-RateLimit-Remaining": "119"\n}`
}

/**
 * Generate cURL command matching user prompt & screenshot media_1790353950918.png
 */
export function getCurlCommand(log: ApiLogRecord): string {
  const compactBody = log.requestBody.replace(/\s+/g, " ")
  return `curl -X ${log.method} "https://vas.pave360.com${log.path}" \\
  -H "Content-Type: application/json" \\
  -H "X-Api-Key: ${log.apiKey}" \\
  -d "${compactBody.replace(/"/g, '\\"')}"`
}
