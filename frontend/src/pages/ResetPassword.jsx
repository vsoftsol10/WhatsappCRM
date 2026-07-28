// import React, { useState } from "react";
// import { useAuthStore } from "../store/authStore";
// import {
//   FiLock,
//   FiEye,
//   FiEyeOff,
//   FiLoader,
// } from "react-icons/fi";
// import {
//   useNavigate,
//   useParams,
// } from "react-router-dom";

// const ResetPassword = () => {
//   const {
//     resetPasswordAction,
//     isLoading,
//     error,
//     clearError,
//   } = useAuthStore();

//   const { token } = useParams();
//   const navigate = useNavigate();

//   const [password, setPassword] =
//     useState("");
//   const [
//     confirmPassword,
//     setConfirmPassword,
//   ] = useState("");

//   const [showPassword, setShowPassword] =
//     useState(false);

//   const [
//     showConfirmPassword,
//     setShowConfirmPassword,
//   ] = useState(false);

//   const [successMessage, setSuccessMessage] =
//     useState("");

//   const [errors, setErrors] = useState({
//     password: "",
//     confirmPassword: "",
//   });

//   // ===========================
//   // VALIDATION
//   // ===========================

//   const validateForm = () => {
//     const newErrors = {};

//     if (!password) {
//       newErrors.password =
//         "Password is required";
//     } else if (password.length < 6) {
//       newErrors.password =
//         "Password must be at least 6 characters";
//     }

//     if (!confirmPassword) {
//       newErrors.confirmPassword =
//         "Confirm Password is required";
//     } else if (
//       password !== confirmPassword
//     ) {
//       newErrors.confirmPassword =
//         "Passwords do not match";
//     }

//     setErrors(newErrors);

//     return (
//       Object.keys(newErrors).length === 0
//     );
//   };

//   // ===========================
//   // SUBMIT
//   // ===========================

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     clearError();
//     setSuccessMessage("");

//     if (!validateForm()) return;

//     const result =
//       await resetPasswordAction(
//         token,
//         password
//       );

//     if (result.success) {
//       setSuccessMessage(result.message);

//       setTimeout(() => {
//         navigate("/login");
//       }, 2000);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
//       <div className="w-full max-w-md bg-[#111] border border-gray-800 rounded-2xl p-8 shadow-lg">

//         {/* HEADER */}
//         <div className="text-center mb-6">
//           <h1 className="text-xl font-bold">
//             Reset Password
//           </h1>

//           <p className="mt-2 text-sm text-gray-400">
//             Enter your new password
//           </p>
//         </div>

//         {/* BACKEND ERROR */}
//         {error && (
//           <div className="mb-4 rounded border border-red-500 bg-red-500/10 p-3 text-sm text-red-400">
//             {error}
//           </div>
//         )}

//         {/* SUCCESS */}
//         {successMessage && (
//           <div className="mb-4 rounded border border-green-500 bg-[#DCF8C6]0/10 p-3 text-sm text-green-400">
//             {successMessage}
//           </div>
//         )}

//         <form
//           onSubmit={handleSubmit}
//           className="space-y-5"
//         >

//           {/* PASSWORD */}
//           <div>
//             <label className="text-xs text-gray-400">
//               New Password
//             </label>

//             <div className="relative mt-1">
//               <FiLock className="absolute left-3 top-3 text-gray-400" />

//               <input
//                 type={
//                   showPassword
//                     ? "text"
//                     : "password"
//                 }
//                 value={password}
//                 onChange={(e) => {
//                   setPassword(e.target.value);

//                   setErrors((prev) => ({
//                     ...prev,
//                     password: "",
//                   }));

//                   clearError();
//                 }}
//                 placeholder="Enter new password"
//                 className={`w-full rounded-lg border bg-black py-2 pl-10 pr-10 outline-none transition-colors ${
//                   errors.password
//                     ? "border-red-500"
//                     : "border-gray-700 focus:border-[#25D366]"
//                 }`}
//               />

//               <button
//                 type="button"
//                 onClick={() =>
//                   setShowPassword(
//                     !showPassword
//                   )
//                 }
//                 className="absolute right-3 top-2.5 text-gray-400"
//               >
//                 {showPassword ? (
//                   <FiEyeOff />
//                 ) : (
//                   <FiEye />
//                 )}
//               </button>
//             </div>

//             {errors.password && (
//               <p className="mt-1 text-sm text-red-400">
//                 {errors.password}
//               </p>
//             )}
//           </div>

//                     {/* CONFIRM PASSWORD */}
//           <div>
//             <label className="text-xs text-gray-400">
//               Confirm Password
//             </label>

//             <div className="relative mt-1">
//               <FiLock className="absolute left-3 top-3 text-gray-400" />

//               <input
//                 type={
//                   showConfirmPassword
//                     ? "text"
//                     : "password"
//                 }
//                 value={confirmPassword}
//                 onChange={(e) => {
//                   setConfirmPassword(
//                     e.target.value
//                   );

//                   setErrors((prev) => ({
//                     ...prev,
//                     confirmPassword: "",
//                   }));

//                   clearError();
//                 }}
//                 placeholder="Confirm password"
//                 className={`w-full rounded-lg border bg-black py-2 pl-10 pr-10 outline-none transition-colors ${
//                   errors.confirmPassword
//                     ? "border-red-500"
//                     : "border-gray-700 focus:border-[#25D366]"
//                 }`}
//               />

//               <button
//                 type="button"
//                 onClick={() =>
//                   setShowConfirmPassword(
//                     !showConfirmPassword
//                   )
//                 }
//                 className="absolute right-3 top-2.5 text-gray-400"
//               >
//                 {showConfirmPassword ? (
//                   <FiEyeOff />
//                 ) : (
//                   <FiEye />
//                 )}
//               </button>
//             </div>

//             {errors.confirmPassword && (
//               <p className="mt-1 text-sm text-red-400">
//                 {errors.confirmPassword}
//               </p>
//             )}
//           </div>

//           {/* SUBMIT BUTTON */}
//           <button
//             type="submit"
//             disabled={isLoading}
//             className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] py-2 font-semibold text-black transition hover:bg-[#128C7E] disabled:cursor-not-allowed disabled:opacity-70"
//           >
//             {isLoading ? (
//               <>
//                 <FiLoader className="animate-spin" />
//                 Resetting...
//               </>
//             ) : (
//               "Reset Password"
//             )}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ResetPassword;

import React, { useState } from "react";
import { useAuthStore } from "../store/authStore";
import {
  FiLock,
  FiEye,
  FiEyeOff,
  FiLoader,
} from "react-icons/fi";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

const ResetPassword = () => {
  const {
    resetPasswordAction,
    isLoading,
    error,
    clearError,
  } = useAuthStore();

  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [successMessage, setSuccessMessage] =
    useState("");

  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
  });

  // ===========================
  // VALIDATION
  // ===========================

  const validateForm = () => {
    const newErrors = {};

    if (!password) {
      newErrors.password =
        "Password is required";
    } else if (password.length < 6) {
      newErrors.password =
        "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword =
        "Confirm Password is required";
    } else if (
      password !== confirmPassword
    ) {
      newErrors.confirmPassword =
        "Passwords do not match";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  };

  // ===========================
  // SUBMIT
  // ===========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    clearError();
    setSuccessMessage("");

    if (!validateForm()) return;

    const result =
      await resetPasswordAction(
        token,
        password
      );

    if (result.success) {
      setSuccessMessage(result.message);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('/images/login-bg.png')",
      }}
    >
      {/* Overlay */}

      <div className="absolute inset-0 bg-[#062f2b]/55"></div>

      {/* Decorative Glow */}

      <div className="absolute top-[-180px] left-[-180px] w-[420px] h-[420px] rounded-full bg-[#25D366]/20 blur-[120px]" />

      <div className="absolute bottom-[-180px] right-[-180px] w-[400px] h-[400px] rounded-full bg-[#25D366]/10 blur-[120px]" />

      {/* Main Container */}

      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-10">

        <div className="w-full max-w-5xl bg-white/92 backdrop-blur-xl rounded-[34px] shadow-[0_30px_80px_rgba(0,0,0,0.45)] overflow-hidden grid lg:grid-cols-5">

          {/* ================= LEFT PANEL ================= */}

          <div className="hidden lg:flex lg:col-span-2 relative bg-gradient-to-br from-[#075E54] via-[#0b7d6f] to-[#128C7E] overflow-hidden">

            <div className="absolute inset-0">

              <div
                className="absolute -left-24 top-0 h-full w-[80%] bg-white/6"
                style={{
                  clipPath:
                    "polygon(0 0,100% 0,45% 50%,100% 100%,0 100%)",
                }}
              />

              <div
                className="absolute -left-10 top-0 h-full w-[75%] bg-white/8"
                style={{
                  clipPath:
                    "polygon(0 0,100% 0,35% 50%,100% 100%,0 100%)",
                }}
              />

            </div>

            <div className="relative z-10 flex flex-col justify-center items-center text-center px-10">

              <div className="w-24 h-24 rounded-full bg-[#DCF8C6] flex items-center justify-center shadow-xl mb-8">

                <FiLock
                  className="text-[#075E54]"
                  size={42}
                />

              </div>

              <h1 className="text-4xl font-bold text-white">
                Reset Password
              </h1>

              <p className="text-[#DCF8C6] mt-5 text-lg leading-8 max-w-xs">
                Create a strong password to keep
                your WhatsApp CRM account secure.
              </p>

              <div className="mt-12 flex gap-3">

                <div className="w-3 h-3 rounded-full bg-white"></div>

                <div className="w-3 h-3 rounded-full bg-white/50"></div>

                <div className="w-3 h-3 rounded-full bg-white/20"></div>

              </div>

            </div>

          </div>

          {/* ================= RIGHT PANEL ================= */}

          <div className="lg:col-span-3 flex flex-col justify-center px-8 sm:px-14 lg:px-16 py-14">

            <div className="flex flex-col items-center text-center mb-10">

              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#25D366] to-[#075E54] flex items-center justify-center shadow-xl mb-6">

                <FiLock className="text-white text-3xl" />

              </div>

              <h2 className="text-4xl font-bold text-[#075E54]">
                Create New Password
              </h2>

              <p className="text-gray-500 mt-2">
                Your new password must be different
                from your previous password.
              </p>

            </div>

            {/* Error */}

            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Success */}

            {successMessage && (
              <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                {successMessage}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-7"
            >
                            {/* ================= NEW PASSWORD ================= */}

              <div>
                <div className="flex items-center gap-4 border-b-2 border-gray-200 pb-3 transition-all duration-300 focus-within:border-[#25D366]">

                  <FiLock className="text-xl text-gray-400 shrink-0" />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);

                      setErrors((prev) => ({
                        ...prev,
                        password: "",
                      }));

                      clearError();
                    }}
                    className="w-full bg-transparent outline-none text-gray-800 placeholder:text-gray-400"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="text-gray-400 hover:text-[#25D366] transition"
                  >
                    {showPassword ? (
                      <FiEyeOff size={20} />
                    ) : (
                      <FiEye size={20} />
                    )}
                  </button>

                </div>

                {errors.password && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.password}
                  </p>
                )}

              </div>

              {/* ================= CONFIRM PASSWORD ================= */}

              <div>
                <div className="flex items-center gap-4 border-b-2 border-gray-200 pb-3 transition-all duration-300 focus-within:border-[#25D366]">

                  <FiLock className="text-xl text-gray-400 shrink-0" />

                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(
                        e.target.value
                      );

                      setErrors((prev) => ({
                        ...prev,
                        confirmPassword: "",
                      }));

                      clearError();
                    }}
                    className="w-full bg-transparent outline-none text-gray-800 placeholder:text-gray-400"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    className="text-gray-400 hover:text-[#25D366] transition"
                  >
                    {showConfirmPassword ? (
                      <FiEyeOff size={20} />
                    ) : (
                      <FiEye size={20} />
                    )}
                  </button>

                </div>

                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.confirmPassword}
                  </p>
                )}

              </div>

              {/* ================= BUTTON ================= */}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <FiLoader className="animate-spin" />
                    Resetting Password...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>

            </form>

            {/* Divider */}

            <div className="my-10 flex items-center">

              <div className="flex-1 h-px bg-gray-200"></div>

              <span className="px-4 text-xs uppercase tracking-widest text-gray-400">
                Secure Account
              </span>

              <div className="flex-1 h-px bg-gray-200"></div>

            </div>

            {/* Footer */}

            <div className="text-center">

              <p className="text-sm text-gray-500">
                © {new Date().getFullYear()} WhatsApp CRM
              </p>

              <p className="mt-2 text-xs text-gray-400">
                Secure Authentication • Encrypted Password Reset
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default ResetPassword;