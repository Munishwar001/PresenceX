import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import { useAuthStore } from "../store/auth.store";
import { Spinner } from "../components/ui/spinner";
import { Checkbox } from "../components/ui/checkbox";
import { AuthScene } from "../components/auth/AuthScene";
import { SpotlightCard } from "../components/auth/SpotlightCard";
import { PasswordStrengthMeter } from "../components/auth/PasswordStrengthMeter";
import { fieldContainer, fieldItem } from "../components/auth/formMotion";

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
}

export default function Signup() {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  const refresh = useAuthStore((state) => state.refresh);
  const loading = useAuthStore((state) => state.loading);

  const [checkingSession, setCheckingSession] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
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

    if (!name.trim()) {
      nextErrors.name = "Name is required";
    }

    if (!email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Enter a valid email address";
    }

    if (!password) {
      nextErrors.password = "Password is required";
    } else if (password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters";
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = "Confirm your password";
    } else if (confirmPassword !== password) {
      nextErrors.confirmPassword = "Passwords don't match";
    }

    if (!agreed) {
      nextErrors.terms = "You need to accept the terms to continue";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFormError("");

    if (!validate()) return;

    const success = await register(name.trim(), email, password);
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
      logLines={[
        "Initializing workspace container...",
        "Database schema provisioned",
        "Creating admin session token...",
        "Encryption keys generated",
        "Workspace ready — deploy complete",
      ]}
      stats={[
        { label: "SETUP", value: "< 60s" },
        { label: "REGION", value: "AP-SOUTH" },
      ]}
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
              <span className="mb-3 block font-mono text-[9px] font-bold tracking-widest text-purple-600 uppercase">
                Step 01 // Deploy
              </span>
              <h2 className="font-display mb-1.5 text-2xl font-black tracking-tight text-[#1c1a22]">Create your account</h2>
              <p className="text-sm text-neutral-500">Set up your workspace in under a minute.</p>
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
              <label htmlFor="name" className="font-mono text-[10px] font-bold tracking-wider text-neutral-500 uppercase">
                Full name
              </label>
              <div
                className={`flex items-center gap-2.5 rounded-xl border bg-[#faf9f6] px-3.5 transition-colors focus-within:border-purple-600 focus-within:ring-2 focus-within:ring-purple-600/10 ${
                  errors.name ? "border-rose-400" : "border-black/10"
                }`}
              >
                <User className="h-4.5 w-4.5 shrink-0 text-neutral-400" />
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Jordan Lee"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex-1 border-none bg-transparent py-3 text-sm text-[#1c1a22] outline-none placeholder:text-neutral-400"
                />
              </div>
              {errors.name && <span className="text-xs text-rose-500">{errors.name}</span>}
            </motion.div>

            <motion.div variants={fieldItem} className="flex flex-col gap-1.5">
              <label htmlFor="email" className="font-mono text-[10px] font-bold tracking-wider text-neutral-500 uppercase">
                Work email
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
              <label htmlFor="password" className="font-mono text-[10px] font-bold tracking-wider text-neutral-500 uppercase">
                Password
              </label>
              <div
                className={`flex items-center gap-2.5 rounded-xl border bg-[#faf9f6] px-3.5 transition-colors focus-within:border-purple-600 focus-within:ring-2 focus-within:ring-purple-600/10 ${
                  errors.password ? "border-rose-400" : "border-black/10"
                }`}
              >
                <Lock className="h-4.5 w-4.5 shrink-0 text-neutral-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Create a password"
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
              <PasswordStrengthMeter password={password} />
              {errors.password && <span className="text-xs text-rose-500">{errors.password}</span>}
            </motion.div>

            <motion.div variants={fieldItem} className="flex flex-col gap-1.5">
              <label htmlFor="confirmPassword" className="font-mono text-[10px] font-bold tracking-wider text-neutral-500 uppercase">
                Confirm password
              </label>
              <div
                className={`flex items-center gap-2.5 rounded-xl border bg-[#faf9f6] px-3.5 transition-colors focus-within:border-purple-600 focus-within:ring-2 focus-within:ring-purple-600/10 ${
                  errors.confirmPassword ? "border-rose-400" : "border-black/10"
                }`}
              >
                <Lock className="h-4.5 w-4.5 shrink-0 text-neutral-400" />
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="flex-1 border-none bg-transparent py-3 text-sm text-[#1c1a22] outline-none placeholder:text-neutral-400"
                />
              </div>
              {errors.confirmPassword && <span className="text-xs text-rose-500">{errors.confirmPassword}</span>}
            </motion.div>

            <motion.div variants={fieldItem}>
              <Checkbox checked={agreed} onChange={setAgreed} id="terms" error={!!errors.terms}>
                I agree to the <span className="font-semibold text-[#1c1a22]">Terms of Service</span> and{" "}
                <span className="font-semibold text-[#1c1a22]">Privacy Policy</span>.
              </Checkbox>
              {errors.terms && <span className="mt-1 block text-xs text-rose-500">{errors.terms}</span>}
            </motion.div>

            <motion.button
              variants={fieldItem}
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="flex h-[46px] items-center justify-center gap-2 rounded-xl border border-white/15 bg-[#1c1a22] text-xs font-extrabold tracking-wider text-white uppercase shadow-xs transition-colors hover:not-disabled:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <Spinner />
              ) : (
                <>
                  <span>&gt;_</span> Deploy account
                </>
              )}
            </motion.button>

            <motion.p variants={fieldItem} className="text-center text-[13px] text-neutral-500">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-purple-600 no-underline hover:underline">
                Sign in
              </Link>
            </motion.p>
          </motion.form>
        </SpotlightCard>
      </div>
    </AuthScene>
  );
}
