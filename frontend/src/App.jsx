// import React, { useEffect } from "react";
// import {
//   BrowserRouter,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";

// import { useAuthStore } from "./store/authStore";
// import { connectSocket, disconnectSocket } from "./api/socket";

// import AppLayout from "./layouts/AppLayout";


// import Login from "./pages/Login";
// import Dashboard from "./pages/Dashboard";
// import ManageEmployees from "./pages/ManageEmployees";
// import Customers from "./pages/Customers";
// import Leads from "./pages/Leads";
// import Campaigns from "./pages/Campaigns";
// import TicketsPage from "./pages/TicketsPage";
// import Conversations from "./pages/Conversations";
// import Tasks from "./pages/Task";
// //import Products from "./pages/Products";
// //import DealsPage from "./pages/DealsPage";
// import Settings from "./pages/settings/Settings";
// import CustomerProfile from "./pages/CustomerProfile";
// import CampaignDetails from "./pages/CampaignDetails";
// import Templates from "./pages/Templates";


// import AddCustomer from "./pages/AddCustomer";
// import EditCustomer from "./pages/EditCustomer";

// import ViewEmployee from "./pages/ViewEmployee";

// import ProtectedRoute from "./components/ProtectedRoute";
// import AdminRoute from "./components/AdminRoute";

// import ForgotPassword from "./pages/ForgotPassword";
// import ResetPassword from "./pages/ResetPassword";
// import ChangePassword from "./pages/settings/ChangePassword";


// // Layout Wrapper
// // function Layout() {
// //   return (
// //     <div className="flex">
// //       <Sidebar />

// //       <div className="ml-64 w-full min-h-screen bg-gray-100">
// //         <Outlet />
// //       </div>
// //     </div>
// //   );
// // }

// function App() {
//   const { isAuthenticated } = useAuthStore();

//   // Connects once on login (or on page load if a token already exists),
//   // and cleanly disconnects on logout so a stale socket doesn't linger.
//   useEffect(() => {
//     if (isAuthenticated) {
//       connectSocket();
//     } else {
//       disconnectSocket();
//     }
//   }, [isAuthenticated]);

//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* LOGIN */}
//         <Route
//           path="/login"
//           element={
//             !isAuthenticated ? (
//               <Login />
//             ) : (
//               <Navigate to="/dashboard" replace />
//             )
//           }
//         />

//           <Route
//             path="/forgot-password"
//             element={<ForgotPassword />}
//           />

//           <Route
//             path="/reset-password/:token"
//             element={<ResetPassword />}
//           />

//         {/* PROTECTED ROUTES */}
//         <Route element={<ProtectedRoute />}>
//           {/* LAYOUT */}
//           <Route element={<AppLayout />}>
//             {/* Dashboard */}
//             <Route path="/dashboard" element={<Dashboard />} />

//             {/* CRM */}
//             <Route
//               path="/conversations"
//               element={<Conversations />}
//             />

//             <Route path="/customers" element={<Customers />} />

//             <Route
//               path="/customers/add"
//               element={<AddCustomer />}
//             />

//             <Route
//               path="/customers/edit/:id"
//               element={<EditCustomer />}
//             />

//             <Route
//               path="/customers/:id"
//               element={<CustomerProfile />}
//             />

//             <Route
//               path="/campaigns/:id"
//               element={<CampaignDetails />}
//             />

//             {/* <Route path="/deals" element={<DealsPage />} /> */}

//             {/* <Route path="/products" element={<Products />} /> */}

//             <Route path="/leads" element={<Leads />} />

//             <Route path="/campaigns" element={<Campaigns />} />

//             <Route path="/templates" element={<Templates />} />

//             <Route path="/tasks" element={<Tasks />} />

//             <Route path="/tickets" element={<TicketsPage />} />

//             <Route path="/settings" element={<Settings />} />

//              <Route
//             path="/change-password"
//             element={<ChangePassword />}
//           />

//             {/* ADMIN ROUTES */}
//             <Route element={<AdminRoute />}>
//               <Route
//                 path="/employees"
//                 element={<ManageEmployees />}
//               />

//               <Route path="/employees/:id" element={<ViewEmployee />} />
            
//             </Route>
//           </Route>
//         </Route>

//         {/* ROOT */}
//         <Route
//           path="/"
//           element={<Navigate to="/dashboard" replace />}
//         />

//         {/* FALLBACK */}
//         <Route
//           path="*"
//           element={<Navigate to="/dashboard" replace />}
//         />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;

import React, { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { useAuthStore } from "./store/authStore";
import { connectSocket, disconnectSocket } from "./api/socket";

import AppLayout from "./layouts/AppLayout";


import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ManageEmployees from "./pages/ManageEmployees";
import AuditLogs from "./pages/AuditLogs";
import Customers from "./pages/Customers";
import Leads from "./pages/Leads";
import Campaigns from "./pages/Campaigns";
import TicketsPage from "./pages/TicketsPage";
import Conversations from "./pages/Conversations";
import Tasks from "./pages/Task";
//import Products from "./pages/Products";
//import DealsPage from "./pages/DealsPage";
import Settings from "./pages/settings/Settings";
import CustomerProfile from "./pages/CustomerProfile";
import CampaignDetails from "./pages/CampaignDetails";
import Templates from "./pages/Templates";


import AddCustomer from "./pages/AddCustomer";
import EditCustomer from "./pages/EditCustomer";

import ViewEmployee from "./pages/ViewEmployee";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ChangePassword from "./pages/settings/ChangePassword";


// Layout Wrapper
// function Layout() {
//   return (
//     <div className="flex">
//       <Sidebar />

//       <div className="ml-64 w-full min-h-screen bg-gray-100">
//         <Outlet />
//       </div>
//     </div>
//   );
// }

function App() {
  const { isAuthenticated } = useAuthStore();

  // Connects once on login (or on page load if a token already exists),
  // and cleanly disconnects on logout so a stale socket doesn't linger.
  useEffect(() => {
    if (isAuthenticated) {
      connectSocket();
    } else {
      disconnectSocket();
    }
  }, [isAuthenticated]);

  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN */}
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <Login />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />

          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />

          <Route
            path="/reset-password/:token"
            element={<ResetPassword />}
          />

        {/* PROTECTED ROUTES */}
        <Route element={<ProtectedRoute />}>
          {/* LAYOUT */}
          <Route element={<AppLayout />}>
            {/* Dashboard */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* CRM */}
            <Route
              path="/conversations"
              element={<Conversations />}
            />

            <Route path="/customers" element={<Customers />} />

            <Route
              path="/customers/add"
              element={<AddCustomer />}
            />

            <Route
              path="/customers/edit/:id"
              element={<EditCustomer />}
            />

            <Route
              path="/customers/:id"
              element={<CustomerProfile />}
            />

            <Route
              path="/campaigns/:id"
              element={<CampaignDetails />}
            />

            {/* <Route path="/deals" element={<DealsPage />} /> */}

            {/* <Route path="/products" element={<Products />} /> */}

            <Route path="/leads" element={<Leads />} />

            <Route path="/campaigns" element={<Campaigns />} />

            <Route path="/templates" element={<Templates />} />

            <Route path="/tasks" element={<Tasks />} />

            <Route path="/tickets" element={<TicketsPage />} />

            <Route path="/settings" element={<Settings />} />

             <Route
            path="/change-password"
            element={<ChangePassword />}
          />

            {/* ADMIN ROUTES */}
            <Route element={<AdminRoute />}>
              <Route
                path="/employees"
                element={<ManageEmployees />}
              />

              <Route path="/employees/:id" element={<ViewEmployee />} />

              <Route path="/audit-logs" element={<AuditLogs />} />
            
            </Route>
          </Route>
        </Route>

        {/* ROOT */}
        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />

        {/* FALLBACK */}
        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;