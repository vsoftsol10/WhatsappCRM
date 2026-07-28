// import React, { useState } from "react";
// import { useAuthStore } from "../store/authStore";
// import {
//   FiMail,
//   FiLock,
//   FiEye,
//   FiEyeOff,
//   FiLoader,
//   FiUser,
// } from "react-icons/fi";
// import { useNavigate } from "react-router-dom";

// const Login = ({ onLoginSuccess }) => {
//   const {
//     login,
//     isLoading,
//     error,
//     clearError,
//   } = useAuthStore();

//   const navigate = useNavigate();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] =
//     useState("");
//   const [showPassword, setShowPassword] =
//     useState(false);

//   const [errors, setErrors] = useState({
//     email: "",
//     password: "",
//   });

//   // ===========================
//   // VALIDATION
//   // ===========================

//   const validateForm = () => {
//     const newErrors = {};

//     // Email
//     if (!email.trim()) {
//       newErrors.email = "Email is required";
//     } else if (
//       !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
//         email
//       )
//     ) {
//       newErrors.email =
//         "Enter a valid email address";
//     }

//     // Password
//     if (!password) {
//       newErrors.password =
//         "Password is required";
//     } else if (password.length < 6) {
//       newErrors.password =
//         "Password must be at least 6 characters";
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

//     if (!validateForm()) return;

//     const result = await login(
//       email,
//       password
//     );

//     console.log("Login Clicked");

//     if (result.success) {
//       navigate("/dashboard");

//       if (onLoginSuccess) {
//         onLoginSuccess();
//       }
//     }
//   };

//   return (
//     <div
//       className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat p-4"
//       style={{
//         backgroundImage: "url('/images/login-bg.png')",
//       }}
//     >
//       <div className="absolute inset-0 bg-[#075E54]/60 backdrop-blur-[2px]">
//         {/* LOGIN CARD */}
//         <div className="w-full max-w-4xl grid md:grid-cols-5 bg-white/95 backdrop-blur-md rounded-[2rem] shadow-2xl overflow-hidden min-h-[600px]">
//           {/* ================= LEFT PANEL ================= */}
//           <div className="relative hidden md:flex md:col-span-2 flex-col justify-center items-center overflow-hidden bg-[#075E54]">
//             {/* Diagonal chat-bubble-tail motif */}
//             <div className="absolute inset-0">
//               <div
//                 className="absolute -left-10 top-0 h-full w-[85%] bg-[#0C7C6C]"
//                 style={{
//                   clipPath:
//                     "polygon(0 0, 100% 0, 35% 50%, 100% 100%, 0 100%)",
//                 }}
//               />
//               <div
//                 className="absolute -left-24 top-0 h-full w-[70%] bg-[#128C7E]/70"
//                 style={{
//                   clipPath:
//                     "polygon(0 0, 100% 0, 20% 50%, 100% 100%, 0 100%)",
//                 }}
//               />
//             </div>

//             {/* Content over the diagonal shapes */}
//             <div className="relative z-10 flex flex-col items-center text-center px-8">
//               <svg
//                 width="52"
//                 height="52"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 className="mb-4 drop-shadow"
//               >
//                 <path
//                   d="M12 2C6.48 2 2 6.02 2 11c0 1.9.63 3.66 1.7 5.1L2.6 20.4a.6.6 0 00.76.75l4.5-1.45A10.3 10.3 0 0012 20c5.52 0 10-4.02 10-9s-4.48-9-10-9z"
//                   fill="#DCF8C6"
//                 />
//                 <path
//                   d="M8.2 8.7c.2-.4.4-.5.7-.5h.5c.2 0 .4 0 .55.4.2.5.65 1.7.7 1.8.05.15.1.3 0 .5-.1.2-.15.3-.3.45s-.3.3-.4.4c-.15.15-.3.3-.15.6.2.3.85 1.3 1.8 2.1 1.25 1.05 2.25 1.4 2.6 1.55.3.15.5.1.65-.1.2-.2.75-.85.95-1.15.2-.3.4-.25.65-.15s1.6.75 1.9.9c.3.15.5.2.55.35.1.15.1.85-.2 1.65-.3.8-1.65 1.5-2.3 1.6-.6.1-1.35.15-2.2-.15a12.5 12.5 0 01-4.55-3.1c-1.4-1.5-2.3-3.05-2.55-3.6-.25-.55-.15-.85 0-1.15z"
//                   fill="#075E54"
//                 />
//               </svg>
//               <h1 className="text-2xl font-bold tracking-wide text-white">
//                 WhatsApp CRM
//               </h1>
//               <p className="text-sm text-[#DCF8C6] mt-2 max-w-[220px]">
//                 Manage every customer conversation from one place
//               </p>
//             </div>

//             {/* Overlapping pill tab */}
//             <div className="absolute top-1/2 -right-1 -translate-y-1/2 z-20">
//               {/* <div className="bg-white rounded-full pl-6 pr-8 py-3 shadow-lg">
//                 <span className="text-[#075E54] font-bold tracking-widest text-sm">
//                   LOGIN
//                 </span>
//               </div> */}
//             </div>
//           </div>

//           {/* ================= RIGHT PANEL ================= */}
//           <div className="md:col-span-3 flex flex-col justify-center px-8 py-10 sm:px-14">
//             {/* HEADER */}
//             <div className="flex flex-col items-center text-center mb-8">
//               <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#25D366] to-[#075E54] flex items-center justify-center shadow-md mb-4">
//                 <FiUser className="text-white text-2xl" />
//               </div>

//               <h2 className="text-2xl font-bold tracking-wide text-[#075E54]">
//                 LOGIN
//               </h2>
//               <p className="text-xs text-gray-400 mt-1">
//                 Business Messaging Platform
//               </p>
//             </div>

//             {/* BACKEND ERROR */}
//             {error && (
//               <div className="mb-4 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-500">
//                 {error}
//               </div>
//             )}

//             {/* FORM */}
//             <form onSubmit={handleSubmit} className="space-y-6">
//               {/* EMAIL */}
//               <div>
//                 <div className="relative flex items-center gap-3 border-b border-gray-300 focus-within:border-[#25D366] pb-2 transition-colors">
//                   <FiMail className="text-gray-400 text-lg shrink-0" />
//                   <input
//                     type="email"
//                     placeholder="Email"
//                     value={email}
//                     onChange={(e) => {
//                       setEmail(e.target.value);
//                       setErrors((prev) => ({ ...prev, email: "" }));
//                       clearError();
//                     }}
//                     className="w-full bg-transparent outline-none text-[#1f2c2a] placeholder-gray-400"
//                   />
//                 </div>
//                 {errors.email && (
//                   <p className="mt-1 text-sm text-red-500">{errors.email}</p>
//                 )}
//               </div>

//               {/* PASSWORD */}
//               <div>
//                 <div className="relative flex items-center gap-3 border-b border-gray-300 focus-within:border-[#25D366] pb-2 transition-colors">
//                   <FiLock className="text-gray-400 text-lg shrink-0" />
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     placeholder="Password"
//                     value={password}
//                     onChange={(e) => {
//                       setPassword(e.target.value);
//                       setErrors((prev) => ({ ...prev, password: "" }));
//                       clearError();
//                     }}
//                     className="w-full bg-transparent outline-none text-[#1f2c2a] placeholder-gray-400"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="text-gray-400 shrink-0"
//                   >
//                     {showPassword ? <FiEyeOff /> : <FiEye />}
//                   </button>
//                 </div>
//                 {errors.password && (
//                   <p className="mt-1 text-sm text-red-500">
//                     {errors.password}
//                   </p>
//                 )}
//               </div>

//               {/* FORGOT PASSWORD + SUBMIT */}
//               <div className="flex items-center justify-between pt-2">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     console.log("Forgot clicked");
//                     navigate("/forgot-password");
//                   }}
//                   className="text-sm text-[#075E54] hover:underline"
//                 >
//                   Forgot Password?
//                 </button>

//                 <button
//                   type="submit"
//                   disabled={isLoading}
//                   className="flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-8 py-2.5 font-semibold text-white tracking-wide transition hover:bg-[#128C7E] disabled:cursor-not-allowed disabled:opacity-70"
//                 >
//                   {isLoading ? (
//                     <>
//                       <FiLoader className="animate-spin" />
//                       Signing in...
//                     </>
//                   ) : (
//                     "LOGIN"
//                   )}
//                 </button>
//               </div>
//             </form>

//             {/* FOOTER */}
//             <p className="mt-10 text-center text-xs text-gray-400">
//               WhatsApp CRM System
//             </p>
//           </div>
//         </div>
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
  FiUser,
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
  const [password, setPassword] = useState("");
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
  // LOGIN
  // ===========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    clearError();

    if (!validateForm()) return;

    const result = await login(
      email,
      password
    );

    if (result.success) {
      navigate("/dashboard");

      if (onLoginSuccess) {
        onLoginSuccess();
      }
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
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-[#062f2b]/55"></div>

      {/* Decorative Glow */}
      <div className="absolute top-[-180px] left-[-180px] w-[420px] h-[420px] rounded-full bg-[#25D366]/20 blur-[120px]" />

      <div className="absolute bottom-[-150px] right-[-120px] w-[350px] h-[350px] rounded-full bg-[#25D366]/10 blur-[120px]" />

      {/* Container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-10">
        {/* Login Card */}
        <div className="w-full max-w-5xl bg-white/92 backdrop-blur-xl rounded-[34px] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.45)] grid lg:grid-cols-5">

          {/* ================= LEFT PANEL ================= */}

          <div className="hidden lg:flex lg:col-span-2 relative bg-gradient-to-br from-[#075E54] via-[#0b7d6f] to-[#128C7E] overflow-hidden">

            {/* Decorative Shapes */}

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

                <svg
                  width="50"
                  height="50"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M12 2C6.48 2 2 6.02 2 11c0 1.9.63 3.66 1.7 5.1L2.6 20.4a.6.6 0 00.76.75l4.5-1.45A10.3 10.3 0 0012 20c5.52 0 10-4.02 10-9s-4.48-9-10-9z"
                    fill="#25D366"
                  />

                  <path
                    d="M8.2 8.7c.2-.4.4-.5.7-.5h.5c.2 0 .4 0 .55.4.2.5.65 1.7.7 1.8.05.15.1.3 0 .5-.1.2-.15.3-.3.45s-.3.3-.4.4c-.15.15-.3.3-.15.6.2.3.85 1.3 1.8 2.1 1.25 1.05 2.25 1.4 2.6 1.55.3.15.5.1.65-.1.2-.2.75-.85.95-1.15.2-.3.4-.25.65-.15s1.6.75 1.9.9c.3.15.5.2.55.35.1.15.1.85-.2 1.65-.3.8-1.65 1.5-2.3 1.6-.6.1-1.35.15-2.2-.15a12.5 12.5 0 01-4.55-3.1c-1.4-1.5-2.3-3.05-2.55-3.6-.25-.55-.15-.85 0-1.15z"
                    fill="#075E54"
                  />
                </svg>

              </div>

              <h1 className="text-4xl font-bold text-white">
                WhatsApp CRM
              </h1>

              <p className="text-[#DCF8C6] mt-5 text-lg leading-8 max-w-xs">
                Manage every customer conversation
                from one powerful platform.
              </p>

              <div className="mt-12 flex gap-3">

                <div className="w-3 h-3 rounded-full bg-white/90"></div>

                <div className="w-3 h-3 rounded-full bg-white/50"></div>

                <div className="w-3 h-3 rounded-full bg-white/25"></div>

              </div>

            </div>

          </div>

          {/* ================= RIGHT PANEL ================= */}

          <div className="lg:col-span-3 flex flex-col justify-center px-8 sm:px-14 lg:px-16 py-14">

            {/* Header */}

            <div className="flex flex-col items-center text-center mb-10">

              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#25D366] to-[#075E54] flex items-center justify-center shadow-xl mb-6">

                <FiUser className="text-white text-3xl" />

              </div>

              <h2 className="text-4xl font-bold text-[#075E54]">
                Welcome Back
              </h2>

              <p className="mt-2 text-gray-500">
                Sign in to continue to your CRM
              </p>

            </div>

            {/* Backend Error */}

            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                {error}
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
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrors((prev) => ({
                        ...prev,
                        email: "",
                      }));
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

              {/* ================= PASSWORD ================= */}

              <div>
                <div className="flex items-center gap-4 border-b-2 border-gray-200 pb-3 transition-all duration-300 focus-within:border-[#25D366]">
                  <FiLock className="text-xl text-gray-400 shrink-0" />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Password"
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

              {/* ================= ACTIONS ================= */}

              <div className="flex items-center justify-between pt-3">

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      "/forgot-password"
                    )
                  }
                  className="text-sm font-medium text-[#075E54] hover:text-[#25D366] transition"
                >
                  Forgot Password?
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="min-w-[170px] h-12 rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.03] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <FiLoader className="animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    <>
                      LOGIN
                    </>
                  )}
                </button>

              </div>

            </form>

            {/* Divider */}

            <div className="my-10 flex items-center">

              <div className="flex-1 h-px bg-gray-200"></div>

              <span className="px-4 text-xs uppercase tracking-widest text-gray-400">
                Secure Access
              </span>

              <div className="flex-1 h-px bg-gray-200"></div>

            </div>

            {/* Footer */}

            <div className="text-center">

              <p className="text-sm text-gray-500">
                © {new Date().getFullYear()} WhatsApp CRM
              </p>

              <p className="text-xs text-gray-400 mt-2">
                Customer Communication • Automation • Analytics
              </p>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;