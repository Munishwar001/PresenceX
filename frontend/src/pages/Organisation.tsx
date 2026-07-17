import { useEffect, useState } from "react";
import { useAuthStore } from "../store/auth.store";
import Table, { type TableColumn } from "../components/ui/table";
import AddOrganisationModal from "../components/addOrganisationModal";
import { organisationsClient, type Organisation } from "../client/organisations.client";
import { ApiError } from "../client/apiClient";
import { Spinner } from "../components/ui/spinner";

const MANAGE_ROLES = ["admin", "superadmin"];

const ORGANISATION_COLUMNS: TableColumn<Organisation>[] = [
  { key: "name", header: "Name", render: (row) => row.name, cellClassName: "font-medium text-ink-900" },
  {
    key: "type",
    header: "Type",
    render: (row) => (
      <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-600">{row.type}</span>
    ),
  },
  { key: "address", header: "Address", render: (row) => row.address ?? "—", cellClassName: "text-ink-500" },
  { key: "contactEmail", header: "Contact email", render: (row) => row.contactEmail ?? "—", cellClassName: "text-ink-500" },
  { key: "contactPhone", header: "Contact phone", render: (row) => row.contactPhone ?? "—", cellClassName: "text-ink-500" },
];

export default function Organisation() {
  const user = useAuthStore((state) => state.user);
  const canManage = user?.roles.some((userRole) => MANAGE_ROLES.includes(userRole.role.name)) ?? false;

  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    organisationsClient
      .list()
      .then(({ organisations }) => {
        if (!cancelled) setOrganisations(organisations);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : "Failed to load organisations.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="rounded-2xl border border-ink-100 bg-white p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-ink-900">Organisation</h2>
          <p className="text-sm text-ink-500">Manage the organisations you oversee.</p>
        </div>
        {canManage && (
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex h-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-brand-600 to-brand-400 px-4 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Add organisation
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Spinner className="h-6 w-6 animate-spin rounded-full border-2 border-brand-100 border-t-brand-600" />
        </div>
      ) : error ? (
        <p className="py-10 text-center text-sm text-red-500">{error}</p>
      ) : (
        <Table
          columns={ORGANISATION_COLUMNS}
          data={organisations}
          rowKey={(row) => row.id}
          emptyMessage="No organisations added yet."
        />
      )}

      {isModalOpen && (
        <AddOrganisationModal
          onClose={() => setIsModalOpen(false)}
          onCreated={(organisation) => setOrganisations((prev) => [organisation, ...prev])}
        />
      )}
    </section>
  );
}
