// import React, { useState } from "react";
// import { useAuthStore } from "../store/authStore";
// import { FiLock, FiEye, FiEyeOff, FiLoader } from "react-icons/fi";
// import { useNavigate, useParams } from "react-router-dom";

// const ResetPassword = () => {
//   const {
//     resetPasswordAction,
//     isLoading,
//     error,
//     clearError,
//   } = useAuthStore();

//   const { token } = useParams();
//   const navigate = useNavigate();

//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] =
//     useState("");
//   const [showPassword, setShowPassword] =
//     useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] =
//     useState(false);
//   const [successMessage, setSuccessMessage] =
//     useState("");
//   const [validationError, setValidationError] =
//     useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     clearError();
//     setValidationError("");
//     setSuccessMessage("");

//     if (!password || !confirmPassword) {
//       setValidationError("Please fill all fields");
//       return;
//     }

//     if (password !== confirmPassword) {
//       setValidationError("Passwords do not match");
//       return;
//     }

//     const result = await resetPasswordAction(
//       token,
//       password
//     );

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

//         <div className="text-center mb-6">
//           <h1 className="text-xl font-bold">
//             Reset Password
//           </h1>

//           <p className="text-sm text-gray-400 mt-2">
//             Enter your new password
//           </p>
//         </div>

//         {(error || validationError) && (
//           <div className="mb-4 p-3 bg-red-500/10 border border-red-500 text-red-400 text-sm rounded">
//             {validationError || error}
//           </div>
//         )}

//         {successMessage && (
//           <div className="mb-4 p-3 bg-green-500/10 border border-green-500 text-green-400 text-sm rounded">
//             {successMessage}
//           </div>
//         )}

//         <form
//           onSubmit={handleSubmit}
//           className="space-y-5"
//         >
//           <div>
//             <label className="text-xs text-gray-400">
//               New Password
//             </label>

//             <div className="relative mt-1">
//               <FiLock className="absolute left-3 top-3 text-gray-400" />

//               <input
//                 type={showPassword ? "text" : "password"}
//                 value={password}
//                 onChange={(e) => {
//                   setPassword(e.target.value);
//                   clearError();
//                 }}
//                 className="w-full pl-10 pr-10 py-2 bg-black border border-gray-700 rounded-lg focus:border-yellow-400 outline-none"
//                 placeholder="Enter new password"
//               />

//               <button
//                 type="button"
//                 onClick={() =>
//                   setShowPassword(!showPassword)
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
//           </div>

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
//                   setConfirmPassword(e.target.value);
//                   clearError();
//                 }}
//                 className="w-full pl-10 pr-10 py-2 bg-black border border-gray-700 rounded-lg focus:border-yellow-400 outline-none"
//                 placeholder="Confirm password"
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
//           </div>

//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full bg-yellow-400 text-black py-2 rounded-lg font-semibold hover:bg-yellow-300 flex items-center justify-center gap-2"
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
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
      <div className="w-full max-w-md bg-[#111] border border-gray-800 rounded-2xl p-8 shadow-lg">

        {/* HEADER */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold">
            Reset Password
          </h1>

          <p className="mt-2 text-sm text-gray-400">
            Enter your new password
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
          <div className="mb-4 rounded border border-green-500 bg-green-500/10 p-3 text-sm text-green-400">
            {successMessage}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* PASSWORD */}
          <div>
            <label className="text-xs text-gray-400">
              New Password
            </label>

            <div className="relative mt-1">
              <FiLock className="absolute left-3 top-3 text-gray-400" />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);

                  setErrors((prev) => ({
                    ...prev,
                    password: "",
                  }));

                  clearError();
                }}
                placeholder="Enter new password"
                className={`w-full rounded-lg border bg-black py-2 pl-10 pr-10 outline-none transition-colors ${
                  errors.password
                    ? "border-red-500"
                    : "border-gray-700 focus:border-yellow-400"
                }`}
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                className="absolute right-3 top-2.5 text-gray-400"
              >
                {showPassword ? (
                  <FiEyeOff />
                ) : (
                  <FiEye />
                )}
              </button>
            </div>

            {errors.password && (
              <p className="mt-1 text-sm text-red-400">
                {errors.password}
              </p>
            )}
          </div>

                    {/* CONFIRM PASSWORD */}
          <div>
            <label className="text-xs text-gray-400">
              Confirm Password
            </label>

            <div className="relative mt-1">
              <FiLock className="absolute left-3 top-3 text-gray-400" />

              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
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
                placeholder="Confirm password"
                className={`w-full rounded-lg border bg-black py-2 pl-10 pr-10 outline-none transition-colors ${
                  errors.confirmPassword
                    ? "border-red-500"
                    : "border-gray-700 focus:border-yellow-400"
                }`}
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                className="absolute right-3 top-2.5 text-gray-400"
              >
                {showConfirmPassword ? (
                  <FiEyeOff />
                ) : (
                  <FiEye />
                )}
              </button>
            </div>

            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-400">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-yellow-400 py-2 font-semibold text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <FiLoader className="animate-spin" />
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;