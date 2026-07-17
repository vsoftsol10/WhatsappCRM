// import React, {
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from "react";

// import { useNavigate } from "react-router-dom";

// import {
//   FiArrowLeft,
//   FiUserPlus,
//   FiSearch,
//   FiMail,
//   FiMoreVertical,
//   FiEye,
//   FiEdit2,
//   FiTrash2,
// } from "react-icons/fi";

// import {
//   LayoutGrid,
//   List,
// } from "lucide-react";

// import apiClient from "../api/apiClient";
// import useEmployeeStore from "../store/employeeStore";
// import EmployeeTable from "../components/employee/EmployeeTable";
// import toast from "react-hot-toast";

// const ManageEmployees = () => {
//   const navigate = useNavigate();

//   const [searchTerm, setSearchTerm] =
//     useState("");

//   const [viewMode, setViewMode] =
//     useState("grid");

//   const [openMenuId, setOpenMenuId] =
//     useState(null);

//   const {
//     employees,
//     loading,
//     fetchEmployees,
//   } = useEmployeeStore();

//   const menuRefs = useRef({});

//   useEffect(() => {
//     fetchEmployees();
//   }, []);

//   // =========================
//   // CLOSE MENU WHEN CLICKING OUTSIDE
//   // =========================

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (
//         openMenuId &&
//         menuRefs.current[openMenuId] &&
//         !menuRefs.current[
//           openMenuId
//         ].contains(e.target)
//       ) {
//         setOpenMenuId(null);
//       }
//     };

//     document.addEventListener(
//       "mousedown",
//       handleClickOutside
//     );

//     return () => {
//       document.removeEventListener(
//         "mousedown",
//         handleClickOutside
//       );
//     };
//   }, [openMenuId]);

//   // =========================
//   // SEARCH
//   // =========================

//   const filteredEmployees =
//     useMemo(() => {
//       return employees.filter(
//         (emp) =>
//           emp.name
//             ?.toLowerCase()
//             .includes(
//               searchTerm.toLowerCase()
//             ) ||
//           emp.email
//             ?.toLowerCase()
//             .includes(
//               searchTerm.toLowerCase()
//             )
//       );
//     }, [employees, searchTerm]);

//   // =========================
//   // DELETE
//   // =========================

//   const handleDelete = async (id) => {
//     const confirmed =
//       window.confirm(
//         "Are you sure you want to delete this employee?"
//       );

//     if (!confirmed) return;

//     try {
//       await apiClient.delete(
//         `/api/employees/${id}`
//       );

//       fetchEmployees();

//       toast.success(
//         "Employee deleted successfully!"
//       );

//       setOpenMenuId(null);
//     } catch (error) {
//       console.error(error);

//       toast.error(
//         error.response?.data?.message ||
//           "Failed to delete employee"
//       );
//     }
//   };

//   // =========================
//   // MENU
//   // =========================

//   const toggleMenu = (id) => {
//     setOpenMenuId((prev) =>
//       prev === id ? null : id
//     );
//   };

//   return (

//         <div className="min-h-screen bg-gray-100 p-8">

//       {/* ================= HEADER ================= */}

//       <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">

//         <div className="flex items-center gap-4">

//           {/* <button
//             onClick={() => navigate("/dashboard")}
//             className="p-3 rounded-xl bg-white shadow hover:bg-gray-50 transition"
//           >
//             <FiArrowLeft size={20} />
//           </button> */}

//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">
//               Manage Employees
//             </h1>

//             <p className="text-gray-500 mt-1">
//               Manage your employees, roles and department information.
//             </p>
//           </div>

//         </div>

//         <div className="flex items-center gap-3">

//           {/* Grid / List Toggle */}

//           <div className="flex rounded-xl border border-gray-300 bg-white overflow-hidden">

//             <button
//               onClick={() => setViewMode("grid")}
//               className={`px-4 py-3 flex items-center gap-2 transition ${
//                 viewMode === "grid"
//                   ? "bg-[#25D366] font-semibold text-black"
//                   : "hover:bg-gray-100 text-gray-600"
//               }`}
//             >
//               <LayoutGrid size={18} />
//               Grid
//             </button>

//             <button
//               onClick={() => setViewMode("list")}
//               className={`px-4 py-3 flex items-center gap-2 transition ${
//                 viewMode === "list"
//                   ? "bg-[#25D366] font-semibold text-black"
//                   : "hover:bg-gray-100 text-gray-600"
//               }`}
//             >
//               <List size={18} />
//               List
//             </button>

//           </div>

//           <button
//             onClick={() => navigate("/employees/add")}
//             className="flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-black font-semibold px-5 py-3 rounded-xl shadow transition"
//           >
//             <FiUserPlus />
//             Add Employee
//           </button>

//         </div>

//       </div>

//       {/* ================= SEARCH ================= */}

//       <div className="relative mb-8">

//         <FiSearch className="absolute left-4 top-3.5 text-gray-400 text-lg" />

//         <input
//           type="text"
//           placeholder="Search employee by name or email..."
//           value={searchTerm}
//           onChange={(e) =>
//             setSearchTerm(e.target.value)
//           }
//           className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#25D366]"
//         />

//       </div>

//       {/* ================= CONTENT ================= */}

//       {loading ? (
//         <div className="bg-white rounded-2xl p-16 text-center shadow-sm">
//           <p className="text-gray-500 text-lg">
//             Loading employees...
//           </p>
//         </div>
//       ) : filteredEmployees.length === 0 ? (
//         <div className="bg-white rounded-2xl p-16 text-center shadow-sm">

//           <h3 className="text-xl font-semibold text-gray-700">
//             No Employees Found
//           </h3>

//           <p className="text-gray-500 mt-2">
//             Try changing your search keyword.
//           </p>

//         </div>
//       ) : viewMode === "grid" ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

//           {filteredEmployees.map((emp) => (
//             <div
//               key={emp.id}
//               className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
//             >
//               {/* Header */}
//               <div className="bg-gradient-to-r from-[#25D366] to-[#128C7E] p-6 flex justify-between items-start">
//                 <div className="flex items-center gap-4">
//                   <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center text-2xl font-bold">
//                     {emp.name?.charAt(0).toUpperCase()}
//                   </div>

//                   <div>
//                     <h2 className="text-lg font-bold text-black">
//                       {emp.name}
//                     </h2>

//                     <p className="text-gray-800 text-sm">
//                       {emp.designation || "Employee"}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Three Dot Menu */}
//                 <div className="relative">
//                   <button
//                     onClick={() => toggleMenu(emp.id)}
//                     className="p-2 rounded-lg hover:bg-white/40 transition"
//                   >
//                     <FiMoreVertical size={20} />
//                   </button>

//                   {openMenuId === emp.id && (
//                     <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
//                       <button
//                         onClick={() => {
//                           setOpenMenuId(null);
//                           navigate(`/employees/${emp.id}`);
//                         }}
//                         className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 transition"
//                       >
//                         <FiEye className="text-blue-500" />
//                         View
//                       </button>

//                       <button
//                         onClick={() => {
//                           setOpenMenuId(null);
//                           navigate(`/employees/edit/${emp.id}`);
//                         }}
//                         className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 transition"
//                       >
//                         <FiEdit2 className="text-[#25D366]" />
//                         Edit
//                       </button>

//                       <button
//                         onClick={() => {
//                           setOpenMenuId(null);
//                           handleDelete(emp.id);
//                         }}
//                         className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition"
//                       >
//                         <FiTrash2 />
//                         Delete
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Body */}
//               <div className="p-6 space-y-4">
//                 <div className="flex items-center gap-3 text-gray-700">
//                   <FiMail className="text-[#25D366]" />

//                   <span className="text-sm break-all">
//                     {emp.email}
//                   </span>
//                 </div>

//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-500 text-sm">
//                     Department
//                   </span>

//                   <span className="font-semibold text-gray-800">
//                     {emp.department || "-"}
//                   </span>
//                 </div>

//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-500 text-sm">
//                     Role
//                   </span>

//                   <span
//                     className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                       emp.role === "ADMIN"
//                         ? "bg-red-100 text-red-600"
//                         : "bg-green-100 text-[#128C7E]"
//                     }`}
//                   >
//                     {emp.role}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <EmployeeTable
//           employees={filteredEmployees}
//           handleDelete={handleDelete}
//         />
//       )}
//     </div>
//   );
// };

// export default ManageEmployees;

import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  FiUserPlus,
  FiSearch,
} from "react-icons/fi";

import apiClient from "../api/apiClient";
import useEmployeeStore from "../store/employeeStore";

import EmployeeTable from "../components/employee/EmployeeTable";
import EmployeeStats from "../components/employee/EmployeeStats";
import EmployeeFilters from "../components/employee/EmployeeFilters";

import toast from "react-hot-toast";
import Pagination from "../components/common/Pagination";

const ManageEmployees = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const [currentPage, setCurrentPage] =
    useState(1);

  const itemsPerPage = 10;

  const {
    employees,
    loading,
    fetchEmployees,
  } = useEmployeeStore();

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // =========================
  // SEARCH + FILTER
  // =========================

  const filteredEmployees =
    useMemo(() => {
      return employees.filter((emp) => {
        const matchesSearch =
          emp.name
            ?.toLowerCase()
            .includes(
              searchTerm.toLowerCase()
            ) ||
          emp.email
            ?.toLowerCase()
            .includes(
              searchTerm.toLowerCase()
            );

        const matchesStatus =
          statusFilter === "ALL"
            ? true
            : statusFilter === "ACTIVE"
            ? emp.status === "ACTIVE"
            : statusFilter === "INACTIVE"
            ? emp.status === "INACTIVE"
            : emp.role === "ADMIN";

        return (
          matchesSearch &&
          matchesStatus
        );
      });
    }, [
      employees,
      searchTerm,
      statusFilter,
    ]);

    // =========================
    // PAGINATION
    // =========================

    const totalPages = Math.ceil(
      filteredEmployees.length / itemsPerPage
    );

    const startIndex =
      (currentPage - 1) * itemsPerPage;

    const paginatedEmployees =
      filteredEmployees.slice(
        startIndex,
        startIndex + itemsPerPage
      );

  // =========================
  // STATISTICS
  // =========================

  const totalEmployees =
    employees.length;

  const activeEmployees =
    employees.filter(
      (emp) =>
        emp.status === "ACTIVE"
    ).length;

  const inactiveEmployees =
    employees.filter(
      (emp) =>
        emp.status === "INACTIVE"
    ).length;

  const adminEmployees =
    employees.filter(
      (emp) =>
        emp.role === "ADMIN"
    ).length;

  // =========================
  // DELETE
  // =========================


const handleDelete = async (id) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this employee?"
  );

  if (!confirmed) return;

  try {
    await apiClient.delete(`/api/employees/${id}`);

    fetchEmployees();

    toast.success("Employee deleted successfully!");
  } catch (error) {
    console.error(error);

    toast.error(
      error.response?.data?.message ||
        "Failed to delete employee"
    );
  }
};

    return (
    <div className="crm-page space-y-6">

      {/* ================= HEADER ================= */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div className="min-w-0">
          <h1 className="crm-title">
            Manage Employees
          </h1>

          <p className="crm-subtitle">
            Manage your employees, roles and department information.
          </p>
        </div>

        <button
          onClick={() => navigate("/employees/add")}
          className="crm-primary-button w-full sm:w-auto"
        >
          <FiUserPlus />
          Add Employee
        </button>

      </div>

      {/* ================= STATS ================= */}

      <EmployeeStats
        totalEmployees={totalEmployees}
        activeEmployees={activeEmployees}
        inactiveEmployees={inactiveEmployees}
        adminEmployees={adminEmployees}
      />


      {/* ================= SEARCH + FILTERS ================= */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Search */}
        <div className="relative w-full lg:max-w-md">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />

          <input
            type="text"
            placeholder="Search employee by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="crm-input pl-11"
          />
        </div>

        {/* Filter Chips */}
        <EmployeeFilters
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
      </div>

      {/* ================= CONTENT ================= */}

          {loading ? (
  <div className="crm-page-surface p-8 text-center sm:p-16">
    <p className="text-gray-500 text-lg">
      Loading employees...
    </p>
  </div>
) : filteredEmployees.length === 0 ? (
  <div className="crm-page-surface p-8 text-center sm:p-16">
    <h3 className="text-xl font-semibold text-gray-700">
      No Employees Found
    </h3>

    <p className="text-gray-500 mt-2">
      Try changing your search or filter.
    </p>
  </div>
) : (
  <>
    <EmployeeTable
      employees={paginatedEmployees}
      handleDelete={handleDelete}
    />

    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      totalItems={filteredEmployees.length}
      itemsPerPage={itemsPerPage}
      onPageChange={setCurrentPage}
    />
  </>
)}
    </div>
  );
};

export default ManageEmployees;
