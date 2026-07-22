import { useState } from "react";
import { X } from "lucide-react";
import useLeadStore from "../../store/leadStore";
import toast from "react-hot-toast";

export default function AddLeadModal({
  isOpen,
  onClose,
}) {
  if (!isOpen) return null;

  const { addLead } = useLeadStore();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    source: "",
    company: "",
    requirements: "",
    status: "NEW",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = "Enter a valid 10-digit Indian phone number";
    }

    if (!formData.source.trim()) {
      newErrors.source = "Source is required";
    }

    if (!formData.requirements.trim()) {
      newErrors.requirements = "Requirements are required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  try {
    await addLead(formData);

    toast.success("Lead created successfully");

    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      source: "",
      requirements: "",
      status: "NEW",
    });

    setErrors({});

    onClose();
  } catch (error) {
    console.error(error);

    toast.error(
      error?.response?.data?.message ||
      "Failed to create lead"
    );
  }
};

  return (
    <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-[#25D366] px-6 py-5 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              Add Lead
            </h2>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#128C7E] transition"
            >
              <X size={22} />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-6 space-y-5 max-h-[75vh] overflow-y-auto"
          >
            {/* Name */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Name <span className="text-red-500">*</span>
              </label>

              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                type="text"
                placeholder="Enter lead name"
                className={`w-full rounded-lg border px-4 py-3 outline-none ${
                  errors.name
                    ? "border-red-500"
                    : "border-gray-300 focus:border-[#25D366]"
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                className={`w-full rounded-lg border px-4 py-3 outline-none ${
                  errors.email
                    ? "border-red-500"
                    : "border-gray-300 focus:border-[#25D366]"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Phone Number <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className={`w-full rounded-lg border px-4 py-3 outline-none ${
                  errors.phone
                    ? "border-red-500"
                    : "border-gray-300 focus:border-[#25D366]"
                }`}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Company */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Company
              </label>

              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Enter company name"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#25D366]"
              />
            </div>

            {/* Source */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Source <span className="text-red-500">*</span>
              </label>

              {/* <input
                type="text"
                name="source"
                value={formData.source}
                onChange={handleChange}
                placeholder="Enter lead source"
                className={`w-full rounded-lg border px-4 py-3 outline-none ${
                  errors.source
                    ? "border-red-500"
                    : "border-gray-300 focus:border-[#25D366]"
                }`}
              /> */}
              <select
                name="source"
                value={formData.source}
                onChange={handleChange}
                className={`w-full rounded-lg border px-4 py-3 outline-none ${
                  errors.source
                    ? "border-red-500"
                    : "border-gray-300 focus:border-[#25D366]"
                }`}
              >
                <option value="">Select Source</option>
                <option value="Website">Website</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Facebook">Facebook</option>
                <option value="Instagram">Instagram</option>
                <option value="Referral">Referral</option>
              </select>
              {errors.source && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.source}
                </p>
              )}
            </div>

            {/* Status */}
              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Status <span className="text-red-500">*</span>
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#25D366]"
                >
                  <option value="NEW">New</option>
                  <option value="CONTACTED">Contacted</option>
                  <option value="QUALIFIED">Qualified</option>
                  <option value="WON">Won</option>
                </select>
              </div>

            {/* Requirements */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Requirements <span className="text-red-500">*</span>
              </label>

              <textarea
                rows="4"
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                placeholder="Enter lead requirements"
                className={`w-full rounded-lg border px-4 py-3 outline-none resize-none ${
                  errors.requirements
                    ? "border-red-500"
                    : "border-gray-300 focus:border-[#25D366]"
                }`}
              />
              {errors.requirements && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.requirements}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-3 rounded-lg bg-[#25D366] hover:bg-[#128C7E] text-gray-800 font-semibold transition"
              >
                Save Lead
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}