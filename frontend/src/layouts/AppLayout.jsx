// import { Outlet } from "react-router-dom";
// import Sidebar from "../components/Sidebar";
// import TopHeader from "../components/header/TopHeader";

// function AppLayout() {
//   return (
//     <div className="h-screen bg-gray-100">
//       <Sidebar />

//       <div className="ml-72 flex h-screen flex-col">
//         <TopHeader />

//         <main className="flex-1 overflow-y-auto bg-gray-50 px-5 py-6">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// }

// export default AppLayout;

import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopHeader from "../components/header/TopHeader";

function AppLayout() {
  const location = useLocation();

  const fullWidthPages = [
    "/conversations",
    "/tickets",
    "/settings",
  ];

  const isFullWidthPage = fullWidthPages.includes(location.pathname);

  return (
    <div className="h-screen bg-gray-100">
      <Sidebar />

      <div className="ml-72 flex h-screen flex-col">
        <TopHeader />

        <main
          className={`flex-1 overflow-y-auto bg-gray-50 ${
            isFullWidthPage ? "" : "px-5 py-6"
          }`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;