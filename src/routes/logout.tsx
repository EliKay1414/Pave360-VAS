import * as React from "react"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import { useAuth } from "../shared/hooks/useAuth"
import { Lock, Eye, EyeOff } from "lucide-react"

export const Route = createFileRoute("/logout")({
  component: LogoutPage,
})

interface LoginFormValues {
  email: string
  password: string
}

function LogoutPage() {
  const navigate = useNavigate()
  const { signOut, completeLogin, switchPersona } = useAuth()
  const [error, setError] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)
  const [rememberMe, setRememberMe] = React.useState(true)

  // Ensure user is signed out on mounting the logout page
  React.useEffect(() => {
    signOut()
  }, [signOut])

  const form = useForm<LoginFormValues>({
    defaultValues: {
      email:
        typeof window !== "undefined"
          ? localStorage.getItem("pave360_vas_login_email") || ""
          : "",
      password: "",
    },
  })

  const onLoginSubmit = async (data: LoginFormValues) => {
    setError("")
    setLoading(true)
    try {
      if (rememberMe) {
        localStorage.setItem("pave360_vas_login_email", data.email.trim())
      } else {
        localStorage.removeItem("pave360_vas_login_email")
      }
      const res = await completeLogin(data.email, data.password)
      if (!res.ok) {
        setError(res.error || "Invalid credentials")
        setLoading(false)
        return
      }
      switchPersona("ADMIN")
      navigate({ to: "/dashboard" })
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to sign in. Please verify your credentials."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f3f5f8] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans selection:bg-[#01b8ec]/20 selection:text-[#011b33]">
      <main className="w-full max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.07)] overflow-hidden grid grid-cols-1 md:grid-cols-2">
          {/* LEFT PANEL: African Pattern Textile Art */}
          <div className="relative min-h-[240px] md:min-h-[460px] bg-slate-900 overflow-hidden">
            <img
              src="/images/africa.jpeg"
              alt="Pave360 Network Gateway"
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* RIGHT PANEL: Sign In Form */}
          <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Welcome back.
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                Sign in to manage routing tables, live traffic, and carrier interconnects.
              </p>

              <form onSubmit={form.handleSubmit(onLoginSubmit)} className="mt-6 space-y-4">
                {/* Email Address */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                  >
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="username"
                    autoFocus
                    placeholder="you@carrier.com"
                    className="w-full h-10 px-3.5 rounded-lg border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#011b33] focus:ring-1 focus:ring-[#011b33] transition-colors"
                    {...form.register("email", {
                      required: "The Email field is required.",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "The Email field is not a valid e-mail address.",
                      },
                    })}
                  />
                  {form.formState.errors.email && (
                    <span className="mt-1 block text-xs font-medium text-red-600">
                      {form.formState.errors.email.message}
                    </span>
                  )}
                </div>

                {/* Password with Eye Icon */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                  >
                    Password
                  </label>
                  <div className="relative flex items-center">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="••••••••••••"
                      className="w-full h-10 pl-3.5 pr-10 rounded-lg border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#011b33] focus:ring-1 focus:ring-[#011b33] transition-colors"
                      {...form.register("password", {
                        required: "The Password field is required.",
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 p-1 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {form.formState.errors.password && (
                    <span className="mt-1 block text-xs font-medium text-red-600">
                      {form.formState.errors.password.message}
                    </span>
                  )}
                </div>

                {/* Remember this device */}
                <div className="flex items-center pt-0.5">
                  <label className="flex items-center gap-2 text-xs text-slate-600 font-medium cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-[#011b33] focus:ring-[#011b33]"
                    />
                    <span>Remember this device</span>
                  </label>
                </div>

                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs font-medium text-red-700">
                    {error}
                  </div>
                )}

                {/* Submit Button: Sign in to gateway */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 bg-[#011b33] hover:bg-[#002244] text-white font-semibold text-sm rounded-lg shadow-xs transition-colors cursor-pointer flex items-center justify-center disabled:opacity-70"
                  >
                    <span>{loading ? "Signing in…" : "Sign in to gateway"}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Security Footer */}
            <p className="text-[11px] text-slate-400 leading-relaxed mt-6 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Encrypted with TLS 1.3. Access is limited to authorized operators.</span>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
