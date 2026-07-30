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
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-[#062f2b]/55"></div>

      {/* Decorative Glow */}
      <div className="absolute top-[-180px] left-[-180px] w-[420px] h-[420px] rounded-full bg-[#25D366]/20 blur-[120px]" />

      <div className="absolute bottom-[-150px] right-[-120px] w-[350px] h-[350px] rounded-full bg-[#25D366]/10 blur-[120px]" />

      {/* Container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-10">
        {/* Card */}
        <div className="w-full max-w-5xl bg-white/92 backdrop-blur-xl rounded-[34px] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.45)] grid lg:grid-cols-5">

          {/* ================= LEFT PANEL ================= */}

          <div className="hidden lg:flex lg:col-span-2 relative overflow-hidden bg-gradient-to-br from-[#032B2A] via-[#054F4A] to-[#0E8A7A]">

            {/* Soft Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-black/20" />

            {/* Grid Pattern */}
            <div
              className="absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)
                `,
                backgroundSize: "42px 42px",
              }}
            />

            {/* ================= Decorative Background ================= */}

            <div className="absolute inset-0 overflow-hidden">

              {/* Large Green Glow */}
              <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#25D366]/20 blur-[120px]" />

              {/* Bottom Cyan Glow */}
              <div className="absolute -bottom-28 -right-16 w-64 h-64 rounded-full bg-[#00E5C3]/15 blur-[110px]" />

              {/* Main Glass Shape */}
              <div
                className="absolute -left-20 top-0 h-full w-[82%] bg-white/[0.05] backdrop-blur-sm"
                style={{
                  clipPath:
                    "polygon(0 0,100% 0,48% 50%,100% 100%,0 100%)",
                }}
              />

              {/* Second Layer */}
              <div
                className="absolute -left-8 top-0 h-full w-[74%] bg-[#25D366]/[0.06]"
                style={{
                  clipPath:
                    "polygon(0 0,100% 0,36% 50%,100% 100%,0 100%)",
                }}
              />

            </div>

            {/* Floating Glow - Top */}
            <div className="absolute top-20 right-8 w-20 h-20 rounded-full bg-[#25D366]/20 blur-3xl animate-pulse" />

            {/* Floating Glow - Middle */}
            <div
              className="absolute top-1/2 left-12 w-14 h-14 rounded-full bg-cyan-300/20 blur-2xl animate-pulse"
              style={{ animationDelay: "1s" }}
            />

            {/* Floating Glow - Bottom */}
            <div
              className="absolute bottom-16 right-16 w-28 h-28 rounded-full bg-emerald-400/15 blur-[70px] animate-pulse"
              style={{ animationDelay: "2s" }}
            />

            {/* Content */}
            <div className="relative z-10 flex flex-col justify-center items-center text-center px-10">

              <div className="absolute w-[380px] h-[380px] rounded-full bg-white/[0.03] blur-[90px]" />

              <div className="relative z-10 flex flex-col items-center">

                {/* ================= Premium Icon ================= */}

                <div className="relative mb-10">

                  {/* Outer Glow */}
                  <div className="absolute inset-0 rounded-full bg-[#25D366]/25 blur-2xl scale-125"></div>

                  {/* Glass Circle */}
                  <div className="relative w-28 h-28 rounded-full border border-white/15 bg-white/10 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.35)] flex items-center justify-center">

                    {/* Inner Glow */}
                    <div className="absolute w-20 h-20 rounded-full bg-[#25D366]/15 blur-xl"></div>

                    <FiLock
                      className="relative z-10 text-white"
                      size={44}
                    />

                  </div>

                </div>

                <h1 className="text-[42px] font-extrabold tracking-tight text-white">
                  Reset Password
                </h1>

                <p className="mt-5 max-w-sm text-[17px] leading-8 text-white/80">
                  Create a strong password to keep your WhatsApp CRM account secure.
                </p>

                <div className="mt-12 flex gap-3">

                  <div className="w-3 h-3 rounded-full bg-white/90"></div>

                  <div className="w-3 h-3 rounded-full bg-white/50"></div>

                  <div className="w-3 h-3 rounded-full bg-white/25"></div>

                </div>

              </div>

            </div>

          </div>

          {/* ================= RIGHT PANEL ================= */}

          <div className="lg:col-span-3 flex flex-col justify-center px-8 sm:px-14 lg:px-16 py-14">

            {/* Header */}

            <div className="flex flex-col items-center text-center mb-10">

              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#25D366] to-[#075E54] flex items-center justify-center shadow-xl mb-6">

                <FiLock className="text-white text-3xl" />

              </div>

              <h2 className="text-4xl font-bold text-[#075E54]">
                Create New Password
              </h2>

              <p className="mt-2 text-gray-500">
                Your new password must be different from your previous password.
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

