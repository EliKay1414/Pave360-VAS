import * as React from "react"
import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router"
import { store } from "../shared/store"
import { useForm } from "react-hook-form"
import { useAuth } from "../shared/hooks/useAuth"

export const Route = createFileRoute("/login")({
  beforeLoad: () => {
    const isAuth =
      store.getState().auth.signedIn ||
      (typeof window !== "undefined" && localStorage.getItem("pave360_vas_authenticated") === "true")
    if (isAuth) {
      throw redirect({ to: "/dashboard" })
    }
  },
  component: LoginPage,
})

interface LoginFormValues {
  email: string
  password: string
}

interface OtpFormValues {
  otp: string
}

function LoginPage() {
  const navigate = useNavigate()
  const { signedIn, completeLogin, completeOtp, otpPending, loginEmail, switchPersona } = useAuth()
  const [error, setError] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)
  const [rememberMe, setRememberMe] = React.useState(true)

  const loginForm = useForm<LoginFormValues>({
    defaultValues: {
      email: typeof window !== "undefined" ? localStorage.getItem("pave360_vas_login_email") || "" : "",
      password: "",
    },
  })

  const otpForm = useForm<OtpFormValues>({
    defaultValues: {
      otp: "",
    },
  })

  // Auto-redirect is safely guarded by Route.beforeLoad before mounting
  // so typing into the form never causes sudden navigation.

  const onLoginSubmit = async (data: LoginFormValues) => {
    setError("")
    setLoading(true)
    try {
      if (rememberMe) {
        localStorage.setItem("pave360_vas_login_email", data.email.trim())
      } else {
        localStorage.removeItem("pave360_vas_login_email")
      }
      const res = await completeLogin(data.email, data.password, rememberMe)
      if (!res.ok) {
        setError(res.error)
        loginForm.resetField("password")
        setLoading(false)
        return
      }
      if (res.requiresOtp) {
        setLoading(false)
        return
      }
      // Instant router transition to dashboard without lingering in loading state
      navigate({ to: "/dashboard", replace: true })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to sign in. Please verify your credentials.")
      setLoading(false)
    }
  }

  const onOtpSubmit = async (data: OtpFormValues) => {
    setError("")
    setLoading(true)
    try {
      const res = await completeOtp(data.otp)
      if (!res.ok) {
        setError(res.error)
        setLoading(false)
        return
      }
      switchPersona("ADMIN")
      await navigate({ to: "/dashboard", replace: true })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid code. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-light-body p-4 sm:p-6 lg:p-8 selection:bg-[#01b8ec]/20 selection:text-[#011b33]">
      {/* Light Dot Grid Pattern */}
      <div className="auth-light-grid-pattern" aria-hidden="true" />

      {/* Soft Ambient Glows */}
      <div
        className="pointer-events-none absolute top-1/4 left-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-100/60 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-1/4 right-1/4 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-emerald-100/50 blur-3xl"
        aria-hidden="true"
      />

      <main className="relative z-10 w-full max-w-240 mx-auto">
        <div className="telemetry-chassis-light">
          {/* LEFT PANEL: Africa Network Showcase Image */}
          <div className="relative min-h-60 sm:min-h-70 lg:min-h-135 bg-slate-900 overflow-hidden flex items-center justify-center">
            <img
              src="/images/africa.jpeg"
              alt="Pave360 Network Coverage"
              className="h-full w-full object-cover object-center"
            />
          </div>

          {/* RIGHT PANEL: Operator Sign In Form */}
          <div className="telemetry-right-light">
            <div>
              {!otpPending ? (
                <>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Welcome back.
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
                    Sign in to manage routing tables, live traffic, and carrier interconnects.
                  </p>

                  <form
                    method="post"
                    action="#"
                    name="loginForm"
                    onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                    className="mt-6 space-y-4"
                    data-auth-form
                  >
                    {/* Email Field */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="Email">
                        Email address
                      </label>
                      <input
                        id="Email"
                        type="email"
                        autoComplete="username"
                        autoFocus
                        onFocus={(e) => e.target.select()}
                        placeholder="you@carrier.com"
                        className="telemetry-input-light"
                        {...loginForm.register("email", {
                          required: "The Email field is required.",
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "The Email field is not a valid e-mail address.",
                          },
                        })}
                      />
                      {loginForm.formState.errors.email && (
                        <span className="mt-1 block text-xs font-medium text-red-600">
                          {loginForm.formState.errors.email.message}
                        </span>
                      )}
                    </div>

                    {/* Password Field with Show/Hide Toggle */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="authPasswordInput">
                        Password
                      </label>
                      <div className="relative flex items-center">
                        <input
                          id="authPasswordInput"
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
                          placeholder="••••••••••••"
                          className="telemetry-input-light pr-10"
                          {...loginForm.register("password", {
                            required: "The Password field is required.",
                          })}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2.5 text-slate-400 hover:text-slate-700 p-1 transition-colors cursor-pointer"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                          title={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? (
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                              />
                            </svg>
                          ) : (
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                      {loginForm.formState.errors.password && (
                        <span className="mt-1 block text-xs font-medium text-red-600">
                          {loginForm.formState.errors.password.message}
                        </span>
                      )}
                    </div>

                    {/* Remember Me */}
                    <div className="flex items-center pt-0.5">
                      <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none font-medium">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="rounded border-slate-300 text-[#011b33] focus:ring-[#01b8ec]/30 accent-[#011b33]"
                        />
                        <span>Remember this device</span>
                      </label>
                    </div>

                    {error && (
                      <div className="rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs font-medium text-red-700">
                        {error}
                      </div>
                    )}

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className="telemetry-btn-primary-light flex items-center justify-center gap-2"
                      >
                        {loading && (
                          <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
                        )}
                        <span>{loading ? "Signing in…" : "Sign in to gateway"}</span>
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Two-Factor Auth
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
                    Enter the 6-digit verification code sent to{" "}
                    <span className="font-semibold text-slate-800">{loginEmail}</span>.
                  </p>

                  <form
                    onSubmit={otpForm.handleSubmit(onOtpSubmit)}
                    className="mt-6 space-y-4"
                  >
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="otp">
                        Verification Code
                      </label>
                      <input
                        id="otp"
                        type="text"
                        inputMode="numeric"
                        autoFocus
                        placeholder="••••••"
                        className="telemetry-input-light text-center font-mono text-lg font-bold tracking-[0.3em]"
                        {...otpForm.register("otp", {
                          required: "Enter the 6-digit code.",
                          minLength: { value: 6, message: "Code must be 6 digits" },
                        })}
                      />
                      {otpForm.formState.errors.otp && (
                        <span className="mt-1 block text-xs font-medium text-red-600">
                          {otpForm.formState.errors.otp.message}
                        </span>
                      )}
                    </div>

                    {error && (
                      <div className="rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs font-medium text-red-700">
                        {error}
                      </div>
                    )}

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className="telemetry-btn-primary-light"
                      >
                        <span>{loading ? "Verifying…" : "Verify and continue"}</span>
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>

            {/* Security Footer */}
            <p className="text-[11px] text-slate-400 leading-relaxed mt-6 flex items-center gap-1.5">
              <svg
                className="h-3.5 w-3.5 text-slate-400 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                />
              </svg>
              <span>Encrypted with TLS 1.3. Access is limited to authorized operators.</span>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
