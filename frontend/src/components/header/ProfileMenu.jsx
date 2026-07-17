import { FaChevronDown, FaUserCircle } from "react-icons/fa";
import { useAuthStore } from "../../store/authStore";

function ProfileMenu() {
  const { user } = useAuthStore();

  return (
    <button className="flex min-w-0 items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-gray-100 sm:px-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#25D366] sm:h-11 sm:w-11">
        <FaUserCircle size={28} className="text-white" />
      </div>

      <div className="hidden min-w-0 text-left sm:block">
        <p className="truncate text-sm font-semibold text-gray-800">
          {user?.name || "User"}
        </p>

        <p className="text-xs text-gray-500">
          {user?.role || "Employee"}
        </p>
      </div>

      {/* <FaChevronDown size={12} className="text-gray-500" /> */}
    </button>
  );
}

export default ProfileMenu;
