// import { Outlet } from "react-router-dom";
// import Sidebar from "../components/Sidebar";

// function AppLayout() {
//   return (
//     <div className="flex">
//       <Sidebar />

//       <div className="ml-72 flex-1 p-6">
//         <h1 className="text-2xl font-bold">Sidebar Working</h1>

//         <Outlet />
//       </div>
//     </div>
//   );
// }

// export default AppLayout;

import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopHeader from "../components/header/TopHeader";

function AppLayout() {
  return (
    <div className="h-screen bg-gray-100">
      <Sidebar />

      <div className="ml-72 flex h-screen flex-col">
        <TopHeader />

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;