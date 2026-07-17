// import { useState } from "react";

// export default function AddDealModal({
//   customers = [],
//   employees = [],
//   onClose,
//   onAdd,
// }) {
//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     customerId: "",
//     assignedToId: "",
//     value: "",
//     stage: "LEAD",
//   });

//   const handleChange = (field, value) => {
//     setForm((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!form.title.trim()) {
//       alert("Title is required");
//       return;
//     }

//     if (!form.customerId) {
//       alert("Please select a customer");
//       return;
//     }

//     try {
//       await onAdd(form);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white w-[500px] p-6 rounded-xl shadow-lg"
//       >
//         <h2 className="text-xl font-semibold mb-5">
//           Add Deal
//         </h2>

//         {/* Title */}
//         <input
//           placeholder="Deal Title"
//           className="w-full border rounded p-2 mb-3"
//           value={form.title}
//           onChange={(e) =>
//             handleChange("title", e.target.value)
//           }
//         />

//         {/* Description */}
//         <textarea
//           placeholder="Description (Optional)"
//           rows={4}
//           className="w-full border rounded p-2 mb-3 resize-none"
//           value={form.description}
//           onChange={(e) =>
//             handleChange("description", e.target.value)
//           }
//         />

//         {/* Customer */}
//         <select
//           className="w-full border rounded p-2 mb-3"
//           value={form.customerId}
//           onChange={(e) =>
//             handleChange("customerId", e.target.value)
//           }
//         >
//           <option value="">
//             Select Customer
//           </option>

//           {customers.map((customer) => (
//             <option
//               key={customer.id}
//               value={customer.id}
//             >
//               {customer.name}
//             </option>
//           ))}
//         </select>

//         {/* Assigned Employee */}
//         <select
//           className="w-full border rounded p-2 mb-3"
//           value={form.assignedToId}
//           onChange={(e) =>
//             handleChange("assignedToId", e.target.value)
//           }
//         >
//           <option value="">
//             Unassigned
//           </option>

//           {employees.map((employee) => (
//             <option
//               key={employee.id}
//               value={employee.id}
//             >
//               {employee.name}
//             </option>
//           ))}
//         </select>

//         {/* Deal Value */}
//         <input
//           type="number"
//           placeholder="Deal Value"
//           className="w-full border rounded p-2 mb-3"
//           value={form.value}
//           onChange={(e) =>
//             handleChange("value", e.target.value)
//           }
//         />

//         {/* Stage */}
//         <select
//           className="w-full border rounded p-2 mb-5"
//           value={form.stage}
//           onChange={(e) =>
//             handleChange("stage", e.target.value)
//           }
//         >
//           <option value="LEAD">Lead</option>
//           <option value="PROPOSAL">Proposal</option>
//           <option value="NEGOTIATION">Negotiation</option>
//           <option value="WON">Won</option>
//           <option value="LOST">Lost</option>
//         </select>

//         {/* Buttons */}
//         <div className="flex justify-end gap-3">
//           <button
//             type="button"
//             onClick={onClose}
//             className="px-4 py-2 border rounded hover:bg-gray-100"
//           >
//             Cancel
//           </button>

//           <button
//             type="submit"
//             className="px-4 py-2 bg-[#25D366] rounded font-semibold hover:bg-[#128C7E]"
//           >
//             Save Deal
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

import { useState } from "react";
import { X } from "lucide-react";

export default function AddDealModal({
  customers = [],
  employees = [],
  onClose,
  onAdd,
}) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    customerId: "",
    assignedToId: "",
    value: "",
    stage: "LEAD",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!form.title.trim()) {
      newErrors.title = "Deal title is required";
    } else if (form.title.trim().length < 3) {
      newErrors.title =
        "Deal title must be at least 3 characters";
    }

    if (!form.customerId) {
      newErrors.customerId = "Please select a customer";
    }

    if (!form.value) {
      newErrors.value = "Deal value is required";
    } else if (Number(form.value) <= 0) {
      newErrors.value = "Deal value must be greater than 0";
    }

    if (!form.stage) {
      newErrors.stage = "Stage is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await onAdd(form);

      setErrors({});
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-[#25D366] px-6 py-5 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              Add Deal
            </h2>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#128C7E] transition"
            >
              <X className="w-[22px] h-[22px]" />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-6 space-y-5 max-h-[75vh] overflow-y-auto"
          >
            {/* Title */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Deal Title <span className="text-red-500">*</span>
              </label>

              <input
                placeholder="Enter deal title"
                className={`w-full rounded-lg border px-4 py-3 outline-none ${
                  errors.title
                    ? "border-red-500"
                    : "border-gray-300 focus:border-[#25D366]"
                }`}
                value={form.title}
                onChange={(e) =>
                  handleChange("title", e.target.value)
                }
              />

              {errors.title && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.title}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Description
              </label>

              <textarea
                placeholder="Enter description (Optional)"
                rows={4}
                className="w-full rounded-lg border px-4 py-3 outline-none border-gray-300 focus:border-[#25D366] resize-none"
                value={form.description}
                onChange={(e) =>
                  handleChange("description", e.target.value)
                }
              />
            </div>

            {/* Customer */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Customer <span className="text-red-500">*</span>
              </label>

              <select
                className={`w-full rounded-lg border px-4 py-3 outline-none ${
                  errors.customerId
                    ? "border-red-500"
                    : "border-gray-300 focus:border-[#25D366]"
                }`}
                value={form.customerId}
                onChange={(e) =>
                  handleChange("customerId", e.target.value)
                }
              >
                <option value="">
                  Select Customer
                </option>

                {customers.map((customer) => (
                  <option
                    key={customer.id}
                    value={customer.id}
                  >
                    {customer.name}
                  </option>
                ))}
              </select>

              {errors.customerId && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.customerId}
                </p>
              )}
            </div>

            {/* Assigned Employee */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Assigned Employee
              </label>

              <select
                className="w-full rounded-lg border px-4 py-3 outline-none border-gray-300 focus:border-[#25D366]"
                value={form.assignedToId}
                onChange={(e) =>
                  handleChange("assignedToId", e.target.value)
                }
              >
                <option value="">
                  Unassigned
                </option>

                {employees.map((employee) => (
                  <option
                    key={employee.id}
                    value={employee.id}
                  >
                    {employee.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Deal Value */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Deal Value <span className="text-red-500">*</span>
              </label>

              <input
                type="number"
                placeholder="Enter deal value"
                className={`w-full rounded-lg border px-4 py-3 outline-none ${
                  errors.value
                    ? "border-red-500"
                    : "border-gray-300 focus:border-[#25D366]"
                }`}
                value={form.value}
                onChange={(e) =>
                  handleChange("value", e.target.value)
                }
              />

              {errors.value && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.value}
                </p>
              )}
            </div>

            {/* Stage */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Stage <span className="text-red-500">*</span>
              </label>

              <select
                className={`w-full rounded-lg border px-4 py-3 outline-none ${
                  errors.stage
                    ? "border-red-500"
                    : "border-gray-300 focus:border-[#25D366]"
                }`}
                value={form.stage}
                onChange={(e) =>
                  handleChange("stage", e.target.value)
                }
              >
                <option value="LEAD">Lead</option>
                <option value="PROPOSAL">Proposal</option>
                <option value="NEGOTIATION">Negotiation</option>
                <option value="WON">Won</option>
                <option value="LOST">Lost</option>
              </select>

              {errors.stage && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.stage}
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
                Save Deal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}