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

export default function Sidebar() {
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
    `group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-[15px]
    ${
      isActive
        ? "bg-yellow-400 text-black font-semibold shadow-lg shadow-yellow-500/20"
        : "text-gray-300 hover:bg-gray-900 hover:text-white hover:translate-x-1"
    }`;

      return (
    <aside className="w-72 h-screen bg-gradient-to-b from-gray-950 to-black text-white border-r border-gray-800 fixed flex flex-col p-5">
      {/* BRAND */}
      <div className="pb-5 border-b border-gray-800">
        <h1 className="text-2xl font-bold tracking-wide">
          WhatsApp <span className="text-yellow-400">CRM</span>
        </h1>

        <p className="text-xs text-gray-500 mt-1">
          Business Messaging Platform
        </p>
      </div>

      {/* NAVIGATION */}
      <div className="flex-1 mt-5 overflow-y-auto pr-1">
        <div className="space-y-3">
          {sections.map((section) => (
            <div
              key={section.id}
              className="border border-gray-800 rounded-xl bg-black/20 overflow-hidden"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-900 transition-colors duration-300"
              >
                <span className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-semibold">
                  {section.title}
                </span>

                <FaChevronRight
                  className={`text-gray-500 transition-transform duration-300 ${
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
                    {section.items.map((item) => {
                      const Icon = item.icon;

                      return (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          className={linkClass}
                        >
                          <Icon className="transition-transform duration-200 group-hover:scale-110" />
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
      <div className="border-t border-gray-800 pt-4">
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
          className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 hover:scale-[1.02] active:scale-[0.98] text-white py-3 rounded-xl text-[15px] font-medium transition-all duration-200"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </aside>
  );
}
