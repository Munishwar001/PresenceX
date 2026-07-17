import { useState, type FormEvent } from "react";
import { ApiError } from "../../client/apiClient";
import { usersClient, type CreateMemberResponse, type Member, type MemberRole } from "../../client/users.client";
import { Spinner } from "../ui/spinner";

interface FormErrors {
  name?: string;
  email?: string;
  role?: string;
  password?: string;
}

interface AddMemberModalProps {
  onClose: () => void;
  onCreated: (member: Member) => void;
}

const ROLE_OPTIONS: { value: MemberRole; label: string }[] = [
  { value: "admin", label: "Admin" },
  { value: "teacher", label: "Teacher" },
  { value: "student", label: "Student" },
];

export default function AddMemberModal({ onClose, onCreated }: AddMemberModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<MemberRole>("student");
  const [setPasswordManually, setSetPasswordManually] = useState(false);
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CreateMemberResponse | null>(null);

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

    if (setPasswordManually && password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFormError("");

    if (!validate()) return;

    setLoading(true);
    try {
      const response = await usersClient.createMember({
        name: name.trim(),
        email: email.trim(),
        role,
        ...(setPasswordManually ? { password } : {}),
      });
      setResult(response);
      onCreated(response.user);
    } catch (err) {
      if (err instanceof ApiError && err.errors) {
        setErrors({
          name: err.errors.name?.[0],
          email: err.errors.email?.[0],
          role: err.errors.role?.[0],
          password: err.errors.password?.[0],
        });
      } else if (err instanceof ApiError) {
        setFormError(err.message);
      } else {
        setFormError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-[420px] rounded-[20px] bg-white p-8 shadow-[0_20px_45px_-20px_rgba(126,20,255,0.25)]">
        {result ? (
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="mb-1.5 text-xl font-bold tracking-tight text-ink-900">Member added</h2>
              <p className="text-sm text-ink-500">
                {result.user.name} has been added as {role === "admin" ? "an" : "a"} {role}.
              </p>
            </div>

            {result.temporaryPassword && (
              <div className="rounded-[10px] border border-brand-100 bg-brand-50 px-3.5 py-3 text-sm text-ink-900">
                <p className="mb-1 font-semibold">Temporary password</p>
                <p className="font-mono text-brand-600">{result.temporaryPassword}</p>
                <p className="mt-1.5 text-xs text-ink-500">
                  Share this with the member securely. It won't be shown again.
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={onClose}
              className="flex h-[46px] items-center justify-center rounded-xl bg-linear-to-br from-brand-600 to-brand-400 text-[15px] font-semibold text-white transition-opacity hover:opacity-90"
            >
              Done
            </button>
          </div>
        ) : (
          <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="mb-1.5 text-xl font-bold tracking-tight text-ink-900">Add member</h2>
                <p className="text-sm text-ink-500">Invite a new admin, teacher, or student.</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex h-8 w-8 items-center justify-center rounded-full border-none bg-ink-50 text-ink-500 hover:bg-ink-100"
              >
                ×
              </button>
            </div>

            {formError && (
              <div className="rounded-[10px] border border-red-200 bg-red-50 px-3.5 py-2.5 text-[13px] text-red-600" role="alert">
                {formError}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label htmlFor="member-name" className="text-[13px] font-semibold text-ink-900">
                Name
              </label>
              <input
                id="member-name"
                type="text"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`rounded-xl border-[1.5px] bg-ink-50 px-3.5 py-3 text-sm text-ink-900 outline-none placeholder:text-ink-200 focus:border-brand-600 focus:shadow-[0_0_0_3px_rgba(126,20,255,0.12)] ${
                  errors.name ? "border-red-400" : "border-ink-100"
                }`}
              />
              {errors.name && <span className="text-xs text-red-500">{errors.name}</span>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="member-email" className="text-[13px] font-semibold text-ink-900">
                Email
              </label>
              <input
                id="member-email"
                type="email"
                placeholder="jane@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`rounded-xl border-[1.5px] bg-ink-50 px-3.5 py-3 text-sm text-ink-900 outline-none placeholder:text-ink-200 focus:border-brand-600 focus:shadow-[0_0_0_3px_rgba(126,20,255,0.12)] ${
                  errors.email ? "border-red-400" : "border-ink-100"
                }`}
              />
              {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="member-role" className="text-[13px] font-semibold text-ink-900">
                Role
              </label>
              <select
                id="member-role"
                value={role}
                onChange={(e) => setRole(e.target.value as MemberRole)}
                className="rounded-xl border-[1.5px] border-ink-100 bg-ink-50 px-3.5 py-3 text-sm text-ink-900 outline-none focus:border-brand-600"
              >
                {ROLE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.role && <span className="text-xs text-red-500">{errors.role}</span>}
            </div>

            <label className="flex cursor-pointer items-center gap-2 text-[13px] text-ink-500 select-none">
              <input
                type="checkbox"
                checked={setPasswordManually}
                onChange={(e) => setSetPasswordManually(e.target.checked)}
                className="h-4 w-4 cursor-pointer accent-brand-600"
              />
              <span>Set a password manually</span>
            </label>

            {setPasswordManually && (
              <div className="flex flex-col gap-1.5">
                <label htmlFor="member-password" className="text-[13px] font-semibold text-ink-900">
                  Password
                </label>
                <input
                  id="member-password"
                  type="password"
                  placeholder="Minimum 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`rounded-xl border-[1.5px] bg-ink-50 px-3.5 py-3 text-sm text-ink-900 outline-none placeholder:text-ink-200 focus:border-brand-600 focus:shadow-[0_0_0_3px_rgba(126,20,255,0.12)] ${
                    errors.password ? "border-red-400" : "border-ink-100"
                  }`}
                />
                {errors.password && <span className="text-xs text-red-500">{errors.password}</span>}
              </div>
            )}
            {!setPasswordManually && (
              <p className="-mt-2.5 text-xs text-ink-500">A temporary password will be generated automatically.</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex h-[46px] items-center justify-center rounded-xl bg-linear-to-br from-brand-600 to-brand-400 text-[15px] font-semibold text-white transition-opacity hover:not-disabled:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? <Spinner /> : "Add member"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
