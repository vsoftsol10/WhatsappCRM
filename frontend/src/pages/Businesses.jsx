import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";
import { createBusiness, getBusinesses, updateBusiness } from "../api/businessApi";
import BusinessStats from "../components/businesses/BusinessStats";
import BusinessFilters from "../components/businesses/BusinessFilters";
import BusinessCard from "../components/businesses/BusinessCard";

export default function Businesses() {
  const [businesses, setBusinesses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const load = () => {
    setIsLoading(true);
    return getBusinesses(true)
      .then((r) => setBusinesses(r.data || []))
      .catch(() => toast.error("Failed to load businesses."))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const filteredBusinesses = useMemo(() => {
    return businesses.filter((b) =>
      b.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [businesses, search]);

  const addBusiness = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      setSaving(true);
      await createBusiness(name.trim());
      setName("");
      setShowAddForm(false);
      await load();
      toast.success("Business added.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add business.");
    } finally {
      setSaving(false);
    }
  };

  const toggle = async (business) => {
    try {
      await updateBusiness(business.id, { isActive: !business.isActive });
      await load();
      toast.success(
        business.isActive
          ? `${business.name} deactivated.`
          : `${business.name} activated.`
      );
    } catch {
      toast.error("Failed to update business.");
    }
  };

  const rename = async (id, newName) => {
    try {
      await updateBusiness(id, { name: newName });
      await load();
      toast.success("Business renamed.");
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to rename business.");
      return false;
    }
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Businesses</h1>
          <p className="text-gray-500">
            Manage the brands available throughout the CRM
          </p>
        </div>

        <button
          onClick={() => setShowAddForm((v) => !v)}
          className="flex items-center justify-center gap-2 bg-green-400 text-black px-5 py-3 rounded-xl font-medium hover:bg-green-500 transition"
        >
          <Plus size={18} />
          Add Business
        </button>
      </div>

      {/* ADD FORM */}
      {showAddForm && (
        <form
          onSubmit={addBusiness}
          className="mb-6 flex flex-col sm:flex-row gap-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-4"
        >
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Business or brand name"
            className="flex-1 rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#25D366]"
          />
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-[#25D366] px-5 py-3 font-medium text-black hover:bg-[#1fb955] transition disabled:opacity-60"
            >
              {saving ? "Adding..." : "Add"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setName("");
              }}
              className="rounded-xl bg-gray-100 px-5 py-3 font-medium text-gray-600 hover:bg-gray-200 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* STATS */}
      <BusinessStats businesses={businesses} />

      {/* FILTERS */}
      <BusinessFilters search={search} setSearch={setSearch} />

      {/* LOADING */}
      {isLoading && (
        <div className="flex justify-center py-16 text-gray-400">
          Loading businesses...
        </div>
      )}

      {/* EMPTY STATE */}
      {!isLoading && filteredBusinesses.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center text-gray-400 bg-white rounded-2xl border border-gray-100">
          <p className="text-lg font-medium text-gray-500">
            {businesses.length === 0
              ? "No businesses yet"
              : "No businesses match your search"}
          </p>
          <p className="text-sm mt-1">
            {businesses.length === 0
              ? "Add your first business to get started."
              : "Try a different search term."}
          </p>
        </div>
      )}

      {/* GRID */}
      {!isLoading && filteredBusinesses.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredBusinesses.map((business) => (
            <BusinessCard
              key={business.id}
              business={business}
              onToggle={toggle}
              onRename={rename}
            />
          ))}
        </div>
      )}
    </div>
  );
}