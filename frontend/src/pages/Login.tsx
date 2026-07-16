import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { Mail01Icon, LockIcon, EyeIcon, EyeOffIcon } from "@hugeicons/core-free-icons";
import { useAuthStore } from "../store/auth.store";
import StrokeIcon from "../components/ui/icon/icon";
import { Spinner } from "../components/ui/Spinner";

interface FormErrors {
  email?: string;
  password?: string;
}

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const refresh = useAuthStore((state) => state.refresh);
  const loading = useAuthStore((state) => state.loading);

  const [checkingSession, setCheckingSession] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState("");

  useEffect(() => {
    let cancelled = false;

    refresh().then((success) => {
      if (cancelled) return;
      if (success) {
        navigate("/dashboard");
      } else {
        setCheckingSession(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [refresh, navigate]);

  const validate = () => {
    const nextErrors: FormErrors = {};

    if (!email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Enter a valid email address";
    }

    if (!password) {
      nextErrors.password = "Password is required";
    } else if (password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFormError("");

    if (!validate()) return;

    const success = await login(email, password);
    if (success) {
      navigate("/dashboard");
    } else {
      setFormError(useAuthStore.getState().error ?? "Something went wrong. Please try again.");
    }
  };

  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <Spinner className="h-8 w-8 animate-spin rounded-full border-2 border-brand-100 border-t-brand-600" />
      </div>
    );
  }

  return (
    <div className="grid min-h-screen grid-cols-1 bg-white md:grid-cols-2">
      <div className="relative hidden items-center justify-center overflow-hidden bg-linear-to-br from-brand-600 via-brand-400 to-accent-400 p-12 text-white md:flex">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.18),transparent_45%),radial-gradient(circle_at_80%_85%,rgba(255,255,255,0.14),transparent_50%)]" />

        <div className="relative max-w-md">
          <div className="mb-14 flex items-center gap-2.5">
            <svg className="h-[29px] w-[30px]" viewBox="0 0 48 46" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fill="url(#login-logo-gradient)"
                d="M25.946 44.938c-.664.845-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-2.262-2.262H10.287c-.92 0-1.456-1.04-.92-1.788l7.48-10.471c1.07-1.497 0-3.578-1.842-3.578H1.237c-.92 0-1.456-1.04-.92-1.788L10.013.474c.214-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.579 1.842 3.579h11.377c.943 0 1.473 1.088.89 1.83L25.947 44.94z"
              />
              <defs>
                <linearGradient id="login-logo-gradient" x1="0" y1="0" x2="48" y2="46" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#a566ff" />
                  <stop offset="1" stopColor="#7e14ff" />
                </linearGradient>
              </defs>
            </svg>
            <span className="text-xl font-bold tracking-tight">PresenceX</span>
          </div>

          <h1 className="mb-4 text-4xl leading-tight font-bold tracking-tight">Welcome back.</h1>
          <p className="text-base leading-relaxed text-white/85">
            Sign in to track attendance and manage presence for your team in one place.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center bg-brand-100 p-8">
        <form
          className="flex w-full max-w-[400px] flex-col gap-5 rounded-[20px] bg-white p-10 shadow-[0_20px_45px_-20px_rgba(126,20,255,0.25)]"
          onSubmit={handleSubmit}
          noValidate
        >
          <div>
            <h2 className="mb-1.5 text-2xl font-bold tracking-tight text-ink-900">Sign in</h2>
            <p className="text-sm text-ink-500">Enter your credentials to access your account.</p>
          </div>

          {formError && (
            <div className="rounded-[10px] border border-red-200 bg-red-50 px-3.5 py-2.5 text-[13px] text-red-600" role="alert">
              {formError}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-[13px] font-semibold text-ink-900">
              Email
            </label>
            <div
              className={`flex items-center gap-2.5 rounded-xl border-[1.5px] bg-ink-50 px-3.5 transition-colors focus-within:border-brand-600 focus-within:shadow-[0_0_0_3px_rgba(126,20,255,0.12)] ${
                errors.email ? "border-red-400" : "border-ink-100"
              }`}
            >
              <StrokeIcon icon={Mail01Icon} className="shrink-0 text-ink-300" size={18} strokeWidth={1.8} />
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 border-none bg-transparent py-3 text-sm text-ink-900 outline-none placeholder:text-ink-200"
              />
            </div>
            {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-[13px] font-semibold text-ink-900">
                Password
              </label>
              <Link to="/forgot-password" className="text-[13px] font-medium text-brand-600 no-underline hover:underline">
                Forgot password?
              </Link>
            </div>
            <div
              className={`flex items-center gap-2.5 rounded-xl border-[1.5px] bg-ink-50 px-3.5 transition-colors focus-within:border-brand-600 focus-within:shadow-[0_0_0_3px_rgba(126,20,255,0.12)] ${
                errors.password ? "border-red-400" : "border-ink-100"
              }`}
            >
              <StrokeIcon icon={LockIcon} className="shrink-0 text-ink-300" size={18} strokeWidth={1.8} />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 border-none bg-transparent py-3 text-sm text-ink-900 outline-none placeholder:text-ink-200"
              />
              <button
                type="button"
                className="flex items-center border-none bg-transparent p-1 text-ink-300 hover:text-brand-600"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <StrokeIcon icon={EyeOffIcon} size={18} strokeWidth={1.8} />
                ) : (
                  <StrokeIcon icon={EyeIcon} size={18} strokeWidth={1.8} />
                )}
              </button>
            </div>
            {errors.password && <span className="text-xs text-red-500">{errors.password}</span>}
          </div>

          <label className="flex cursor-pointer items-center gap-2 text-[13px] text-ink-500 select-none">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 cursor-pointer accent-brand-600"
            />
            <span>Remember me</span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="flex h-[46px] items-center justify-center rounded-xl bg-linear-to-br from-brand-600 to-brand-400 text-[15px] font-semibold text-white transition-opacity hover:not-disabled:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? <Spinner /> : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
