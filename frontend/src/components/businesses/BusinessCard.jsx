import { useState } from "react";
import {
  Building2,
  Users,
  FileText,
  Megaphone,
  Pencil,
  Check,
  X,
  Power,
} from "lucide-react";

export default function BusinessCard({ business, onToggle, onRename }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(business.name);
  const [saving, setSaving] = useState(false);

  const startEdit = () => {
    setName(business.name);
    setEditing(true);
  };

  const cancelEdit = () => {
    setName(business.name);
    setEditing(false);
  };

  const saveEdit = async () => {
    const trimmed = name.trim();
    if (!trimmed || trimmed === business.name) {
      setEditing(false);
      return;
    }
    setSaving(true);
    const ok = await onRename?.(business.id, trimmed);
    setSaving(false);
    if (ok !== false) setEditing(false);
  };

  const counts = [
    { label: "Customers", value: business._count?.customers ?? 0, icon: Users },
    { label: "Templates", value: business._count?.templates ?? 0, icon: FileText },
    { label: "Campaigns", value: business._count?.campaigns ?? 0, icon: Megaphone },
  ];

  return (
    <div className="flex flex-col bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* HEADER */}
      <div className="flex items-start gap-4 p-5">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-green-100">
          <Building2 size={28} className="text-green-600" />
        </div>

        <div className="min-w-0 flex-1">
          {editing ? (
            <div className="flex items-center gap-2">
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveEdit();
                  if (e.key === "Escape") cancelEdit();
                }}
                className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-lg font-bold outline-none focus:border-[#25D366]"
              />
              <button
                onClick={saveEdit}
                disabled={saving}
                title="Save"
                className="text-green-600 hover:text-green-700 shrink-0"
              >
                <Check size={20} />
              </button>
              <button
                onClick={cancelEdit}
                title="Cancel"
                className="text-gray-400 hover:text-gray-600 shrink-0"
              >
                <X size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h2 className="break-words text-xl font-bold leading-tight text-gray-800">
                {business.name}
              </h2>
              <button
                onClick={startEdit}
                title="Rename"
                className="text-gray-300 hover:text-amber-500 transition shrink-0"
              >
                <Pencil size={16} />
              </button>
            </div>
          )}
        </div>

        <span
          className={`shrink-0 whitespace-nowrap px-4 py-1 rounded-full text-xs font-semibold ${
            business.isActive
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {business.isActive ? "Active" : "Inactive"}
        </span>
      </div>

      {/* DIVIDER */}
      <div className="border-t" />

      {/* USAGE COUNTS */}
      <div className="grid grid-cols-3 divide-x px-2 py-4 text-center">
        {counts.map(({ label, value, icon: Icon }) => (
          <div key={label} className="flex flex-col items-center gap-1 px-2">
            <Icon size={18} className="text-gray-400" />
            <span className="text-lg font-bold text-gray-800">{value}</span>
            <span className="text-xs text-gray-500">{label}</span>
          </div>
        ))}
      </div>

      {/* DIVIDER */}
      <div className="border-t" />

      {/* ACTIONS */}
      <div className="p-4">
        <button
          onClick={() => onToggle?.(business)}
          className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
            business.isActive
              ? "bg-red-50 text-red-600 hover:bg-red-100"
              : "bg-green-50 text-green-700 hover:bg-green-100"
          }`}
        >
          <Power size={16} />
          {business.isActive ? "Deactivate" : "Activate"}
        </button>
      </div>
    </div>
  );
}