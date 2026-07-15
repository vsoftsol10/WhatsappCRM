// import { useState } from "react";
// import { useAuthStore } from "../../store/authStore";
// import { FaEye, FaEyeSlash } from "react-icons/fa";

// const ChangePassword = () => {
//   const { changePasswordAction, isLoading } = useAuthStore();
//   const [showCurrentPassword, setShowCurrentPassword] = useState(false);
//   const [showNewPassword, setShowNewPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const [formData, setFormData] = useState({
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   });

//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     setError("");
//     setMessage("");

//     if (formData.newPassword !== formData.confirmPassword) {
//       setError("Passwords do not match");
//       return;
//     }

//     try {
//       const response = await changePasswordAction({
//         currentPassword: formData.currentPassword,
//         newPassword: formData.newPassword,
//       });

//       setMessage(
//         response.message || "Password changed successfully"
//       );

//       setFormData({
//         currentPassword: "",
//         newPassword: "",
//         confirmPassword: "",
//       });
//     } catch (err) {
//       setError(
//         err.response?.data?.message ||
//           "Failed to change password"
//       );
//     }
//   };

//   return (
//     <div className="min-h-screen ml-8.5 bg-black flex items-center justify-center p-6">
//       <div className="w-full max-w-md bg-gray-900 border border-yellow-500 rounded-xl p-8 shadow-lg">
//         <h2 className="text-3xl font-bold text-yellow-400 mb-6 text-center">
//           Change Password
//         </h2>

//         {message && (
//           <div className="bg-green-500/20 border border-green-500 text-green-300 p-3 rounded mb-4">
//             {message}
//           </div>
//         )}

//         {error && (
//           <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded mb-4">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-4">

//           {/* Current Password */}
//           <div className="relative">
//             <input
//               type={showCurrentPassword ? "text" : "password"}
//               name="currentPassword"
//               placeholder="Current Password"
//               value={formData.currentPassword}
//               onChange={handleChange}
//               className="w-full bg-black border border-gray-700 text-white p-3 rounded focus:border-yellow-400 focus:outline-none"
//               required
//             />

//             <button
//               type="button"
//               onClick={() =>
//                 setShowCurrentPassword(!showCurrentPassword)
//               }
//               className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-400"
//             >
//               {showCurrentPassword ? (
//                 <FaEyeSlash size={18} />
//               ) : (
//                 <FaEye size={18} />
//               )}
//             </button>
//           </div>

//           {/* New Password */}
//           <div className="relative">
//             <input
//               type={showNewPassword ? "text" : "password"}
//               name="newPassword"
//               placeholder="New Password"
//               value={formData.newPassword}
//               onChange={handleChange}
//               className="w-full bg-black border border-gray-700 text-white p-3 rounded focus:border-yellow-400 focus:outline-none"
//               required
//             />

//             <button
//               type="button"
//               onClick={() =>
//                 setShowNewPassword(!showNewPassword)
//               }
//               className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-400"
//             >
//               {showNewPassword ? (
//                 <FaEyeSlash size={18} />
//               ) : (
//                 <FaEye size={18} />
//               )}
//             </button>
//           </div>

//           {/* Confirm Password */}
//           <div className="relative">
//             <input
//               type={showConfirmPassword ? "text" : "password"}
//               name="confirmPassword"
//               placeholder="Confirm Password"
//               value={formData.confirmPassword}
//               onChange={handleChange}
//               className="w-full bg-black border border-gray-700 text-white p-3 rounded focus:border-yellow-400 focus:outline-none"
//               required
//             />

//             <button
//               type="button"
//               onClick={() =>
//                 setShowConfirmPassword(!showConfirmPassword)
//               }
//               className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-400"
//             >
//               {showConfirmPassword ? (
//                 <FaEyeSlash size={18} />
//               ) : (
//                 <FaEye size={18} />
//               )}
//             </button>
//           </div>

//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full bg-yellow-400 text-black font-semibold py-3 rounded hover:bg-yellow-500 transition"
//           >
//             {isLoading ? "Updating..." : "Update Password"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default ChangePassword;

import { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

const ChangePassword = () => {
  const navigate = useNavigate();
  const { changePasswordAction, isLoading } = useAuthStore();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await changePasswordAction({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      setMessage(
        response.message || "Password changed successfully"
      );

      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to change password"
      );
    }
  };

  return (
    <div className="min-h-screen ml-8.5 bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">

        {/* Header */}

        <div className="mb-8 flex items-center gap-4">

          <button
            type="button"
            onClick={() => navigate("/settings")}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm transition hover:bg-yellow-400"
          >
            <FiArrowLeft size={20} />
          </button>

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Change Password
            </h1>

            <p className="mt-2 text-gray-500">
              Update your account password to keep your account secure.
            </p>
          </div>

        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

          {message && (
            <div className="mb-6 rounded-xl border border-green-300 bg-green-50 px-4 py-3 text-green-700">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>

              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  name="currentPassword"
                  placeholder="Enter current password"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 pr-12 text-gray-900 placeholder-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 focus:outline-none"
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowCurrentPassword(!showCurrentPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-yellow-500"
                >
                  {showCurrentPassword ? (
                    <FaEyeSlash size={18} />
                  ) : (
                    <FaEye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>

              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  placeholder="Enter new password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 pr-12 text-gray-900 placeholder-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 focus:outline-none"
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowNewPassword(!showNewPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-yellow-500"
                >
                  {showNewPassword ? (
                    <FaEyeSlash size={18} />
                  ) : (
                    <FaEye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm new password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 pr-12 text-gray-900 placeholder-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 focus:outline-none"
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-yellow-500"
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash size={18} />
                  ) : (
                    <FaEye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl bg-yellow-400 py-3 font-semibold text-black transition hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Updating Password..." : "Update Password"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;