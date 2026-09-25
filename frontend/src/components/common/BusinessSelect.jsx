import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { getBusinesses } from "../../api/businessApi";

const FIELD_CLASS =
  "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-[#25D366]";

// Multi-select shown as a normal dropdown: a button that opens a checkbox list.
function MultiBusinessDropdown({ businesses, value, onChange, disabled }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const toggleBusiness = (id) => {
    onChange(
      value.includes(id) ? value.filter((v) => v !== id) : [...value, id]
    );
  };

  const selectedNames = businesses
    .filter((business) => value.includes(business.id))
    .map((business) => business.name);

  return (
    <div ref={wrapperRef} className="relative">
      {/* type="button" so it never submits the surrounding form */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`${FIELD_CLASS} flex items-center justify-between gap-3 text-left disabled:cursor-not-allowed disabled:bg-gray-100 ${
          open ? "border-[#25D366]" : ""
        }`}
      >
        <span
          className={`truncate ${
            selectedNames.length ? "text-gray-900" : "text-gray-400"
          }`}
        >
          {selectedNames.length
            ? selectedNames.join(", ")
            : "Select businesses"}
        </span>

        <ChevronDown
          size={18}
          className={`shrink-0 text-gray-500 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-multiselectable="true"
          className="absolute z-50 mt-1 max-h-52 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
        >
          {businesses.length === 0 ? (
            <p className="px-4 py-3 text-sm text-gray-500">
              No businesses found.
            </p>
          ) : (
            businesses.map((business) => {
              const checked = value.includes(business.id);

              return (
                <label
                  key={business.id}
                  className="flex cursor-pointer items-center gap-3 px-4 py-2.5 hover:bg-[#DCF8C6]/60"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleBusiness(business.id)}
                    className="h-4 w-4 accent-[#25D366]"
                  />

                  <span className="flex-1 text-gray-800">{business.name}</span>

                  {checked && <Check size={16} className="text-[#128C7E]" />}
                </label>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export default function BusinessSelect({
  value,
  onChange,
  multiple = false,
  required = false,
  disabled = false,
  allowGlobal = true,
}) {
  const [businesses, setBusinesses] = useState([]);

  useEffect(() => {
    getBusinesses()
      .then((r) => setBusinesses(r.data || []))
      .catch(() => setBusinesses([]));
  }, []);

  // Multiple: dropdown with checkboxes. The parent form validates that at
  // least one business is chosen (a custom dropdown has no native "required").
  if (multiple) {
    return (
      <MultiBusinessDropdown
        businesses={businesses}
        value={Array.isArray(value) ? value : []}
        onChange={onChange}
        disabled={disabled}
      />
    );
  }

  // Single: normal <select> dropdown (unchanged)
  return (
    <select
      required={required}
      disabled={disabled}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className={FIELD_CLASS}
    >
      {allowGlobal && <option value="">All businesses (global)</option>}
      {!allowGlobal && <option value="">Select a business</option>}
      {businesses.map((business) => (
        <option key={business.id} value={business.id}>
          {business.name}
        </option>
      ))}
    </select>
  );
}