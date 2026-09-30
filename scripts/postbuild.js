import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.resolve(__dirname, "../dist")
const indexHtml = path.join(distDir, "index.html")

if (fs.existsSync(indexHtml)) {
  // 1. Copy index.html to 404.html for S3/CloudFront/GitHub Pages SPA fallback
  fs.copyFileSync(indexHtml, path.join(distDir, "404.html"))

  // 2. Pre-generate subroute directories with index.html for direct S3/CloudFront object hits
  const routes = [
    "dashboard",
    "login",
    "carriers",
    "connections",
    "queues",
    "routing",
    "senders",
    "smpp-server",
    "ussd",
    "webhooks",
    "delivery-reports",
    "reports",
    "tenants",
    "users",
    "roles",
    "audit",
    "audit-logs",
    "settings",
    "api-keys",
    "alerts",
    "inbound",
    "messages",
    "monitoring",
    "swagger",
  ]

  for (const route of routes) {
    const routeDir = path.join(distDir, route)
    if (!fs.existsSync(routeDir)) {
      fs.mkdirSync(routeDir, { recursive: true })
    }
    fs.copyFileSync(indexHtml, path.join(routeDir, "index.html"))
  }
}
