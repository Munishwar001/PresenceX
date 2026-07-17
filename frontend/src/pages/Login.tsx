import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "../store/auth.store";
import { Spinner } from "../components/ui/spinner";
import { Toggle } from "../components/ui/toggle";
import { AuthScene } from "../components/auth/AuthScene";
import { SpotlightCard } from "../components/auth/SpotlightCard";
import { fieldContainer, fieldItem } from "../components/auth/formMotion";

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
    const minDelay = new Promise((resolve) => setTimeout(resolve, 400));

    Promise.all([refresh(), minDelay]).then(([success]) => {
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
      <div className="flex min-h-screen items-center justify-center bg-[#faf9f6]">
        <Spinner className="h-8 w-8 animate-spin rounded-full border-2 border-purple-100 border-t-purple-600" />
      </div>
    );
  }

  return (
    <AuthScene
      panelTitle="Signing you in"
      steps={["Checking your details", "Confirming it's you", "Getting your dashboard ready", "You're all set"]}
      note="Trusted by 1,200+ teams to track attendance"
    >
      <div className="flex justify-center">
        <SpotlightCard className="w-full max-w-[420px] rounded-2xl">
          <motion.form
            className="flex flex-col gap-5 rounded-2xl border border-black/8 bg-white p-10 shadow-xl"
            onSubmit={handleSubmit}
            noValidate
            initial="hidden"
            animate="show"
            variants={fieldContainer}
          >
            <motion.div variants={fieldItem}>
              <h2 className="font-display mb-1.5 text-2xl font-black tracking-tight text-[#1c1a22]">Sign in</h2>
              <p className="text-sm text-neutral-500">Enter your email and password to continue.</p>
            </motion.div>

            {formError && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-[13px] text-rose-600"
                role="alert"
              >
                {formError}
              </motion.div>
            )}

            <motion.div variants={fieldItem} className="flex flex-col gap-1.5">
              <label htmlFor="email" className="font-mono text-[10px] font-bold tracking-wider text-neutral-500 uppercase">
                Email
              </label>
              <div
                className={`flex items-center gap-2.5 rounded-xl border bg-[#faf9f6] px-3.5 transition-colors focus-within:border-purple-600 focus-within:ring-2 focus-within:ring-purple-600/10 ${
                  errors.email ? "border-rose-400" : "border-black/10"
                }`}
              >
                <Mail className="h-4.5 w-4.5 shrink-0 text-neutral-400" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 border-none bg-transparent py-3 text-sm text-[#1c1a22] outline-none placeholder:text-neutral-400"
                />
              </div>
              {errors.email && <span className="text-xs text-rose-500">{errors.email}</span>}
            </motion.div>

            <motion.div variants={fieldItem} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="font-mono text-[10px] font-bold tracking-wider text-neutral-500 uppercase">
                  Password
                </label>
                <Link to="/forgot-password" className="text-[13px] font-semibold text-purple-600 no-underline hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div
                className={`flex items-center gap-2.5 rounded-xl border bg-[#faf9f6] px-3.5 transition-colors focus-within:border-purple-600 focus-within:ring-2 focus-within:ring-purple-600/10 ${
                  errors.password ? "border-rose-400" : "border-black/10"
                }`}
              >
                <Lock className="h-4.5 w-4.5 shrink-0 text-neutral-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 border-none bg-transparent py-3 text-sm text-[#1c1a22] outline-none placeholder:text-neutral-400"
                />
                <button
                  type="button"
                  className="flex items-center border-none bg-transparent p-1 text-neutral-400 hover:text-purple-600"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
              {errors.password && <span className="text-xs text-rose-500">{errors.password}</span>}
            </motion.div>

            <motion.div variants={fieldItem}>
              <Toggle checked={remember} onChange={setRemember} label="Remember me" id="remember" />
            </motion.div>

            <motion.button
              variants={fieldItem}
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="flex h-[46px] items-center justify-center gap-2 rounded-xl border border-white/15 bg-[#1c1a22] text-xs font-extrabold tracking-wider text-white uppercase shadow-xs transition-colors hover:not-disabled:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? <Spinner /> : "Sign in"}
            </motion.button>

            <motion.p variants={fieldItem} className="text-center text-[13px] text-neutral-500">
              New to PresenceX?{" "}
              <Link to="/signup" className="font-semibold text-purple-600 no-underline hover:underline">
                Create an account
              </Link>
            </motion.p>
          </motion.form>
        </SpotlightCard>
      </div>
    </AuthScene>
  );
}
