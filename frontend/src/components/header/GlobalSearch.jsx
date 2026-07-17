import { useEffect, useMemo, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { menuItems } from "../../data/menu";

function GlobalSearch() {
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const [search, setSearch] = useState("");
  const [showResults, setShowResults] = useState(false);

  // Get logged in role
  const role = localStorage.getItem("role") || "ADMIN";

  // Filter menu items
  const filteredItems = useMemo(() => {
    if (!search.trim()) return [];

    const keyword = search.toLowerCase();

    return menuItems.filter(
      (item) =>
        item.roles.includes(role) &&
        (item.name.toLowerCase().includes(keyword) ||
          item.section.toLowerCase().includes(keyword))
    );
  }, [search, role]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        searchRef.current &&
        !searchRef.current.contains(e.target)
      ) {
        setShowResults(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const handleNavigate = (path) => {
    navigate(path);
    setSearch("");
    setShowResults(false);
  };

  return (
    <div
      ref={searchRef}
      className="relative w-full max-w-2xl"
    >
      {/* Search Icon */}
      <FaSearch
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
      />

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search pages..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setShowResults(true);
        }}
        onFocus={() => setShowResults(true)}
        className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-4 shadow-sm outline-none transition focus:border-[#25D366]"
      />

      {/* Search Results */}
      {showResults && search.trim() && (
        <div className="absolute mt-2 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl z-50">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => handleNavigate(item.path)}
                  className="flex w-full items-center gap-4 px-4 py-3 text-left hover:bg-[#DCF8C6] transition"
                >
                  <Icon
                    size={18}
                    className="text-[#25D366]"
                  />

                  <div>
                    <p className="font-medium text-gray-800">
                      {item.name}
                    </p>

                    <p className="text-xs text-gray-500 capitalize">
                      {item.section}
                    </p>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="px-4 py-4 text-sm text-gray-500">
              No pages found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default GlobalSearch;

// import { FaSearch } from "react-icons/fa";

// function GlobalSearch() {
//   return (
//     <div className="relative w-full max-w-2xl">
//       <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

//       <input
//         type="text"
//         placeholder="Search pages..."
//         className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-4 shadow-sm outline-none focus:border-[#25D366]"
//       />
//     </div>
//   );
// }

// export default GlobalSearch;