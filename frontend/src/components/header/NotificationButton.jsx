// import { FaBell } from "react-icons/fa";

// function NotificationButton() {
//   return (
//     <button className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white transition hover:border-[#25D366] hover:bg-[#DCF8C6]">
//       <FaBell size={18} className="text-gray-700" />

//       <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
//         3
//       </span>
//     </button>
//   );
// }

// export default NotificationButton;

import { useEffect, useMemo, useRef, useState } from "react";
import { FaBell } from "react-icons/fa";

import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../../api/notificationApi";

import NotificationDropdown from "./NotificationDropdown";

function NotificationButton() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const wrapperRef = useRef(null);

  // ================= FETCH NOTIFICATIONS =================
  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const response = await getNotifications();

      setNotifications(response.data || []);
    } catch (error) {
      console.error("Fetch Notifications Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ================= INITIAL LOAD =================
  useEffect(() => {
    fetchNotifications();
  }, []);

  // ================= CLOSE DROPDOWN ON OUTSIDE CLICK =================
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // ================= UNREAD COUNT =================
  const unreadCount = useMemo(() => {
    return notifications.filter(
      (notification) => !notification.isRead
    ).length;
  }, [notifications]);

  // ================= TOGGLE DROPDOWN =================
  const handleToggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  // ================= MARK SINGLE AS READ =================
  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? {
                ...notification,
                isRead: true,
              }
            : notification
        )
      );
    } catch (error) {
      console.error("Mark Notification Error:", error);
    }
  };

  // ================= MARK ALL AS READ =================
  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );
    } catch (error) {
      console.error("Mark All Notifications Error:", error);
    }
  };

  // ================= DELETE NOTIFICATION =================
  const handleDeleteNotification = async (id) => {
    try {
      await deleteNotification(id);

      setNotifications((prev) =>
        prev.filter(
          (notification) => notification.id !== id
        )
      );
    } catch (error) {
      console.error("Delete Notification Error:", error);
    }
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        onClick={handleToggleDropdown}
        className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white transition hover:border-[#25D366] hover:bg-[#DCF8C6]"
      >
        <FaBell size={18} className="text-gray-700" />

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <NotificationDropdown
          loading={loading}
          notifications={notifications}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
          onDelete={handleDeleteNotification}
        />
      )}
    </div>
  );
}

export default NotificationButton;