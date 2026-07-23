import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

import {
  FaTachometerAlt,
  FaComments,
  FaUsers,
  FaHandHoldingUsd,
  FaBox,
  FaTasks,
  FaUserTie,
  FaCog,
  FaSignOutAlt,
  FaUserPlus,
  FaTicketAlt,
  FaBullhorn,
  FaFileAlt,
  FaChevronRight,
} from "react-icons/fa";

const sections = [
  {
    id: "main",
    title: "Main",
    items: [
      {
        name: "Dashboard",
        icon: FaTachometerAlt,
        path: "/dashboard",
      },
      {
        name: "Conversations",
        icon: FaComments,
        path: "/conversations",
      },
    ],
  },

  {
    id: "crm",
    title: "CRM",
    items: [
      {
        name: "Customers",
        icon: FaUsers,
        path: "/customers",
      },
      {
        name: "Leads",
        icon: FaUserPlus,
        path: "/leads",
      },
      {
        name: "Campaigns",
        icon: FaBullhorn,
        path: "/campaigns",
      },
      {
        name: "Templates",
        icon: FaFileAlt,
        path: "/templates",
      },
    ],
  },

  {
    id: "management",
    title: "Management",
    items: [
      {
        name: "Employees",
        icon: FaUserTie,
        path: "/employees",
      },
      {
        name: "Tickets",
        icon: FaTicketAlt,
        path: "/tickets",
      },
      // {
      //   name: "Deals",
      //   icon: FaHandHoldingUsd,
      //   path: "/deals",
      // },
    ],
  },

  {
    id: "productivity",
    title: "Productivity",
    items: [
      {
        name: "Tasks",
        icon: FaTasks,
        path: "/tasks",
      },
    ],
  },

  {
    id: "system",
    title: "System",
    items: [
      {
        name: "Settings",
        icon: FaCog,
        path: "/settings",
      },
    ],
  },
];

export default function Sidebar({
  isOpen = false,
  onClose = () => {},
}) {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const location = useLocation();

  const [openSection, setOpenSection] = useState("main");

  useEffect(() => {
    const active = sections.find((section) =>
      section.items.some((item) => item.path === location.pathname)
    );

    if (active) {
      setOpenSection(active.id);
    }
  }, [location.pathname]);

  const toggleSection = (id) => {
    setOpenSection((prev) => (prev === id ? "" : id));
  };

  const linkClass = ({ isActive }) =>
    `group flex h-11 items-center gap-3 rounded-lg px-3 text-[15px] transition-all duration-200 ease-out hover:scale-[1.02]
    ${
      isActive
        ? "scale-[1.01] bg-[#00C86B] text-white font-semibold shadow-md shadow-[#00C86B]/20"
        : "bg-transparent text-slate-100 hover:bg-[#0A6E63] hover:text-white"
    }`;

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-72 max-w-[85vw] flex-col border-r border-white/10 bg-gradient-to-b from-[#061113] via-[#071114] to-[#02090B] p-5 text-white shadow-xl shadow-black/20 transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
      {/* BRAND */}
      <div className="border-b border-white/10 pb-5">
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#25D366] text-sm text-white">
            <FaComments />
          </span>
          <span className="text-white">WhatsApp</span>
          <span className="text-[#25D366]">CRM</span>
        </h1>

        <p className="mt-1.5 text-sm text-slate-400">
          Business Messaging Platform
        </p>
      </div>

      {/* NAVIGATION */}
      <div className="mt-6 flex-1 pr-1">
        <div className="space-y-5">
          {sections.map((section) => (
            <div
              key={section.id}
              className="border-b border-white/10 pb-4 last:border-b-0"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="mb-2 flex w-full items-center justify-between px-1 py-1 transition-all duration-200 ease-out"
              >
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#25D366]">
                  {section.title}
                </span>

                <FaChevronRight
                  className={`text-[10px] text-slate-600 transition-transform duration-300 ${
                    openSection === section.id ? "rotate-90" : ""
                  }`}
                />
              </button>

              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  openSection === section.id
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="flex flex-col gap-2">
                    {section.items
                      .filter((item) => {
                        // Hide Employees menu for USER role
                        if (
                          item.path === "/employees" &&
                          user?.role !== "ADMIN"
                        ) {
                          return false;
                        }

                        return true;
                      })
                      .map((item) => {
                        const Icon = item.icon;

                        return (
                          <NavLink
                            key={item.path}
                            to={item.path}
                            className={linkClass}
                            onClick={onClose}
                          >
                            <Icon className="text-sm text-white transition-transform duration-200 group-hover:scale-110" />
                            {item.name}
                          </NavLink>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* USER CARD */}
      <div className="border-t border-white/10 pt-7">
        {/* <div className="bg-gray-900 rounded-xl p-3 mb-4">
          <p className="font-semibold text-sm">
            {user?.name || "Admin"}
          </p>

          <p className="text-xs text-gray-400 truncate mt-1">
            {user?.email || "admin@example.com"}
          </p>
        </div> */}

        <button
          onClick={logout}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-transparent py-3 text-[15px] font-semibold text-[#25D366] transition-all duration-200 ease-out hover:scale-[1.02] hover:border-[#B91C1C] hover:bg-[#B91C1C] hover:text-white active:scale-[0.98]"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
      </aside>
    </>
  );
}
