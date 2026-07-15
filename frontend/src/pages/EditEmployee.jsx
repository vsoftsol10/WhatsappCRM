// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { FiArrowLeft } from "react-icons/fi";
// import {
//   getEmployeeById,
//   updateEmployee,
// } from "../api/employeeApi";

// function EditEmployee() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     department: "",
//     designation: "",
//     address: "",
//   });

//   useEffect(() => {
//     const fetchEmployee = async () => {
//       try {
//         const data = await getEmployeeById(id);

//         setFormData({
//           name: data.employee.name || "",
//           email: data.employee.email || "",
//           phone: data.employee.phone || "",
//           department: data.employee.department || "",
//           designation: data.employee.designation || "",
//           address: data.employee.address || "",
//         });
//       } catch (error) {
//         console.error(error);
//         alert("Failed to fetch employee");
//       }
//     };

//     fetchEmployee();
//   }, [id]);

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       await updateEmployee(id, formData);

//       alert("Employee updated successfully!");

//       navigate("/employees");
//     } catch (error) {
//       console.log("Backend response:", error.response?.data);
//       console.error(error);

//       alert(
//         error.response?.data?.message ||
//           "Failed to update employee"
//       );
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 ml-8 p-8">

//       <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

//         {/* Header */}
//         <div className="bg-yellow-400 px-8 py-6 flex items-center gap-4">

//           <button
//             type="button"
//             onClick={() => navigate("/employees")}
//             className="p-3 rounded-xl bg-white shadow hover:bg-gray-100 transition"
//           >
//             <FiArrowLeft size={20} />
//           </button>

//           <div>
//             <h1 className="text-3xl font-bold text-black">
//               Edit Employee
//             </h1>

//             <p className="text-gray-800 mt-1">
//               Update employee information
//             </p>
//           </div>

//         </div>

//         <form
//           className="p-8 space-y-8"
//           onSubmit={handleSubmit}
//         >

//           {/* Personal Information */}
//           <div>

//             <h2 className="text-xl font-bold text-black border-b-2 border-yellow-400 pb-2 mb-5">
//               Personal Information
//             </h2>

//             <div className="space-y-5">

//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 placeholder="Full Name"
//                 className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:border-yellow-400 outline-none"
//               />

//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 placeholder="Email Address"
//                 className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:border-yellow-400 outline-none"
//               />

//               <input
//                 type="text"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 placeholder="Phone Number"
//                 className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:border-yellow-400 outline-none"
//               />

//             </div>

//           </div>

//           {/* Work Information */}
//           <div>

//             <h2 className="text-xl font-bold text-black border-b-2 border-yellow-400 pb-2 mb-5">
//               Work Information
//             </h2>

//             <div className="grid md:grid-cols-2 gap-5">

//               <input
//                 type="text"
//                 name="department"
//                 value={formData.department}
//                 onChange={handleChange}
//                 placeholder="Department"
//                 className="border-2 border-gray-300 rounded-xl px-4 py-3 focus:border-yellow-400 outline-none"
//               />

//               <select
//                 name="designation"
//                 value={formData.designation}
//                 onChange={handleChange}
//                 className="border-2 border-gray-300 rounded-xl px-4 py-3 focus:border-yellow-400 outline-none"
//               >
//                 <option value="">Select Designation</option>
//                 <option value="Sales Agent">Sales Agent</option>
//                 <option value="Support Agent">Support Agent</option>
//               </select>

//             </div>

//           </div>

//                     {/* Additional Information */}
//           <div>

//             <h2 className="text-xl font-bold text-black border-b-2 border-yellow-400 pb-2 mb-5">
//               Address
//             </h2>

//             <textarea
//               name="address"
//               value={formData.address}
//               onChange={handleChange}
//               rows="4"
//               placeholder="Address"
//               className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:border-yellow-400 outline-none resize-none"
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
//               className="px-6 py-3 rounded-xl bg-yellow-400 text-black font-semibold hover:bg-yellow-500 transition"
//             >
//               Update Employee
//             </button>

//           </div>

//         </form>

//       </div>

//     </div>
//   );
// }

// export default EditEmployee;

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import {
  getEmployeeById,
  updateEmployee,
} from "../api/employeeApi";
import toast from "react-hot-toast";

function EditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
    address: "",
    status: "ACTIVE",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const data = await getEmployeeById(id);

        setFormData({
          name: data.employee.name || "",
          email: data.employee.email || "",
          phone: data.employee.phone || "",
          department: data.employee.department || "",
          designation: data.employee.designation || "",
          address: data.employee.address || "",
          status: data.employee.status || "ACTIVE",
        });
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch employee");
      }
    };

    fetchEmployee();
  }, [id]);

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
      await updateEmployee(id, formData);

      toast.success("Employee updated successfully!");

      navigate("/employees");
    } catch (error) {
      console.log("Backend response:", error.response?.data);
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update employee"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 ml-8 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

        {/* Header */}
        <div className="bg-yellow-400 px-8 py-6 flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate("/employees")}
            className="p-3 rounded-xl bg-white shadow hover:bg-gray-100 transition"
          >
            <FiArrowLeft size={20} />
          </button>

          <div>
            <h1 className="text-3xl font-bold text-black">
              Edit Employee
            </h1>

            <p className="text-gray-800 mt-1">
              Update employee information
            </p>
          </div>
        </div>

        <form
          className="p-8 space-y-8"
          onSubmit={handleSubmit}
        >

          {/* Personal Information */}
          <div>

            <h2 className="text-xl font-bold text-black border-b-2 border-yellow-400 pb-2 mb-5">
              Personal Information
            </h2>

            <div className="space-y-5">

              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className={`w-full border-2 rounded-xl px-4 py-3 outline-none ${
                    errors.name
                      ? "border-red-500"
                      : "border-gray-300 focus:border-yellow-400"
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className={`w-full border-2 rounded-xl px-4 py-3 outline-none ${
                    errors.email
                      ? "border-red-500"
                      : "border-gray-300 focus:border-yellow-400"
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className={`w-full border-2 rounded-xl px-4 py-3 outline-none ${
                    errors.phone
                      ? "border-red-500"
                      : "border-gray-300 focus:border-yellow-400"
                  }`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.phone}
                  </p>
                )}
              </div>

            </div>

          </div>

          {/* Work Information */}
          <div>

            <h2 className="text-xl font-bold text-black border-b-2 border-yellow-400 pb-2 mb-5">
              Work Information
            </h2>

            <div className="grid md:grid-cols-2 gap-5">

              <div>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="Department"
                  className={`w-full border-2 rounded-xl px-4 py-3 outline-none ${
                    errors.department
                      ? "border-red-500"
                      : "border-gray-300 focus:border-yellow-400"
                  }`}
                />
                {errors.department && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.department}
                  </p>
                )}
              </div>

              <div>
                <select
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  className={`w-full border-2 rounded-xl px-4 py-3 outline-none ${
                    errors.designation
                      ? "border-red-500"
                      : "border-gray-300 focus:border-yellow-400"
                  }`}
                >
                  <option value="">Select Designation</option>
                  <option value="Sales Agent">Sales Agent</option>
                  <option value="Support Agent">Support Agent</option>
                </select>

                {errors.designation && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.designation}
                  </p>
                )}
              </div>

              <div>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border-2 rounded-xl px-4 py-3 outline-none border-gray-300 focus:border-yellow-400"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>

            </div>

          </div>

          {/* Additional Information */}
          <div>

            <h2 className="text-xl font-bold text-black border-b-2 border-yellow-400 pb-2 mb-5">
              Address
            </h2>

            <div>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="4"
                placeholder="Address"
                className={`w-full border-2 rounded-xl px-4 py-3 outline-none resize-none ${
                  errors.address
                    ? "border-red-500"
                    : "border-gray-300 focus:border-yellow-400"
                }`}
              />

              {errors.address && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.address}
                </p>
              )}
            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">

            <button
              type="button"
              onClick={() => navigate("/employees")}
              className="px-6 py-3 rounded-xl border border-gray-300 bg-white text-gray-700 font-semibold hover:bg-gray-100 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-yellow-400 text-black font-semibold hover:bg-yellow-500 transition"
            >
              Update Employee
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}

export default EditEmployee;