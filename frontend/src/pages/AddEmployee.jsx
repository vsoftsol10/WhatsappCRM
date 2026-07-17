// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { FiArrowLeft } from "react-icons/fi";
// import useEmployeeStore from "../store/employeeStore";
// import { createEmployee } from "../api/employeeApi";

// function AddEmployee() {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     department: "",
//     designation: "",
//     address: "",
//     role: "USER",
//   });

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       await createEmployee(formData);

//       alert("Employee created successfully!");

//       navigate("/employees");
//     } catch (error) {
//       alert(
//         error.response?.data?.message ||
//           "Failed to create employee"
//       );
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 ml-8 p-8">

//       <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

//         {/* Header */}
//         <div className="bg-[#25D366] px-8 py-6 flex items-center gap-4">

//           <button
//             type="button"
//             onClick={() => navigate("/employees")}
//             className="p-3 rounded-xl bg-white shadow hover:bg-gray-100 transition"
//           >
//             <FiArrowLeft size={20} />
//           </button>

//           <div>
//             <h1 className="text-3xl font-bold text-black">
//               Add Employee
//             </h1>

//             <p className="text-gray-800 mt-1">
//               Create a new employee account
//             </p>
//           </div>

//         </div>

//         <form
//           className="p-8 space-y-8"
//           onSubmit={handleSubmit}
//         >

//           {/* Personal Information */}
//           <div>

//             <h2 className="text-xl font-bold text-black border-b-2 border-[#25D366] pb-2 mb-5">
//               Personal Information
//             </h2>

//             <div className="space-y-5">

//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 placeholder="Full Name"
//                 className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:border-[#25D366] outline-none"
//               />

//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 placeholder="Email Address"
//                 className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:border-[#25D366] outline-none"
//               />

//               <input
//                 type="text"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 placeholder="Phone Number"
//                 className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:border-[#25D366] outline-none"
//               />

//             </div>

//           </div>

//           {/* Work Information */}
//           <div>

//             <h2 className="text-xl font-bold text-black border-b-2 border-[#25D366] pb-2 mb-5">
//               Work Information
//             </h2>

//             <div className="grid md:grid-cols-2 gap-5">

//               <input
//                 type="text"
//                 name="department"
//                 value={formData.department}
//                 onChange={handleChange}
//                 placeholder="Department"
//                 className="border-2 border-gray-300 rounded-xl px-4 py-3 focus:border-[#25D366] outline-none"
//               />

//               <select
//                 name="designation"
//                 value={formData.designation}
//                 onChange={handleChange}
//                 className="border-2 border-gray-300 rounded-xl px-4 py-3 focus:border-[#25D366] outline-none"
//               >
//                 <option value="">Select Designation</option>
//                 <option value="Sales Agent">Sales Agent</option>
//                 <option value="Support Agent">Support Agent</option>
//               </select>

//               <select
//                 name="role"
//                 value={formData.role}
//                 onChange={handleChange}
//                 className="md:col-span-2 border-2 border-gray-300 rounded-xl px-4 py-3 focus:border-[#25D366] outline-none"
//               >
//                 <option value="USER">USER</option>
//                 <option value="ADMIN">ADMIN</option>
//               </select>

//             </div>

//           </div>

//                     {/* Additional Information */}
//           <div>

//             <h2 className="text-xl font-bold text-black border-b-2 border-[#25D366] pb-2 mb-5">
//               Address
//             </h2>

//             <textarea
//               name="address"
//               value={formData.address}
//               onChange={handleChange}
//               rows="4"
//               placeholder="Address"
//               className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:border-[#25D366] outline-none resize-none"
//             />

//           </div>

//           {/* Action Buttons */}
//           <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">

//             <button
//               type="button"
//               onClick={() => navigate("/employees")}
//               className="px-6 py-3 rounded-xl border border-gray-300 bg-white text-gray-700 font-semibold hover:bg-gray-100 transition"
//             >
//               Cancel
//             </button>

//             <button
//               type="submit"
//               className="px-6 py-3 rounded-xl bg-[#25D366] text-black font-semibold hover:bg-[#128C7E] transition"
//             >
//               Create Employee
//             </button>

//           </div>

//         </form>

//       </div>

//     </div>
//   );
// }

// export default AddEmployee;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { createEmployee } from "../api/employeeApi";
import toast from "react-hot-toast";

function AddEmployee() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
    address: "",
    role: "USER",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
    address: "",
    role: "",
  });

  // ===========================
  // HANDLE CHANGE
  // ===========================

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

  // ===========================
  // VALIDATION
  // ===========================

  const validateForm = () => {
    const newErrors = {};

    // Name
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 3) {
      newErrors.name =
        "Name must be at least 3 characters";
    }

    // Email
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email
      )
    ) {
      newErrors.email =
        "Enter a valid email address";
    }

    // Phone
    if (!formData.phone.trim()) {
      newErrors.phone =
        "Phone number is required";
    } else if (
      !/^[6-9]\d{9}$/.test(formData.phone)
    ) {
      newErrors.phone =
        "Enter a valid 10-digit phone number";
    }

    // Department
    if (!formData.department.trim()) {
      newErrors.department =
        "Department is required";
    }

    // Designation
    if (!formData.designation) {
      newErrors.designation =
        "Designation is required";
    }

    // Role
    if (!formData.role) {
      newErrors.role = "Role is required";
    }

    // Address
    if (!formData.address.trim()) {
      newErrors.address =
        "Address is required";
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

    if (!validateForm()) return;

    try {
      await createEmployee(formData);

      toast.success("Employee created successfully!");

      navigate("/employees");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to create employee"
      );
    }
  };

  return (
    <div className="crm-page bg-gray-100">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

        {/* Header */}
        <div className="flex flex-col gap-4 bg-[#25D366] px-5 py-5 sm:flex-row sm:items-center sm:px-8 sm:py-6">

          <button
            type="button"
            onClick={() => navigate("/employees")}
            className="p-3 rounded-xl bg-white shadow hover:bg-gray-100 transition"
          >
            <FiArrowLeft size={20} />
          </button>

          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-black sm:text-3xl">
              Add Employee
            </h1>

            <p className="mt-1 break-words text-gray-800">
              Create a new employee account
            </p>
          </div>

        </div>

        <form
          className="space-y-8 p-5 sm:p-8"
          onSubmit={handleSubmit}
        >

          {/* Personal Information */}
          <div>

            <h2 className="text-xl font-bold text-black border-b-2 border-[#25D366] pb-2 mb-5">
              Personal Information
            </h2>

            <div className="space-y-5">

              {/* Name */}
              <div>
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

              {/* Email */}
              <div>
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

              {/* Phone */}
              <div>
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

          {/* Work Information */}

                    <div>

            <h2 className="text-xl font-bold text-black border-b-2 border-[#25D366] pb-2 mb-5">
              Work Information
            </h2>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              {/* Department */}
              <div>
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

              {/* Designation */}
              <div>
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

              {/* Role */}
              <div className="md:col-span-2">
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={`w-full border-2 rounded-xl px-4 py-3 outline-none transition ${
                    errors.role
                      ? "border-red-500"
                      : "border-gray-300 focus:border-[#25D366]"
                  }`}
                >
                  <option value="USER">
                    USER
                  </option>

                  <option value="ADMIN">
                    ADMIN
                  </option>
                </select>

                {errors.role && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.role}
                  </p>
                )}
              </div>

            </div>

          </div>

          {/* Address */}
          <div>

            <h2 className="text-xl font-bold text-black border-b-2 border-[#25D366] pb-2 mb-5">
              Address
            </h2>

            <div>
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

          {/* Action Buttons */}
          <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-4 sm:flex-row sm:justify-end sm:gap-4">

            <button
              type="button"
              onClick={() =>
                navigate("/employees")
              }
              className="crm-secondary-button"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="crm-primary-button"
            >
              Create Employee
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default AddEmployee;
