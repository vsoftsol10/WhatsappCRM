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
    `group flex h-12 items-center gap-3 rounded-xl px-4 text-[15px] transition-all duration-200 ease-out hover:scale-[1.02]
    ${
      isActive
        ? "bg-[#075E54] text-white font-semibold shadow-md shadow-black/20 scale-[1.01]"
        : "bg-transparent text-white hover:bg-[#0A6E63] hover:text-white"
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
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-72 max-w-[85vw] flex-col border-r border-white/10 bg-gradient-to-b from-[#0F172A] to-[#075E54] p-6 text-white shadow-2xl shadow-black/20 transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
      {/* BRAND */}
      <div className="border-b border-white/10 pb-6">
        <h1 className="text-2xl font-bold tracking-wide">
          <span className="text-white">WhatsApp</span>{" "}
          <span className="text-[#25D366]">CRM</span>
        </h1>

        <p className="mt-1 text-xs text-slate-400">
          Business Messaging Platform
        </p>
      </div>

      {/* NAVIGATION */}
      <div className="mt-6 flex-1 overflow-y-auto pr-1">
        <div className="space-y-6">
          {sections.map((section) => (
            <div
              key={section.id}
              className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="flex w-full items-center justify-between px-4 py-3 transition-all duration-200 ease-out hover:bg-white/5"
              >
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                  {section.title}
                </span>

                <FaChevronRight
                  className={`text-xs text-slate-400 transition-transform duration-300 ${
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
                  <div className="flex flex-col gap-2 px-2 pb-2">
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
                            <Icon className="text-white transition-transform duration-200 group-hover:scale-110" />
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
      <div className="border-t border-white/10 pt-4">
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
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#DC2626] py-3 text-[15px] font-medium text-white transition-all duration-200 ease-out hover:scale-[1.02] hover:bg-[#B91C1C] active:scale-[0.98]"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
      </aside>
    </>
  );
}
