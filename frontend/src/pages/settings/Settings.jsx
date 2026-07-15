// import { Link } from "react-router-dom";
// import { useAuthStore } from "../../store/authStore";

// function Settings() {
//   const { user } = useAuthStore();

//   return (
//     <div className="min-h-screen bg-gray-50 p-8 space-y-8">
//       {/* Page Header */}
//       <div>
//         <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
//         <p className="mt-2 text-gray-500">
//           Manage your account settings and security.
//         </p>
//       </div>

//       {/* Profile Information */}
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-xl font-semibold text-gray-900">
//             Profile Information
//           </h2>

//           <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center text-lg font-bold text-black">
//             {user?.name?.charAt(0).toUpperCase() || "U"}
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//           <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
//             <p className="text-sm text-gray-500">Name</p>
//             <p className="mt-1 font-semibold text-gray-900">
//               {user?.name || "-"}
//             </p>
//           </div>

//           <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
//             <p className="text-sm text-gray-500">Email</p>
//             <p className="mt-1 font-semibold text-gray-900 break-all">
//               {user?.email || "-"}
//             </p>
//           </div>

//           <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
//             <p className="text-sm text-gray-500">Department</p>
//             <p className="mt-1 font-semibold text-gray-900">
//               {user?.department || "-"}
//             </p>
//           </div>

//           <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
//             <p className="text-sm text-gray-500">Role</p>
//             <p className="mt-1 font-semibold text-gray-900">
//               {user?.role || "-"}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Security */}
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//         <div>
//           <h2 className="text-xl font-semibold text-gray-900">
//             Security
//           </h2>

//           <p className="mt-1 text-sm text-gray-500">
//             Update your account password to keep your account secure.
//           </p>
//         </div>

//         <Link
//           to="/change-password"
//           className="inline-flex items-center justify-center bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-3 rounded-xl transition"
//         >
//           Change Password
//         </Link>
//       </div>
//     </div>
//   );
// }

// export default Settings;

import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import {
  User,
  Mail,
  Building2,
  ShieldCheck,
  Lock,
} from "lucide-react";

function Settings() {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-slate-100 p-6">

      {/* ================= HEADER ================= */}

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900">
          Settings
        </h1>

        <p className="mt-2 text-gray-500">
          Manage your profile information and account security.
        </p>
      </div>

      {/* ================= PROFILE CARD ================= */}

      <div className="rounded-3xl bg-white border border-gray-200 shadow-sm overflow-hidden">

        {/* Yellow Header */}

        <div className="bg-yellow-400 px-8 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">

          <div className="flex items-center gap-5">

            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-black text-3xl font-bold shadow">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>

            <div>

              <h2 className="text-2xl font-bold text-black">
                {user?.name || "User"}
              </h2>

              <p className="text-gray-800">
                {user?.email}
              </p>

            </div>

          </div>

          <div className="bg-white rounded-xl px-5 py-3 shadow">
            <p className="text-xs text-gray-500">
              Role
            </p>

            <p className="font-bold text-black">
              {user?.role || "-"}
            </p>
          </div>

        </div>

        {/* Details */}

        <div className="p-8">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Name */}

            <div className="rounded-2xl border border-gray-200 p-5 hover:border-yellow-400 transition">

              <div className="flex items-center gap-3 mb-2">
                <User
                  className="text-yellow-500"
                  size={20}
                />

                <span className="text-sm text-gray-500">
                  Full Name
                </span>
              </div>

              <p className="text-lg font-semibold text-slate-800">
                {user?.name || "-"}
              </p>

            </div>

            {/* Email */}

            <div className="rounded-2xl border border-gray-200 p-5 hover:border-yellow-400 transition">

              <div className="flex items-center gap-3 mb-2">
                <Mail
                  className="text-yellow-500"
                  size={20}
                />

                <span className="text-sm text-gray-500">
                  Email Address
                </span>
              </div>

              <p className="text-lg font-semibold text-slate-800 break-all">
                {user?.email || "-"}
              </p>

            </div>

            {/* Department */}

            <div className="rounded-2xl border border-gray-200 p-5 hover:border-yellow-400 transition">

              <div className="flex items-center gap-3 mb-2">
                <Building2
                  className="text-yellow-500"
                  size={20}
                />

                <span className="text-sm text-gray-500">
                  Department
                </span>
              </div>

              <p className="text-lg font-semibold text-slate-800">
                {user?.department || "-"}
              </p>

            </div>

            {/* Role */}

            <div className="rounded-2xl border border-gray-200 p-5 hover:border-yellow-400 transition">

              <div className="flex items-center gap-3 mb-2">
                <ShieldCheck
                  className="text-yellow-500"
                  size={20}
                />

                <span className="text-sm text-gray-500">
                  User Role
                </span>
              </div>

              <span className="inline-flex rounded-full bg-yellow-100 text-yellow-700 px-4 py-2 text-sm font-semibold">
                {user?.role || "-"}
              </span>

            </div>

          </div>

        </div>

      </div>

      {/* ================= SECURITY ================= */}

      <div className="mt-8 rounded-3xl bg-white border border-gray-200 shadow-sm p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

        <div className="flex items-start gap-4">

          <div className="w-14 h-14 rounded-2xl bg-yellow-100 flex items-center justify-center">
            <Lock
              className="text-yellow-600"
              size={26}
            />
          </div>

          <div>

            <h2 className="text-2xl font-bold text-slate-900">
              Security
            </h2>

            <p className="text-gray-500 mt-2 max-w-lg">
              Keep your account secure by updating your password regularly.
            </p>

          </div>

        </div>

        <Link
          to="/change-password"
          className="inline-flex items-center justify-center rounded-xl bg-yellow-400 px-7 py-3 font-semibold text-black hover:bg-yellow-500 transition"
        >
          Change Password
        </Link>

      </div>

    </div>
  );
}

export default Settings;