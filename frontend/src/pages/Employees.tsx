import { useState } from "react";
import { useAuthStore } from "../store/auth.store";
import Table, { type TableColumn } from "../components/ui/table";
import AddMemberModal from "../components/addMemberModal";
import type { Member } from "../client/users.client";

const MEMBER_COLUMNS: TableColumn<Member>[] = [
  {
    key: "name",
    header: "Name",
    render: (row) => (
      <div className="flex items-center gap-3 font-medium text-ink-900">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-xs font-semibold text-brand-600">
          {row.name
            .split(" ")
            .map((part) => part[0])
            .join("")}
        </div>
        {row.name}
      </div>
    ),
  },
  { key: "email", header: "Email", render: (row) => row.email, cellClassName: "text-ink-500" },
  {
    key: "role",
    header: "Role",
    render: (row) => (
      <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-600 capitalize">
        {row.roles[0]?.role.name ?? "—"}
      </span>
    ),
  },
];

export default function Employees() {
  const user = useAuthStore((state) => state.user);
  const isSuperAdmin = user?.roles.some((userRole) => userRole.role.name === "superadmin") ?? false;

  const [members, setMembers] = useState<Member[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="rounded-2xl border border-ink-100 bg-white p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-ink-900">Employees</h2>
          <p className="text-sm text-ink-500">Manage the employees in your organisation.</p>
        </div>
        {isSuperAdmin && (
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex h-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-brand-600 to-brand-400 px-4 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Add member
          </button>
        )}
      </div>

      <Table columns={MEMBER_COLUMNS} data={members} rowKey={(row) => row.id} emptyMessage="No employees added yet." />

      {isModalOpen && (
        <AddMemberModal
          onClose={() => setIsModalOpen(false)}
          onCreated={(member) => setMembers((prev) => [member, ...prev])}
        />
      )}
    </section>
  );
}
