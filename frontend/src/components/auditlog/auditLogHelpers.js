// Only kept for actions where the auto-generated label wouldn't read
// naturally (e.g. abbreviations, or where the humanized fallback
// would read awkwardly). Any action not listed here falls back to
// humanizeAction() below — so newly added action types (new modules,
// new events) never show up as raw SNAKE_CASE without someone
// remembering to update this file first.
const ACTION_LABEL_OVERRIDES = {
  LOGIN_SUCCESS: "Logged in",
  LOGIN_FAILED: "Login failed",
};

// "LEAD_STATUS_CHANGED" -> "Lead status changed".
export function humanizeAction(action) {
  if (!action) return "-";

  const words = action.toLowerCase().split("_");

  return (
    words[0].charAt(0).toUpperCase() +
    words[0].slice(1) +
    " " +
    words.slice(1).join(" ")
  );
}

export function actionLabel(action) {
  return ACTION_LABEL_OVERRIDES[action] || humanizeAction(action);
}

export function actionBadgeClass(action) {
  const value = (action || "").toUpperCase();

  if (value.includes("CREATED") || value.includes("SUCCESS")) {
    return "bg-green-100 text-green-700";
  }

  if (
    value.includes("UPDATED") ||
    value.includes("CHANGED") ||
    value.includes("REQUESTED")
  ) {
    return "bg-[#DCF8C6] text-[#128C7E]";
  }

  if (value.includes("DELETED") || value.includes("FAILED")) {
    return "bg-red-100 text-red-700";
  }

  if (value.includes("CONVERTED") || value.includes("IMPORTED")) {
    return "bg-indigo-100 text-indigo-700";
  }

  return "bg-gray-100 text-gray-700";
}

export function entityBadgeClass(entityType) {
  switch ((entityType || "").toLowerCase()) {
    case "employee":
      return "bg-blue-100 text-blue-700";
    case "customer":
      return "bg-teal-100 text-teal-700";
    case "lead":
      return "bg-cyan-100 text-cyan-700";
    case "task":
      return "bg-purple-100 text-purple-700";
    case "ticket":
      return "bg-orange-100 text-orange-700";
    case "campaign":
      return "bg-pink-100 text-pink-700";
    case "template":
      return "bg-amber-100 text-amber-700";
    case "user":
      return "bg-slate-200 text-slate-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

export function formatLogDate(dateString) {
  if (!dateString) return "-";

  return new Date(dateString).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Known entity types across the CRM's audited modules (Deal
// intentionally excluded — skipped per product decision).
export const AUDIT_ENTITY_TYPES = [
  { key: "ALL", label: "All Entities" },
  { key: "Employee", label: "Employee" },
  { key: "Customer", label: "Customer" },
  { key: "Lead", label: "Lead" },
  { key: "Task", label: "Task" },
  { key: "Ticket", label: "Ticket" },
  { key: "Campaign", label: "Campaign" },
  { key: "Template", label: "Template" },
  { key: "User", label: "Authentication" },
];