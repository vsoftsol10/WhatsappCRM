import { FaBell } from "react-icons/fa";

function NotificationButton() {
  return (
    <button className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white transition hover:border-yellow-400 hover:bg-yellow-50">
      <FaBell size={18} className="text-gray-700" />

      <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
        3
      </span>
    </button>
  );
}

export default NotificationButton;