import { useEffect, useState } from "react";
import { getBusinesses } from "../../api/businessApi";

export default function BusinessSelect({ value, onChange, multiple = false, required = false, disabled = false }) {
  const [businesses, setBusinesses] = useState([]);
  useEffect(() => { getBusinesses().then((r) => setBusinesses(r.data || [])).catch(() => setBusinesses([])); }, []);
  const selected = multiple ? (Array.isArray(value) ? value : []) : value || "";
  return <select required={required} disabled={disabled} multiple={multiple} value={selected} onChange={(e) => onChange(multiple ? Array.from(e.target.selectedOptions, (o) => o.value) : e.target.value)} className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-[#25D366]">
    {!multiple && <option value="">All businesses (global template)</option>}
    {businesses.map((business) => <option key={business.id} value={business.id}>{business.name}</option>)}
  </select>;
}