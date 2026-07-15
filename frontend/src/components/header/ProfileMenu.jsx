import { FaChevronDown, FaUserCircle } from "react-icons/fa";
import { useAuthStore } from "../../store/authStore";

function ProfileMenu() {
  const { user } = useAuthStore();

  return (
    <button className="flex items-center gap-3 rounded-xl px-3 py-2 transition hover:bg-gray-100">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-yellow-400">
        <FaUserCircle size={28} className="text-white" />
      </div>

      <div className="text-left">
        <p className="text-sm font-semibold text-gray-800">
          {user?.name || "User"}
        </p>

        <p className="text-xs text-gray-500">
          {user?.role || "Employee"}
        </p>
      </div>

      <FaChevronDown size={12} className="text-gray-500" />
    </button>
  );
}

export default ProfileMenu;