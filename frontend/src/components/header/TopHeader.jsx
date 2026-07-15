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

function TopHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-gray-200 bg-white px-8 shadow-sm">
      {/* Left */}
      <div className="flex flex-1 items-center">
        <GlobalSearch />
      </div>

      {/* Right */}
      <div className="ml-8 flex items-center gap-6">
        <NotificationButton />

        <div className="h-10 w-px bg-gray-300"></div>

        <ProfileMenu />
      </div>
    </header>
  );
}

export default TopHeader;