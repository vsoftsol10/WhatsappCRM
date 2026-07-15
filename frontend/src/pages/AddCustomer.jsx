// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { createCustomer } from "../api/customerApi";

// function AddCustomer() {
//   const [formData, setFormData] = useState({
//     name: "",
//     phone: "",
//     email: "",
//     company: "",
//     status: "ACTIVE",
//   });

//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//   e.preventDefault();

//   console.log(formData);

//   try {
//     const response = await createCustomer(formData);

//     console.log(response);

//     alert("Customer created successfully!");

//     navigate("/customers");
//   } catch (error) {
//     console.error(error);
//     alert("Failed to create customer");
//   }
// };

//   return (
//     <form className="min-h-screen ml-8.5 bg-black text-white p-8" onSubmit={handleSubmit}>
//       <div className="max-w-3xl mx-auto">
//         <h1 className="text-4xl font-bold text-yellow-400 mb-2">
//           Add Customer
//         </h1>

//         <p className="text-gray-400 mb-8">
//           Create a new customer record
//         </p>

//         <div className="bg-white rounded-2xl shadow-xl p-8 text-black">
//           <div className="space-y-6">
//             {/* Name */}
//             <div>
//               <label className="block mb-2 font-semibold">
//                 Customer Name
//               </label>

//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 placeholder="Enter customer name"
//                 className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-yellow-400"
//               />
//             </div>

//             {/* Phone */}
//             <div>
//               <label className="block mb-2 font-semibold">
//                 Phone Number
//               </label>

//               <input
//                 type="text"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 placeholder="Enter phone number"
//                 className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-yellow-400"
//               />
//             </div>

//             {/* Email */}
//             <div>
//               <label className="block mb-2 font-semibold">
//                 Email
//               </label>

//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 placeholder="Enter email"
//                 className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-yellow-400"
//               />
//             </div>

//             {/* Company */}
//             <div>
//               <label className="block mb-2 font-semibold">
//                 Company
//               </label>

//               <input
//                 type="text"
//                 name="company"
//                 value={formData.company}
//                 onChange={handleChange}
//                 placeholder="Enter company name"
//                 className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-yellow-400"
//               />
//             </div>

//             {/* Status */}
//             <div>
//               <label className="block mb-2 font-semibold">
//                 Status
//               </label>

//               <select
//                 name="status"
//                 value={formData.status}
//                 onChange={handleChange}
//                 className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-yellow-400"
//               >
//                 <option value="ACTIVE">ACTIVE</option>
//                 <option value="INACTIVE">INACTIVE</option>
//               </select>
//             </div>

//             {/* Button */}
//            <button
//               type="submit"
//               className="w-full bg-yellow-400 text-black py-3 rounded-lg font-bold hover:bg-yellow-300 transition"
//             >
//               Create Customer
//             </button>
//           </div>
//         </div>
//       </div>
//     </form>
//   );
// }

// export default AddCustomer;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { createCustomer } from "../api/customerApi";
import toast from "react-hot-toast";

function AddCustomer() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    company: "",
    source: "",
    requirements: "",
    status: "ACTIVE",
  });

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Customer name is required";
    } else if (formData.name.trim().length < 3) {
      newErrors.name =
        "Customer name must be at least 3 characters";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone =
        "Enter a valid 10-digit Indian phone number";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
        formData.email
      )
    ) {
      newErrors.email =
        "Enter a valid email address";
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
      await createCustomer(formData);

      toast.success("Customer created successfully!");

      navigate("/customers");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create customer");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 ml-8 p-8">

      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

        {/* Header */}
        <div className="bg-yellow-400 px-8 py-6 flex items-center gap-4">

          <button
            type="button"
            onClick={() => navigate("/customers")}
            className="p-3 rounded-xl bg-white shadow hover:bg-gray-100 transition"
          >
            <FiArrowLeft size={20} />
          </button>

          <div>
            <h1 className="text-3xl font-bold text-black">
              Add Customer
            </h1>

            <p className="text-gray-800 mt-1">
              Create a new customer record
            </p>
          </div>

        </div>

        <form
          onSubmit={handleSubmit}
          className="p-8 space-y-6"
        >

          {/* Customer Name */}
          <div>
            <label className="block mb-2 font-semibold text-black">
              Customer Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter customer name"
              className={`w-full border rounded-lg px-4 py-3 outline-none ${
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

          {/* Phone */}
          <div>
            <label className="block mb-2 font-semibold text-black">
              Phone Number
            </label>

            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              className={`w-full border rounded-lg px-4 py-3 outline-none ${
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

          {/* Email */}
          <div>
            <label className="block mb-2 font-semibold text-black">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              className={`w-full border rounded-lg px-4 py-3 outline-none ${
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

                    {/* Company */}
          <div>
            <label className="block mb-2 font-semibold text-black">
              Company
            </label>

            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Enter company name"
              className={`w-full border rounded-lg px-4 py-3 outline-none ${
                errors.company
                  ? "border-red-500"
                  : "border-gray-300 focus:border-yellow-400"
              }`}
            />

            {errors.company && (
              <p className="text-red-500 text-sm mt-1">
                {errors.company}
              </p>
            )}
          </div>

          {/* Source */}
          <div>
            <label className="block mb-2 font-semibold text-black">
              Source
            </label>

            <input
              type="text"
              name="source"
              value={formData.source}
              onChange={handleChange}
              placeholder="Enter source (e.g. WhatsApp, Instagram)"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-yellow-400"
            />
          </div>

          {/* Requirements */}
          <div>
            <label className="block mb-2 font-semibold text-black">
              Requirements
            </label>

            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              rows={4}
              placeholder="Enter customer requirements"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-yellow-400 resize-none"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block mb-2 font-semibold text-black">
              Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={`w-full border rounded-lg px-4 py-3 outline-none ${
                errors.status
                  ? "border-red-500"
                  : "border-gray-300 focus:border-yellow-400"
              }`}
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>

            {errors.status && (
              <p className="text-red-500 text-sm mt-1">
                {errors.status}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">

            <button
              type="button"
              onClick={() => navigate("/customers")}
              className="px-6 py-3 rounded-xl border border-gray-300 bg-white text-gray-700 font-semibold hover:bg-gray-100 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-yellow-400 text-black font-semibold hover:bg-yellow-500 transition"
            >
              Create Customer
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default AddCustomer;