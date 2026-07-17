// import GlobalSearch from "./GlobalSearch";
// import NotificationButton from "./NotificationButton";
// import ProfileMenu from "./ProfileMenu";

// function TopHeader() {
//   return (
//     <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-gray-200 bg-white px-8 shadow-sm">
//       <div className="flex flex-1 items-center">
//         <GlobalSearch />
//       </div>

//       <div className="ml-8 flex items-center gap-6">
//         <NotificationButton />

//         <div className="h-10 w-px bg-gray-300"></div>

//         <ProfileMenu />
//       </div>
//     </header>
//   );
// }

// export default TopHeader;

// import NotificationButton from "./NotificationButton";
// import ProfileMenu from "./ProfileMenu";

// function TopHeader() {
//   return (
//     <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8">
//       <h1 className="text-2xl font-bold">Top Header Working</h1>

//       <div className="flex items-center gap-6">
//         <NotificationButton />
//         <ProfileMenu />
//       </div>
//     </header>
//   );
// }

// export default TopHeader;

import GlobalSearch from "./GlobalSearch";
import NotificationButton from "./NotificationButton";
import ProfileMenu from "./ProfileMenu";
import { Menu } from "lucide-react";

function TopHeader({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between gap-3 border-b border-gray-200 bg-white px-4 py-3 shadow-sm sm:px-6 lg:h-20 lg:px-8">
      {/* Left */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 text-gray-700 transition hover:bg-[#DCF8C6] lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>

        <GlobalSearch />
      </div>

      {/* Right */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-4 lg:ml-8 lg:gap-6">
        <NotificationButton />

        <div className="hidden h-10 w-px bg-gray-300 sm:block"></div>

        <ProfileMenu />
      </div>
    </header>
  );
}

export default TopHeader;
