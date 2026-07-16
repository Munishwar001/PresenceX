import type { ReactNode } from "react";

export interface TableColumn<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  cellClassName?: string;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  rowKey: (row: T) => string;
  emptyMessage?: string;
}

export default function Table<T>({ columns, data, rowKey, emptyMessage = "No records found." }: TableProps<T>) {
  if (data.length === 0) {
    return <p className="py-10 text-center text-sm text-ink-500">{emptyMessage}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-140 border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-ink-100 text-xs tracking-wide text-ink-300 uppercase">
            {columns.map((column) => (
              <th key={column.key} className="pb-3 font-medium">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={rowKey(row)} className="border-b border-ink-100 last:border-none">
              {columns.map((column) => (
                <td key={column.key} className={`py-3.5 ${column.cellClassName ?? ""}`}>
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
