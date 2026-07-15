// import React, { useState } from 'react';
// import { useAuthStore } from '../store/authStore';
// import { FiMail, FiLock, FiEye, FiEyeOff, FiLoader } from 'react-icons/fi';
// import { useNavigate } from "react-router-dom";

// const Login = ({ onLoginSuccess }) => {
//   const { login, isLoading, error, clearError } = useAuthStore();

//   const navigate = useNavigate();

//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [validationError, setValidationError] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setValidationError('');
//     clearError();

//     if (!email || !password) {
//       setValidationError('Please fill in all fields.');
//       return;
//     }

//     const result = await login(email, password);
//     console.log("Login Cliked");

//     // if (result.success && onLoginSuccess) {
//     //   onLoginSuccess();
//     // }
//     if (result.success) {
//       navigate("/dashboard");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">

//       {/* LOGIN CARD */}
//       <div className="w-full max-w-md bg-[#111] border border-gray-800 rounded-2xl p-8 shadow-lg">

//         {/* HEADER */}
//         <div className="text-center mb-8">
//           {/* <div className="w-12 h-12 mx-auto bg-yellow-400 text-black font-bold text-sm flex items-center justify-center rounded-xl mb-3 shadow-md">
//             WhatsApp CRM
//           </div> */}
//           <div className="text-center mb-6">

//             <h1 className="text-xl font-bold tracking-wide text-white">
//               WhatsApp <span className="text-yellow-400">CRM</span>
//             </h1>

//             <p className="text-xs text-gray-500 mt-1">
//               Business Messaging Platform
//             </p>

//         </div>

//           {/* <h2 className="text-2xl font-bold">
//             Welcome Back
//           </h2>

//           <p className="text-gray-400 text-sm">
//             Sign in to your CRM dashboard
//           </p> */}
//         </div>

//         {/* ERROR */}
//         {(error || validationError) && (
//           <div className="mb-4 p-3 bg-red-500/10 border border-red-500 text-red-400 text-sm rounded">
//             {validationError || error}
//           </div>
//         )}

//         {/* FORM */}
//         <form onSubmit={handleSubmit} className="space-y-5">

//           {/* EMAIL */}
//           <div>
//             <label className="text-xs text-gray-400">Email</label>

//             <div className="relative mt-1">
//               <FiMail className="absolute left-3 top-3 text-gray-400" />

//               <input
//                 type="email"
//                 placeholder="you@example.com"
//                 value={email}
//                 onChange={(e) => {
//                   setEmail(e.target.value);
//                   setValidationError('');
//                   clearError();
//                 }}
//                 className="w-full pl-10 pr-3 py-2 bg-black border border-gray-700 rounded-lg focus:border-yellow-400 outline-none"
//               />
//             </div>
//           </div>

//           {/* PASSWORD */}
//           <div>
//             <label className="text-xs text-gray-400">Password</label>

//             <div className="relative mt-1">
//               <FiLock className="absolute left-3 top-3 text-gray-400" />

//               <input
//                 type={showPassword ? 'text' : 'password'}
//                 placeholder="••••••••"
//                 value={password}
//                 onChange={(e) => {
//                   setPassword(e.target.value);
//                   setValidationError('');
//                   clearError();
//                 }}
//                 className="w-full pl-10 pr-10 py-2 bg-black border border-gray-700 rounded-lg focus:border-yellow-400 outline-none"
//               />

//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-2.5 text-gray-400"
//               >
//                 {showPassword ? <FiEyeOff /> : <FiEye />}
//               </button>
//             </div>
//           </div>

//           <div className="flex justify-end">
//             <button
//               type="button"
//               onClick={() => 
//                 {
//                   console.log("Forgot clicked");
//                   navigate("/forgot-password")
//                 }}
//               className="text-sm text-yellow-400 hover:underline"
//             >
//               Forgot Password?
//             </button>
//           </div>

//           {/* BUTTON */}
//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full bg-yellow-400 text-black py-2 rounded-lg font-semibold hover:bg-yellow-300 flex items-center justify-center gap-2"
//           >
//             {isLoading ? (
//               <>
//                 <FiLoader className="animate-spin" />
//                 Signing in...
//               </>
//             ) : (
//               'Sign In'
//             )}
//           </button>

//         </form>

//         {/* FOOTER */}
//         <p className="text-center text-gray-500 text-xs mt-6">
//           WhatsApp CRM System
//         </p>

//       </div>
//     </div>
//   );
// };

// export default Login;

import React, { useState } from "react";
import { useAuthStore } from "../store/authStore";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiLoader,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Login = ({ onLoginSuccess }) => {
  const {
    login,
    isLoading,
    error,
    clearError,
  } = useAuthStore();

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");
  const [showPassword, setShowPassword] =
    useState(false);

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  // ===========================
  // VALIDATION
  // ===========================

  const validateForm = () => {
    const newErrors = {};

    // Email
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
      )
    ) {
      newErrors.email =
        "Enter a valid email address";
    }

    // Password
    if (!password) {
      newErrors.password =
        "Password is required";
    } else if (password.length < 6) {
      newErrors.password =
        "Password must be at least 6 characters";
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

    if (!validateForm()) return;

    const result = await login(
      email,
      password
    );

    console.log("Login Clicked");

    if (result.success) {
      navigate("/dashboard");

      if (onLoginSuccess) {
        onLoginSuccess();
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
      {/* LOGIN CARD */}
      <div className="w-full max-w-md bg-[#111] border border-gray-800 rounded-2xl p-8 shadow-lg">
        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold tracking-wide text-white">
              WhatsApp{" "}
              <span className="text-yellow-400">
                CRM
              </span>
            </h1>

            <p className="text-xs text-gray-500 mt-1">
              Business Messaging Platform
            </p>
          </div>
        </div>

        {/* BACKEND ERROR */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-500 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
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

                  setErrors((prev) => ({
                    ...prev,
                    email: "",
                  }));

                  clearError();
                }}
                className={`w-full pl-10 pr-3 py-2 bg-black border rounded-lg outline-none transition-colors ${
                  errors.email
                    ? "border-red-500"
                    : "border-gray-700 focus:border-yellow-400"
                }`}
              />
            </div>

            {errors.email && (
              <p className="mt-1 text-sm text-red-400">
                {errors.email}
              </p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-xs text-gray-400">
              Password
            </label>

            <div className="relative mt-1">
              <FiLock className="absolute left-3 top-3 text-gray-400" />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);

                  setErrors((prev) => ({
                    ...prev,
                    password: "",
                  }));

                  clearError();
                }}
                className={`w-full pl-10 pr-10 py-2 bg-black border rounded-lg outline-none transition-colors ${
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

          {/* FORGOT PASSWORD */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                console.log(
                  "Forgot clicked"
                );
                navigate(
                  "/forgot-password"
                );
              }}
              className="text-sm text-yellow-400 hover:underline"
            >
              Forgot Password?
            </button>
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
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* FOOTER */}
        <p className="mt-6 text-center text-xs text-gray-500">
          WhatsApp CRM System
        </p>
      </div>
    </div>
  );
};

export default Login;