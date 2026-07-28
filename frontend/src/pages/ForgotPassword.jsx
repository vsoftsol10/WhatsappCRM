// import React, { useState } from "react";
// import { useAuthStore } from "../store/authStore";
// import { FiMail, FiLoader } from "react-icons/fi";
// import { Link } from "react-router-dom";

// const ForgotPassword = () => {
//   const {
//     forgotPasswordAction,
//     isLoading,
//     error,
//     clearError,
//   } = useAuthStore();

//   const [email, setEmail] = useState("");
//   const [successMessage, setSuccessMessage] =
//     useState("");

//   const [errors, setErrors] = useState({
//     email: "",
//   });

//   // ===========================
//   // VALIDATION
//   // ===========================

//   const validateForm = () => {
//     const newErrors = {};

//     if (!email.trim()) {
//       newErrors.email = "Email is required";
//     } else if (
//       !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
//     ) {
//       newErrors.email =
//         "Enter a valid email address";
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
//       await forgotPasswordAction(email);

//     if (result.success) {
//       setSuccessMessage(result.message);

//       setEmail("");

//       setErrors({
//         email: "",
//       });
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
//       <div className="w-full max-w-md bg-[#111] border border-gray-800 rounded-2xl p-8 shadow-lg">
//         {/* HEADER */}
//         <div className="text-center mb-6">
//           <h1 className="text-xl font-bold">
//             Forgot Password
//           </h1>

//           <p className="mt-2 text-sm text-gray-400">
//             Enter your email to receive a reset link
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

//         {/* FORM */}
//         <form
//           onSubmit={handleSubmit}
//           className="space-y-5"
//         >
//           {/* EMAIL */}
//           <div>
//             <label className="text-xs text-gray-400">
//               Email
//             </label>

//             <div className="relative mt-1">
//               <FiMail className="absolute left-3 top-3 text-gray-400" />

//               <input
//                 type="email"
//                 placeholder="you@example.com"
//                 value={email}
//                 onChange={(e) => {
//                   setEmail(e.target.value);

//                   setErrors({
//                     email: "",
//                   });

//                   clearError();
//                 }}
//                 className={`w-full rounded-lg border bg-black py-2 pl-10 pr-3 outline-none transition-colors ${
//                   errors.email
//                     ? "border-red-500"
//                     : "border-gray-700 focus:border-[#25D366]"
//                 }`}
//               />
//             </div>

//             {errors.email && (
//               <p className="mt-1 text-sm text-red-400">
//                 {errors.email}
//               </p>
//             )}
//           </div>

//           {/* BUTTON */}
//           <button
//             type="submit"
//             disabled={isLoading}
//             className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] py-2 font-semibold text-black transition hover:bg-[#128C7E] disabled:cursor-not-allowed disabled:opacity-70"
//           >
//             {isLoading ? (
//               <>
//                 <FiLoader className="animate-spin" />
//                 Sending...
//               </>
//             ) : (
//               "Send Reset Link"
//             )}
//           </button>
//         </form>

//         {/* FOOTER */}
//         <div className="mt-6 text-center">
//           <Link
//             to="/login"
//             className="text-sm text-[#25D366] hover:underline"
//           >
//             Back to Login
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ForgotPassword;

import React, { useState } from "react";
import { useAuthStore } from "../store/authStore";
import {
  FiMail,
  FiLoader,
  FiLock,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const {
    forgotPasswordAction,
    isLoading,
    error,
    clearError,
  } = useAuthStore();

  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] =
    useState("");

  const [errors, setErrors] = useState({
    email: "",
  });

  // ===========================
  // VALIDATION
  // ===========================

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      newErrors.email =
        "Enter a valid email address";
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
      await forgotPasswordAction(email);

    if (result.success) {
      setSuccessMessage(result.message);

      setEmail("");

      setErrors({
        email: "",
      });
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

      {/* Glow */}

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
                Forgot Password
              </h1>

              <p className="text-[#DCF8C6] mt-5 text-lg leading-8 max-w-xs">
                Enter your registered email to
                receive a secure password reset
                link instantly.
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

                <FiMail className="text-white text-3xl" />

              </div>

              <h2 className="text-4xl font-bold text-[#075E54]">
                Reset Password
              </h2>

              <p className="text-gray-500 mt-2">
                We'll send a secure password reset
                link to your email.
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
                            {/* ================= EMAIL ================= */}

              <div>
                <div className="flex items-center gap-4 border-b-2 border-gray-200 pb-3 transition-all duration-300 focus-within:border-[#25D366]">
                  <FiMail className="text-xl text-gray-400 shrink-0" />

                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);

                      setErrors({
                        email: "",
                      });

                      clearError();
                    }}
                    className="w-full bg-transparent outline-none text-gray-800 placeholder:text-gray-400"
                  />
                </div>

                {errors.email && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.email}
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
                    Sending Reset Link...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>

            </form>

            {/* Divider */}

            <div className="my-10 flex items-center">

              <div className="flex-1 h-px bg-gray-200"></div>

              <span className="px-4 text-xs uppercase tracking-widest text-gray-400">
                Remembered your password?
              </span>

              <div className="flex-1 h-px bg-gray-200"></div>

            </div>

            {/* Back to Login */}

            <Link
              to="/login"
              className="w-full h-12 rounded-full border-2 border-[#25D366] text-[#075E54] font-semibold flex items-center justify-center hover:bg-[#25D366] hover:text-white transition-all duration-300"
            >
              Back to Login
            </Link>

            {/* Footer */}

            <div className="mt-10 text-center">

              <p className="text-sm text-gray-500">
                © {new Date().getFullYear()} WhatsApp CRM
              </p>

              <p className="mt-2 text-xs text-gray-400">
                Secure Password Recovery • Protected Access
              </p>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;