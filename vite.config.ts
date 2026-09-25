import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { TanStackRouterVite } from "@tanstack/router-plugin/vite"

import path from "path"

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@modules": path.resolve(__dirname, "./src/modules"),
      "@shared": path.resolve(__dirname, "./src/shared"),
    },
  },
  plugins: [
    TanStackRouterVite({ autoCodeSplitting: true }),
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5173,
    strictPort: false,
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/recharts")) {
            return "vendor-charts"
          }
          if (id.includes("node_modules/@reduxjs") || id.includes("node_modules/react-redux")) {
            return "vendor-redux"
          }
          if (id.includes("node_modules/lucide-react")) {
            return "vendor-icons"
          }
          if (id.includes("node_modules/react") || id.includes("node_modules/react-dom")) {
            return "vendor-react"
          }
        },
      },
    },
  },
})
