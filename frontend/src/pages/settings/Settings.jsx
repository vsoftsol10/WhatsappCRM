import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/authStore";
import {
  User,
  Mail,
  Building2,
  ShieldCheck,
  Shield,
  Lock,
  ChevronRight,
  Phone,
  MapPin,
  Pencil,
  Camera,
  X,
  Check,
} from "lucide-react";

const PHONE_REGEX = /^[6-9]\d{9}$/;

function Settings() {
  const {
    user,
    updateProfileAction,
    uploadProfileImageAction,
    removeProfileImageAction,
    isLoading,
  } = useAuthStore();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });
  const [errors, setErrors] = useState({});
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const fileInputRef = useRef(null);

  const startEditing = () => {
    setFormData({
      name: user?.name || "",
      phone: user?.phone || "",
      address: user?.address || "",
    });
    setErrors({});
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setErrors({});
    setIsEditing(false);
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim() || formData.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    if (formData.phone && !PHONE_REGEX.test(formData.phone)) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    const result = await updateProfileAction(formData);

    if (result.success) {
      toast.success(result.message || "Profile updated successfully!");
      setIsEditing(false);
    } else {
      toast.error(result.message || "Failed to update profile");
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file later
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, PNG and WEBP images are allowed.");
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      toast.error("Image must be under 15 MB.");
      return;
    }

    setIsUploadingPhoto(true);

    const result = await uploadProfileImageAction(file);

    setIsUploadingPhoto(false);

    if (result.success) {
      toast.success(result.message || "Profile photo updated!");
    } else {
      toast.error(result.message || "Failed to upload photo");
    }
  };

  const handleRemovePhoto = async () => {
    setIsUploadingPhoto(true);

    const result = await removeProfileImageAction();

    setIsUploadingPhoto(false);

    if (result.success) {
      toast.success(result.message || "Profile photo removed!");
    } else {
      toast.error(result.message || "Failed to remove photo");
    }
  };

  return (
    <div className="crm-page bg-slate-50">

      {/* ================= HEADER ================= */}

      <div className="mb-8">
        <h1 className="crm-title text-slate-900">
          Settings
        </h1>

        <p className="mt-2 text-slate-500">
          Manage your profile information and account security.
        </p>
      </div>

      {/* ================= MAIN GRID ================= */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* ================= LEFT PROFILE CARD ================= */}

        <div className="xl:col-span-1">

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

            {/* Banner */}

            <div className="h-28 bg-gradient-to-r from-[#25D366] via-[#25D366] to-[#128C7E]"></div>

            <div className="relative px-6 pb-6">

              {/* Avatar */}

              <div className="-mt-12 flex justify-center">

                <div className="relative h-24 w-24">
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user?.name || "User"}
                      className="h-24 w-24 rounded-3xl border-4 border-white object-cover shadow-lg"
                    />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-3xl border-4 border-white bg-[#25D366] text-4xl font-bold text-black shadow-lg">
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handlePhotoClick}
                    disabled={isUploadingPhoto}
                    title="Change profile photo"
                    className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#128C7E] text-white shadow-md transition hover:bg-[#0f6f5c] disabled:opacity-60"
                  >
                    <Camera size={14} />
                  </button>

                  {user?.profileImage && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      disabled={isUploadingPhoto}
                      title="Remove profile photo"
                      className="absolute -bottom-1 -left-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-red-500 text-white shadow-md transition hover:bg-red-600 disabled:opacity-60"
                    >
                      <X size={14} />
                    </button>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                </div>

              </div>

              {isUploadingPhoto && (
                <p className="mt-2 text-center text-xs text-slate-400">
                  Uploading photo...
                </p>
              )}

              {/* User */}

              <div className="mt-5 text-center">

                <h2 className="text-2xl font-bold text-slate-900">
                  {user?.name || "User"}
                </h2>

                <p className="mt-1 break-all text-sm text-slate-500">
                  {user?.email || "-"}
                </p>

              </div>

              {/* Info */}

              <div className="mt-8 space-y-4">

                {/* Department */}

                <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">

                  <div className="flex items-center gap-3">

                    <div className="rounded-xl bg-[#DCF8C6] p-2">

                      <Building2
                        size={18}
                        className="text-[#25D366]"
                      />

                    </div>

                    <span className="text-sm text-slate-500">
                      Department
                    </span>

                  </div>

                  <span className="font-semibold text-slate-800">
                    {user?.department || "-"}
                  </span>

                </div>

                {/* Role */}

                <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">

                  <div className="flex items-center gap-3">

                    <div className="rounded-xl bg-green-100 p-2">

                      <Shield
                        size={18}
                        className="text-[#128C7E]"
                      />

                    </div>

                    <span className="text-sm text-slate-500">
                      Role
                    </span>

                  </div>

                  <span className="rounded-full bg-[#DCF8C6] px-3 py-1 text-xs font-semibold text-[#128C7E]">
                    {user?.role || "-"}
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* ================= RIGHT CONTENT ================= */}

        <div className="space-y-6 xl:col-span-2">
                    {/* ================= PROFILE INFORMATION ================= */}

          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

            <div className="mb-8 flex items-center justify-between">

              <div>

                <h2 className="text-xl font-bold text-slate-900">
                  Profile Information
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Your personal account information.
                </p>

              </div>

              {!isEditing ? (
                <button
                  type="button"
                  onClick={startEditing}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-[#128C7E]"
                >
                  <Pencil size={15} />
                  Edit
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={cancelEditing}
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                  >
                    <X size={15} />
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-[#128C7E] disabled:opacity-60"
                  >
                    <Check size={15} />
                    {isLoading ? "Saving..." : "Save"}
                  </button>
                </div>
              )}

            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

              {/* Full Name */}

              <div>

                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-600">

                  <User size={16} />

                  Full Name

                </label>

                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, name: e.target.value }));
                        setErrors((prev) => ({ ...prev, name: "" }));
                      }}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 font-medium text-slate-800 outline-none transition focus:border-[#25D366]"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                    )}
                  </>
                ) : (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-medium text-slate-800">
                    {user?.name || "-"}
                  </div>
                )}

              </div>

              {/* Email — read-only, it's the login ID */}

              <div>

                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-600">

                  <Mail size={16} />

                  Email Address

                </label>

                <div className="break-all rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-medium text-slate-800">
                  {user?.email || "-"}
                </div>

              </div>

              {/* Phone */}

              <div>

                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-600">

                  <Phone size={16} />

                  Phone

                </label>

                {isEditing ? (
                  <>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, phone: e.target.value }));
                        setErrors((prev) => ({ ...prev, phone: "" }));
                      }}
                      placeholder="10-digit mobile number"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 font-medium text-slate-800 outline-none transition focus:border-[#25D366]"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                    )}
                  </>
                ) : (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-medium text-slate-800">
                    {user?.phone || "-"}
                  </div>
                )}

              </div>

              {/* Department — read-only, admin-managed */}

              <div>

                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-600">

                  <Building2 size={16} />

                  Department

                </label>

                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-medium text-slate-800">
                  {user?.department || "-"}
                </div>

              </div>

              {/* Address */}

              <div className="md:col-span-2">

                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-600">

                  <MapPin size={16} />

                  Address

                </label>

                {isEditing ? (
                  <textarea
                    value={formData.address}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, address: e.target.value }))
                    }
                    rows={2}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 font-medium text-slate-800 outline-none transition focus:border-[#25D366]"
                  />
                ) : (
                  <div className="whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-medium text-slate-800">
                    {user?.address || "-"}
                  </div>
                )}

              </div>

              {/* Role — read-only, admin-managed */}

              <div>

                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-600">

                  <ShieldCheck size={16} />

                  User Role

                </label>

                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">

                  <span className="inline-flex rounded-full bg-[#DCF8C6] px-3 py-1 text-sm font-semibold text-[#128C7E]">
                    {user?.role || "-"}
                  </span>

                </div>

              </div>

            </div>

          </div>

                    {/* ================= SECURITY CARD ================= */}

          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

              <div className="flex items-start gap-4">

                <div className="rounded-2xl bg-[#DCF8C6] p-4">

                  <Lock
                    size={26}
                    className="text-[#25D366]"
                  />

                </div>

                <div>

                  <h2 className="text-xl font-bold text-slate-900">
                    Password & Security
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    Keep your account secure by updating your password
                    regularly.
                  </p>

                </div>

              </div>

              <Link
                to="/change-password"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 font-semibold text-black transition hover:bg-[#128C7E]"
              >
                Change Password

                <ChevronRight size={18} />

              </Link>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Settings;