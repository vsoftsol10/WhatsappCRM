// import {
//   FaBell,
//   FaCheck,
//   FaTrash,
// } from "react-icons/fa";

// function NotificationDropdown({
//   loading,
//   notifications,
//   onMarkAsRead,
//   onMarkAllAsRead,
//   onDelete,
// }) {
//   return (
//     <div className="absolute right-0 z-50 mt-3 w-[min(calc(100vw-2rem),24rem)] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
//       {/* Header */}
//       <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-4 py-4 sm:px-5">
//         <div>
//           <h3 className="text-base font-semibold text-gray-800">
//             Notifications
//           </h3>

//           <p className="text-xs text-gray-500">
//             {notifications.length} notification
//             {notifications.length !== 1 ? "s" : ""}
//           </p>
//         </div>

//         {notifications.length > 0 && (
//           <button
//             onClick={onMarkAllAsRead}
//             className="text-xs font-medium text-[#25D366] transition hover:text-[#128C7E]"
//           >
//             Mark all as read
//           </button>
//         )}
//       </div>

//       {/* Loading */}
//       {loading && (
//         <div className="py-10 text-center text-sm text-gray-500">
//           Loading notifications...
//         </div>
//       )}

//       {/* Empty */}
//       {!loading && notifications.length === 0 && (
//         <div className="flex flex-col items-center justify-center gap-3 py-12">
//           <div className="rounded-full bg-gray-100 p-4">
//             <FaBell className="text-2xl text-gray-400" />
//           </div>

//           <div className="text-center">
//             <h4 className="font-semibold text-gray-700">
//               No notifications
//             </h4>

//             <p className="mt-1 text-sm text-gray-500">
//               You're all caught up.
//             </p>
//           </div>
//         </div>
//       )}

//       {/* List */}
//       {!loading && notifications.length > 0 && (
//         <div className="max-h-[420px] overflow-y-auto">
//           {notifications.map((notification) => (
//             <div
//               key={notification.id}
//               className={`border-b border-gray-100 p-4 transition hover:bg-gray-50 ${
//                 !notification.isRead
//                   ? "bg-[#DCF8C6]"
//                   : "bg-white"
//               }`}
//             >
//               <div className="flex items-start justify-between gap-3">
//                 <div className="min-w-0 flex-1">
//                   <h4 className="break-words font-semibold text-gray-800">
//                     {notification.title}
//                   </h4>

//                   <p className="mt-1 break-words text-sm text-gray-600">
//                     {notification.message}
//                   </p>

//                   <p className="mt-2 text-xs text-gray-400">
//                     {new Date(
//                       notification.createdAt
//                     ).toLocaleString()}
//                   </p>
//                 </div>

//                 <div className="flex items-center gap-2">
//                   {!notification.isRead && (
//                     <button
//                       onClick={() =>
//                         onMarkAsRead(notification.id)
//                       }
//                       className="rounded-lg p-2 text-[#128C7E] transition hover:bg-green-100"
//                       title="Mark as read"
//                     >
//                       <FaCheck size={12} />
//                     </button>
//                   )}

//                   <button
//                     onClick={() =>
//                       onDelete(notification.id)
//                     }
//                     className="rounded-lg p-2 text-red-500 transition hover:bg-red-100"
//                     title="Delete"
//                   >
//                     <FaTrash size={12} />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default NotificationDropdown;

import {
  FaBell,
  FaCheck,
  FaTrash,
} from "react-icons/fa";

import {
  NOTIFICATION_FILTERS,
  getNotificationTypeConfig,
} from "./notificationTypeConfig";

function NotificationDropdown({
  loading,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  hasMore,
  loadingMore,
  onLoadMore,
  activeFilter,
  onFilterChange,
}) {
  return (
    <div className="absolute right-0 z-50 mt-3 w-[min(calc(100vw-2rem),24rem)] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-4 py-4 sm:px-5">
        <div>
          <h3 className="text-base font-semibold text-gray-800">
            Notifications
          </h3>

          <p className="text-xs text-gray-500">
            {notifications.length} notification
            {notifications.length !== 1 ? "s" : ""}
          </p>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={onMarkAllAsRead}
            className="text-xs font-medium text-[#25D366] transition hover:text-[#128C7E]"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Filter chips — horizontally scrollable since there are more
          chips (All/Unread + one per NotificationType) than comfortably
          fit in this dropdown's width at once. */}
      <div className="flex gap-2 overflow-x-auto border-b border-gray-100 px-4 py-2.5 sm:px-5">
        {NOTIFICATION_FILTERS.map((f) => {
          const isActive = activeFilter === f.key;

          return (
            <button
              key={f.key}
              onClick={() => onFilterChange(f.key)}
              className={`flex-shrink-0 whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold transition-all ${
                isActive
                  ? "border-[#25D366] bg-[#25D366] text-black"
                  : "border-gray-300 bg-white text-slate-600 hover:border-[#25D366] hover:bg-[#DCF8C6]"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Loading */}
      {loading && (
        <div className="py-10 text-center text-sm text-gray-500">
          Loading notifications...
        </div>
      )}

      {/* Empty */}
      {!loading && notifications.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 py-12">
          <div className="rounded-full bg-gray-100 p-4">
            <FaBell className="text-2xl text-gray-400" />
          </div>

          <div className="text-center">
            <h4 className="font-semibold text-gray-700">
              No notifications
            </h4>

            <p className="mt-1 text-sm text-gray-500">
              {activeFilter === "ALL"
                ? "You're all caught up."
                : "Nothing here for this filter."}
            </p>
          </div>
        </div>
      )}

      {/* List */}
      {!loading && notifications.length > 0 && (
        <div className="max-h-[420px] overflow-y-auto">
          {notifications.map((notification) => {
            const typeConfig = getNotificationTypeConfig(
              notification.type
            );

            const TypeIcon = typeConfig.icon;

            return (
              <div
                key={notification.id}
                className={`border-b border-gray-100 p-4 transition hover:bg-gray-50 ${
                  !notification.isRead
                    ? "bg-[#DCF8C6]"
                    : "bg-white"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 flex-1 gap-3">
                    <div
                      className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${typeConfig.iconBg}`}
                      title={typeConfig.label}
                    >
                      <TypeIcon
                        size={14}
                        className={typeConfig.iconColor}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4 className="break-words font-semibold text-gray-800">
                        {notification.title}
                      </h4>

                      <p className="mt-1 break-words text-sm text-gray-600">
                        {notification.message}
                      </p>

                      <p className="mt-2 text-xs text-gray-400">
                        {new Date(
                          notification.createdAt
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!notification.isRead && (
                      <button
                        onClick={() =>
                          onMarkAsRead(notification.id)
                        }
                        className="rounded-lg p-2 text-[#128C7E] transition hover:bg-green-100"
                        title="Mark as read"
                      >
                        <FaCheck size={12} />
                      </button>
                    )}

                    <button
                      onClick={() =>
                        onDelete(notification.id)
                      }
                      className="rounded-lg p-2 text-red-500 transition hover:bg-red-100"
                      title="Delete"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {hasMore && (
            <div className="p-3 text-center">
              <button
                onClick={onLoadMore}
                disabled={loadingMore}
                className="text-xs font-medium text-[#128C7E] transition hover:text-[#0d6b60] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loadingMore ? "Loading..." : "Load more"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationDropdown;