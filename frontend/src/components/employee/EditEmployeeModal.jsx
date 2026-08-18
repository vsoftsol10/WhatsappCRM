import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { getEmployeeById, updateEmployee } from "../../api/employeeApi";
import toast from "react-hot-toast";

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  department: "",
  designation: "",
  address: "",
  status: "ACTIVE",
};

export default function EditEmployeeModal({
  isOpen,
  employeeId,
  onClose,
  onSuccess,
}) {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen || !employeeId) return;

    const fetchEmployee = async () => {
      try {
        setLoading(true);
        const data = await getEmployeeById(employeeId);

        setFormData({
          name: data.employee.name || "",
          email: data.employee.email || "",
          phone: data.employee.phone || "",
          department: data.employee.department || "",
          designation: data.employee.designation || "",
          address: data.employee.address || "",
          status: data.employee.status || "ACTIVE",
        });
        setErrors({});
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch employee");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [isOpen, employeeId]);

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

    if (!formData.department.trim()) {
      newErrors.department = "Department is required";
    }

    if (!formData.designation.trim()) {
      newErrors.designation = "Designation is required";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
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
      setSubmitting(true);

      await updateEmployee(employeeId, formData);

      toast.success("Employee updated successfully!");

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message || "Failed to update employee"
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
            <h2 className="text-2xl font-bold text-black">Edit Employee</h2>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#128C7E] transition"
            >
              <X size={22} />
            </button>
          </div>

          {loading ? (
            <div className="p-10 text-center text-gray-500">
              Loading employee...
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-8 max-h-[75vh] overflow-y-auto"
            >
              <div>
                <h3 className="text-lg font-bold text-black border-b-2 border-[#25D366] pb-2 mb-5">
                  Personal Information
                </h3>

                <div className="space-y-5">
                  <div>
                    <label className="block mb-2 font-semibold text-gray-700">
                      Full Name <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Full Name"
                      className={`w-full border-2 rounded-xl px-4 py-3 outline-none transition ${
                        errors.name
                          ? "border-red-500"
                          : "border-gray-300 focus:border-[#25D366]"
                      }`}
                    />

                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block mb-2 font-semibold text-gray-700">
                      Email Address <span className="text-red-500">*</span>
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
                      <p className="mt-1 text-sm text-red-500">
                        {errors.email}
                      </p>
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
                      <p className="mt-1 text-sm text-red-500">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-black border-b-2 border-[#25D366] pb-2 mb-5">
                  Work Information
                </h3>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <label className="block mb-2 font-semibold text-gray-700">
                      Department <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      placeholder="Department"
                      className={`w-full border-2 rounded-xl px-4 py-3 outline-none transition ${
                        errors.department
                          ? "border-red-500"
                          : "border-gray-300 focus:border-[#25D366]"
                      }`}
                    />

                    {errors.department && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.department}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block mb-2 font-semibold text-gray-700">
                      Designation <span className="text-red-500">*</span>
                    </label>

                    <select
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                      className={`w-full border-2 rounded-xl px-4 py-3 outline-none transition ${
                        errors.designation
                          ? "border-red-500"
                          : "border-gray-300 focus:border-[#25D366]"
                      }`}
                    >
                      <option value="">Select Designation</option>
                      <option value="Sales Agent">Sales Agent</option>
                      <option value="Support Agent">Support Agent</option>
                      <option value="Technical">Technical</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Manager">Manager</option>
                      <option value="HR">HR</option>
                      <option value="Finance">Finance</option>
                      <option value="Other">Other</option>
                    </select>

                    {errors.designation && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.designation}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block mb-2 font-semibold text-gray-700">
                      Status
                    </label>

                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full border-2 rounded-xl px-4 py-3 outline-none border-gray-300 focus:border-[#25D366]"
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-black border-b-2 border-[#25D366] pb-2 mb-5">
                  Address
                </h3>

                <div>
                  <label className="block mb-2 font-semibold text-gray-700">
                    Address <span className="text-red-500">*</span>
                  </label>

                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Address"
                    className={`w-full resize-none border-2 rounded-xl px-4 py-3 outline-none transition ${
                      errors.address
                        ? "border-red-500"
                        : "border-gray-300 focus:border-[#25D366]"
                    }`}
                  />

                  {errors.address && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.address}
                    </p>
                  )}
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
                  {submitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}