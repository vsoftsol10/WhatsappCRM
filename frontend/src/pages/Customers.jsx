import { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MoreVertical } from "lucide-react";
import toast from "react-hot-toast";

import useCustomerStore from "../store/customerStore";
import { getCustomers, deleteCustomer } from "../api/customerApi";
import CustomerStatCard from "../components/customers/CustomerStatCard";

function Customers() {
  const customers =
    useCustomerStore((state) => state.customers) || [];

  const setCustomers = useCustomerStore(
    (state) => state.setCustomers
  );

  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const [openMenu, setOpenMenu] = useState(null);

  const [currentPage, setCurrentPage] =
    useState(1);

  const ROWS_PER_PAGE = 10;

  const menuRef = useRef(null);

  // =========================
  // CLOSE ACTION MENU
  // =========================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setOpenMenu(null);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // =========================
  // FETCH CUSTOMERS
  // =========================

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await getCustomers(
          statusFilter === "ALL"
            ? ""
            : statusFilter,
          searchTerm
        );

        setCustomers(
          data.customers ||
            data.data ||
            []
        );
      } catch (error) {
        console.error(
          "Failed to fetch customers:",
          error
        );

        setCustomers([]);
      }
    };

    fetchCustomers();
  }, [
    setCustomers,
    statusFilter,
    searchTerm,
  ]);

  // =========================
  // RESET PAGE
  // =========================

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // =========================
  // CUSTOMER STATS
  // =========================

  const totalCustomers = customers.length;

  const activeCustomers = customers.filter(
    (customer) =>
      customer.status === "ACTIVE"
  ).length;

  const inactiveCustomers =
    customers.filter(
      (customer) =>
        customer.status === "INACTIVE"
    ).length;

  // =========================
  // PAGINATION
  // =========================

  const totalPages = Math.max(
    1,
    Math.ceil(
      customers.length / ROWS_PER_PAGE
    )
  );

  const paginatedCustomers =
    useMemo(() => {
      const start =
        (currentPage - 1) *
        ROWS_PER_PAGE;

      return customers.slice(
        start,
        start + ROWS_PER_PAGE
      );
    }, [customers, currentPage]);

  // =========================
  // DELETE CUSTOMER
  // =========================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this customer?"
    );

    if (!confirmed) return;

    try {
      await deleteCustomer(id);

      setCustomers(
        customers.filter(
          (customer) =>
            customer.id !== id
        )
      );

      toast.success(
        "Customer deleted successfully!"
      );
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data
          ?.message ||
          "Failed to delete customer"
      );
    }
  };

    return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-8">
      

        {/* ================= HEADER ================= */}

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Customers
            </h1>

            <p className="mt-2 text-gray-500">
              Manage your customer records
            </p>
          </div>

          <button
            onClick={() =>
              navigate("/customers/add")
            }
            className="rounded-xl bg-yellow-400 px-5 py-3 font-semibold text-black transition hover:bg-yellow-500"
          >
            + Add Customer
          </button>
        </div>

        {/* ================= STATS + FILTER CHIPS ================= */}

        <CustomerStatCard
          totalCustomers={totalCustomers}
          activeCustomers={activeCustomers}
          inactiveCustomers={inactiveCustomers}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        {/* ================= SEARCH + FILTER CHIPS ================= */}

          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            {/* Search */}
            <div className="w-full lg:max-w-md">
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white p-3 text-gray-900 outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200"
              />
            </div>

            {/* Filter Chips */}
            <div className="flex flex-wrap gap-3">
              {[
                {
                  key: "ALL",
                  label: "All",
                },
                {
                  key: "ACTIVE",
                  label: "Active",
                },
                {
                  key: "INACTIVE",
                  label: "Inactive",
                },
              ].map((item) => {
                const isActive =
                  statusFilter === item.key;

                return (
                  <button
                    key={item.key}
                    onClick={() =>
                      setStatusFilter(item.key)
                    }
                    className={`rounded-xl border px-5 py-2.5 text-sm font-semibold transition ${
                      isActive
                        ? "border-yellow-400 bg-yellow-400 text-black shadow-md"
                        : "border-gray-300 bg-white text-slate-700 hover:border-yellow-300 hover:bg-yellow-50"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

        {/* ================= TABLE ================= */}

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full">
            <thead className="bg-yellow-400 text-black">
              <tr>
                <th className="p-4 text-left">
                  Name
                </th>

                <th className="p-4 text-left">
                  Phone
                </th>

                <th className="p-4 text-left">
                  Email
                </th>

                <th className="p-4 text-left">
                  Company
                </th>

                <th className="p-4 text-left">
                  Status
                </th>

                <th className="p-4 text-center">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {paginatedCustomers.length > 0 ? (
                paginatedCustomers.map(
                  (customer) => (
                    <tr
                      key={customer.id}
                      onClick={() =>
                        navigate(
                          "/conversations",
                          {
                            state: {
                              customerId:
                                customer.id,
                            },
                          }
                        )
                      }
                      className="cursor-pointer border-b border-gray-100 transition hover:bg-gray-50"
                    >
                      <td className="p-4 font-medium">
                        {customer.name}
                      </td>

                      <td className="p-4">
                        {customer.phone}
                      </td>

                      <td className="p-4">
                        {customer.email}
                      </td>

                      <td className="p-4">
                        {customer.company || "-"}
                      </td>

                      <td className="p-4">
                        <span
                          className={`rounded-full px-3 py-1 text-sm font-medium ${
                            customer.status ===
                            "ACTIVE"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {customer.status}
                        </span>
                      </td>

                      {/* ================= ACTION MENU ================= */}

                      <td className="relative p-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();

                            setOpenMenu(
                              openMenu ===
                                customer.id
                                ? null
                                : customer.id
                            );
                          }}
                          className="rounded-full p-2 hover:bg-gray-100"
                        >
                          <MoreVertical
                            size={20}
                          />
                        </button>

                        {openMenu ===
                          customer.id && (
                          <div
                            ref={menuRef}
                            onClick={(e) =>
                              e.stopPropagation()
                            }
                            className="absolute right-8 top-12 z-50 w-36 rounded-lg border border-gray-200 bg-white shadow-lg"
                          >
                            <button
                              onClick={() =>
                                navigate(
                                  `/customers/${customer.id}`
                                )
                              }
                              className="w-full px-4 py-2 text-left hover:bg-gray-100"
                            >
                              View
                            </button>

                            <button
                              onClick={() =>
                                navigate(
                                  `/customers/edit/${customer.id}`
                                )
                              }
                              className="w-full px-4 py-2 text-left hover:bg-gray-100"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() =>
                                handleDelete(
                                  customer.id
                                )
                              }
                              className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="p-8 text-center text-gray-500"
                  >
                    No customers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

            {/* ================= PAGINATION ================= */}

        <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
          <p className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </p>

          <div className="flex gap-2">
            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.max(prev - 1, 1)
                )
              }
              disabled={currentPage === 1}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm transition disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-100"
            >
              Previous
            </button>

            {Array.from(
              { length: totalPages },
              (_, index) => (
                <button
                  key={index}
                  onClick={() =>
                    setCurrentPage(index + 1)
                  }
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                    currentPage === index + 1
                      ? "bg-yellow-400 text-black"
                      : "border border-gray-300 bg-white hover:bg-gray-100"
                  }`}
                >
                  {index + 1}
                </button>
              )
            )}

            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(prev + 1, totalPages)
                )
              }
              disabled={currentPage === totalPages}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm transition disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-100"
            >
              Next
            </button>
          </div>
        </div>

      
    </div>
  );
}

export default Customers;