import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { RouterProvider, createRouter } from "@tanstack/react-router"
import { Provider } from "react-redux"
import { store } from "@shared/store"
import { routeTree } from "./routeTree.gen"
import { restoreSessionFromStorage } from "@shared/integrations/auth.integration"
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "@shared/lib/queryClient"
import "./index.css"

const router = createRouter({ routeTree })

restoreSessionFromStorage()

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

const root = document.getElementById("root")
if (root) {
  createRoot(root).render(
    <StrictMode>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </Provider>
    </StrictMode>,
  )
}
