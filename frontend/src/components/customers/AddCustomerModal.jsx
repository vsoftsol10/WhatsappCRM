import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { createCustomer } from "../../api/customerApi";
import toast from "react-hot-toast";

const EMPTY_FORM = {
  name: "",
  phone: "",
  email: "",
  company: "",
  source: "",
  requirements: "",
  status: "ACTIVE",
};

export default function AddCustomerModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(EMPTY_FORM);
      setErrors({});
      setSubmitting(false);
    }
  }, [isOpen]);

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Customer name is required";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Customer name must be at least 3 characters";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }

    // Email is optional — only validate format if something was entered
    if (
      formData.email.trim() &&
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.company.trim()) {
      newErrors.company = "Company name is required";
    }

    if (!formData.status) {
      newErrors.status = "Status is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSubmitting(true);

      await createCustomer(formData);

      toast.success("Customer created successfully!");

      setFormData(EMPTY_FORM);
      setErrors({});

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message || "Failed to create customer"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-[#25D366] px-6 py-5 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-black">Add Customer</h2>

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
            className="p-6 space-y-8 max-h-[75vh] overflow-y-auto"
          >
            <div>
              <h3 className="text-lg font-bold text-black border-b-2 border-[#25D366] pb-2 mb-5">
                Customer Information
              </h3>

              <div className="space-y-5">
                <div>
                  <label className="block mb-2 font-semibold text-gray-700">
                    Customer Name <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Customer Name"
                    className={`w-full border-2 rounded-xl px-4 py-3 outline-none transition ${
                      errors.name
                        ? "border-red-500"
                        : "border-gray-300 focus:border-[#25D366]"
                    }`}
                  />

                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-gray-700">
                    Phone Number <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    className={`w-full border-2 rounded-xl px-4 py-3 outline-none transition ${
                      errors.phone
                        ? "border-red-500"
                        : "border-gray-300 focus:border-[#25D366]"
                    }`}
                  />

                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-gray-700">
                    Email Address{" "}
                    <span className="font-normal text-gray-400">
                      (optional)
                    </span>
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    className={`w-full border-2 rounded-xl px-4 py-3 outline-none transition ${
                      errors.email
                        ? "border-red-500"
                        : "border-gray-300 focus:border-[#25D366]"
                    }`}
                  />

                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-black border-b-2 border-[#25D366] pb-2 mb-5">
                Company Information
              </h3>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="block mb-2 font-semibold text-gray-700">
                    Company <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Company Name"
                    className={`w-full border-2 rounded-xl px-4 py-3 outline-none transition ${
                      errors.company
                        ? "border-red-500"
                        : "border-gray-300 focus:border-[#25D366]"
                    }`}
                  />

                  {errors.company && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.company}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-gray-700">
                    Source
                  </label>

                  <input
                    type="text"
                    name="source"
                    value={formData.source}
                    onChange={handleChange}
                    placeholder="e.g. WhatsApp, Instagram"
                    className="w-full border-2 rounded-xl px-4 py-3 outline-none transition border-gray-300 focus:border-[#25D366]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block mb-2 font-semibold text-gray-700">
                    Status <span className="text-red-500">*</span>
                  </label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className={`w-full border-2 rounded-xl px-4 py-3 outline-none transition ${
                      errors.status
                        ? "border-red-500"
                        : "border-gray-300 focus:border-[#25D366]"
                    }`}
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>

                  {errors.status && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.status}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-black border-b-2 border-[#25D366] pb-2 mb-5">
                Requirements
              </h3>

              <div>
                <label className="block mb-2 font-semibold text-gray-700">
                  Requirements
                </label>

                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Customer requirements"
                  className="w-full resize-none border-2 rounded-xl px-4 py-3 outline-none transition border-gray-300 focus:border-[#25D366]"
                />
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-4 sm:flex-row sm:justify-end sm:gap-4">
              <button
                type="button"
                onClick={onClose}
                className="crm-secondary-button"
                disabled={submitting}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="crm-primary-button"
                disabled={submitting}
              >
                {submitting ? "Creating..." : "Create Customer"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}