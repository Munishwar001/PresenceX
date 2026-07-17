import { useState, type FormEvent } from "react";
import { ApiError } from "../../client/apiClient";
import { organisationsClient, type Organisation } from "../../client/organisations.client";
import { Spinner } from "../ui/spinner";

interface FormErrors {
  name?: string;
  type?: string;
  address?: string;
  contactEmail?: string;
  contactPhone?: string;
}

interface AddOrganisationModalProps {
  onClose: () => void;
  onCreated: (organisation: Organisation) => void;
}

const TYPE_OPTIONS = ["Institute", "School", "Company", "Non-profit", "Other"];

export default function AddOrganisationModal({ onClose, onCreated }: AddOrganisationModalProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState(TYPE_OPTIONS[0]);
  const [customType, setCustomType] = useState("");
  const [address, setAddress] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const resolvedType = type === "Other" ? customType.trim() : type;

  const validate = () => {
    const nextErrors: FormErrors = {};

    if (!name.trim()) {
      nextErrors.name = "Name is required";
    }

    if (!resolvedType) {
      nextErrors.type = "Type is required";
    }

    if (contactEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
      nextErrors.contactEmail = "Enter a valid email address";
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
      const response = await organisationsClient.create({
        name: name.trim(),
        type: resolvedType,
        ...(address.trim() ? { address: address.trim() } : {}),
        ...(contactEmail.trim() ? { contactEmail: contactEmail.trim() } : {}),
        ...(contactPhone.trim() ? { contactPhone: contactPhone.trim() } : {}),
      });
      onCreated(response.organisation);
      onClose();
    } catch (err) {
      if (err instanceof ApiError && err.errors) {
        setErrors({
          name: err.errors.name?.[0],
          type: err.errors.type?.[0],
          address: err.errors.address?.[0],
          contactEmail: err.errors.contactEmail?.[0],
          contactPhone: err.errors.contactPhone?.[0],
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
        <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="mb-1.5 text-xl font-bold tracking-tight text-ink-900">Add organisation</h2>
              <p className="text-sm text-ink-500">Create an institute, company, or other organisation.</p>
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
            <label htmlFor="org-name" className="text-[13px] font-semibold text-ink-900">
              Name
            </label>
            <input
              id="org-name"
              type="text"
              placeholder="Springfield Institute"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`rounded-xl border-[1.5px] bg-ink-50 px-3.5 py-3 text-sm text-ink-900 outline-none placeholder:text-ink-200 focus:border-brand-600 focus:shadow-[0_0_0_3px_rgba(126,20,255,0.12)] ${
                errors.name ? "border-red-400" : "border-ink-100"
              }`}
            />
            {errors.name && <span className="text-xs text-red-500">{errors.name}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="org-type" className="text-[13px] font-semibold text-ink-900">
              Type
            </label>
            <select
              id="org-type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="rounded-xl border-[1.5px] border-ink-100 bg-ink-50 px-3.5 py-3 text-sm text-ink-900 outline-none focus:border-brand-600"
            >
              {TYPE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {type === "Other" && (
              <input
                type="text"
                placeholder="Describe the organisation type"
                value={customType}
                onChange={(e) => setCustomType(e.target.value)}
                className={`mt-1 rounded-xl border-[1.5px] bg-ink-50 px-3.5 py-3 text-sm text-ink-900 outline-none placeholder:text-ink-200 focus:border-brand-600 focus:shadow-[0_0_0_3px_rgba(126,20,255,0.12)] ${
                  errors.type ? "border-red-400" : "border-ink-100"
                }`}
              />
            )}
            {errors.type && <span className="text-xs text-red-500">{errors.type}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="org-address" className="text-[13px] font-semibold text-ink-900">
              Address <span className="font-normal text-ink-300">(optional)</span>
            </label>
            <input
              id="org-address"
              type="text"
              placeholder="123 Main Street, Springfield"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={`rounded-xl border-[1.5px] bg-ink-50 px-3.5 py-3 text-sm text-ink-900 outline-none placeholder:text-ink-200 focus:border-brand-600 focus:shadow-[0_0_0_3px_rgba(126,20,255,0.12)] ${
                errors.address ? "border-red-400" : "border-ink-100"
              }`}
            />
            {errors.address && <span className="text-xs text-red-500">{errors.address}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="org-contact-email" className="text-[13px] font-semibold text-ink-900">
              Contact email <span className="font-normal text-ink-300">(optional)</span>
            </label>
            <input
              id="org-contact-email"
              type="email"
              placeholder="contact@springfield.edu"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className={`rounded-xl border-[1.5px] bg-ink-50 px-3.5 py-3 text-sm text-ink-900 outline-none placeholder:text-ink-200 focus:border-brand-600 focus:shadow-[0_0_0_3px_rgba(126,20,255,0.12)] ${
                errors.contactEmail ? "border-red-400" : "border-ink-100"
              }`}
            />
            {errors.contactEmail && <span className="text-xs text-red-500">{errors.contactEmail}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="org-contact-phone" className="text-[13px] font-semibold text-ink-900">
              Contact phone <span className="font-normal text-ink-300">(optional)</span>
            </label>
            <input
              id="org-contact-phone"
              type="tel"
              placeholder="+1 555 123 4567"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className={`rounded-xl border-[1.5px] bg-ink-50 px-3.5 py-3 text-sm text-ink-900 outline-none placeholder:text-ink-200 focus:border-brand-600 focus:shadow-[0_0_0_3px_rgba(126,20,255,0.12)] ${
                errors.contactPhone ? "border-red-400" : "border-ink-100"
              }`}
            />
            {errors.contactPhone && <span className="text-xs text-red-500">{errors.contactPhone}</span>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex h-[46px] items-center justify-center rounded-xl bg-linear-to-br from-brand-600 to-brand-400 text-[15px] font-semibold text-white transition-opacity hover:not-disabled:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? <Spinner /> : "Add organisation"}
          </button>
        </form>
      </div>
    </div>
  );
}
