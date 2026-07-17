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

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     clearError();
//     setSuccessMessage("");

//     const result =
//       await forgotPasswordAction(email);

//     if (result.success) {
//       setSuccessMessage(result.message);
//       setEmail("");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
//       <div className="w-full max-w-md bg-[#111] border border-gray-800 rounded-2xl p-8 shadow-lg">

//         <div className="text-center mb-6">
//           <h1 className="text-xl font-bold">
//             Forgot Password
//           </h1>

//           <p className="text-sm text-gray-400 mt-2">
//             Enter your email to receive a reset link
//           </p>
//         </div>

//         {error && (
//           <div className="mb-4 p-3 bg-red-500/10 border border-red-500 text-red-400 text-sm rounded">
//             {error}
//           </div>
//         )}

//         {successMessage && (
//           <div className="mb-4 p-3 bg-[#DCF8C6]0/10 border border-green-500 text-green-400 text-sm rounded">
//             {successMessage}
//           </div>
//         )}

//         <form
//           onSubmit={handleSubmit}
//           className="space-y-5"
//         >
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
//                   clearError();
//                 }}
//                 className="w-full pl-10 pr-3 py-2 bg-black border border-gray-700 rounded-lg focus:border-[#25D366] outline-none"
//                 required
//               />
//             </div>
//           </div>

//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full bg-[#25D366] text-black py-2 rounded-lg font-semibold hover:bg-[#128C7E] flex items-center justify-center gap-2"
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

//         <div className="text-center mt-6">
//           <Link
//             to="/login"
//             className="text-[#25D366] hover:underline text-sm"
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
import { FiMail, FiLoader } from "react-icons/fi";
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
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
      <div className="w-full max-w-md bg-[#111] border border-gray-800 rounded-2xl p-8 shadow-lg">
        {/* HEADER */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold">
            Forgot Password
          </h1>

          <p className="mt-2 text-sm text-gray-400">
            Enter your email to receive a reset link
          </p>
        </div>

        {/* BACKEND ERROR */}
        {error && (
          <div className="mb-4 rounded border border-red-500 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* SUCCESS */}
        {successMessage && (
          <div className="mb-4 rounded border border-green-500 bg-[#DCF8C6]0/10 p-3 text-sm text-green-400">
            {successMessage}
          </div>
        )}

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* EMAIL */}
          <div>
            <label className="text-xs text-gray-400">
              Email
            </label>

            <div className="relative mt-1">
              <FiMail className="absolute left-3 top-3 text-gray-400" />

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);

                  setErrors({
                    email: "",
                  });

                  clearError();
                }}
                className={`w-full rounded-lg border bg-black py-2 pl-10 pr-3 outline-none transition-colors ${
                  errors.email
                    ? "border-red-500"
                    : "border-gray-700 focus:border-[#25D366]"
                }`}
              />
            </div>

            {errors.email && (
              <p className="mt-1 text-sm text-red-400">
                {errors.email}
              </p>
            )}
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] py-2 font-semibold text-black transition hover:bg-[#128C7E] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <FiLoader className="animate-spin" />
                Sending...
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>

        {/* FOOTER */}
        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-sm text-[#25D366] hover:underline"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;