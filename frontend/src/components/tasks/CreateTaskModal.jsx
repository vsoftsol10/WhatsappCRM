// import { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import useTaskStore from "../../store/taskStore";
// import useEmployeeStore from "../../store/employeeStore";

// export default function CreateTaskModal({
//   isOpen,
//   onClose,
// }) {

//   const { addTask } = useTaskStore();

//   const {
//     employees,
//     fetchEmployees,
//   } = useEmployeeStore();

//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     priority: "MEDIUM",
//     dueDate: "",
//     assignedToId: "",
//   });

//   useEffect(() => {
//     fetchEmployees();
//   }, []);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       await addTask(formData);

//       toast.success("Task created successfully!");
//       onClose();

//       setFormData({
//         title: "",
//         description: "",
//         priority: "MEDIUM",
//         dueDate: "",
//         assignedToId: "",
//       });
//     } catch (error) {
//       toast.error("Failed to create task");
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//       <div className="bg-white w-full max-w-lg rounded-xl p-6">
//         <h2 className="text-xl font-bold mb-4">
//           Create Task
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-4">

//           <input
//             name="title"
//             placeholder="Task Title"
//             value={formData.title}
//             onChange={handleChange}
//             className="w-full border p-2 rounded"
//             required
//           />

//           <textarea
//             name="description"
//             placeholder="Description"
//             value={formData.description}
//             onChange={handleChange}
//             className="w-full border p-2 rounded"
//           />

//           <select
//             name="priority"
//             value={formData.priority}
//             onChange={handleChange}
//             className="w-full border p-2 rounded"
//           >
//             <option value="LOW">Low</option>
//             <option value="MEDIUM">Medium</option>
//             <option value="HIGH">High</option>
//           </select>

//           <input
//             type="date"
//             name="dueDate"
//             value={formData.dueDate}
//             onChange={handleChange}
//             className="w-full border p-2 rounded"
//           />

//           {/* REAL EMPLOYEE DROPDOWN */}
//           <select
//             name="assignedToId"
//             value={formData.assignedToId}
//             onChange={handleChange}
//             className="w-full border p-2 rounded"
//             required
//           >
//             <option value="">
//               Select Employee
//             </option>

//             {(employees ?? []).map((emp) => (
//               <option key={emp.id} value={emp.id}>
//                 {emp.name} 
//               </option>
//             ))}
//           </select>

//           <div className="flex justify-end gap-3">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 border rounded"
//             >
//               Cancel
//             </button>

//             <button className="bg-blue-600 text-white px-4 py-2 rounded">
//               Create
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import useTaskStore from "../../store/taskStore";
import useEmployeeStore from "../../store/employeeStore";

export default function CreateTaskModal({
  isOpen,
  onClose,
}) {
  const { addTask } = useTaskStore();

  const {
    employees,
    fetchEmployees,
  } = useEmployeeStore();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
    dueDate: "",
    assignedToId: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchEmployees();
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Task title is required";
    } else if (formData.title.trim().length < 3) {
      newErrors.title =
        "Task title must be at least 3 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.priority) {
      newErrors.priority = "Priority is required";
    }

    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
    }

    if (!formData.assignedToId) {
      newErrors.assignedToId = "Please select an employee";
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
      await addTask(formData);

      toast.success("Task created successfully!");

      setFormData({
        title: "",
        description: "",
        priority: "MEDIUM",
        dueDate: "",
        assignedToId: "",
      });

      setErrors({});

      onClose();
    } catch (error) {
      toast.error("Failed to create task");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-yellow-400 px-6 py-5 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              Create Task
            </h2>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-yellow-500 transition"
            >
              <X size={22} />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-6 space-y-5 max-h-[75vh] overflow-y-auto"
          >
            {/* Title */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Task Title <span className="text-red-500">*</span>
              </label>

              <input
                name="title"
                placeholder="Enter task title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full rounded-lg border px-4 py-3 outline-none ${
                  errors.title
                    ? "border-red-500"
                    : "border-gray-300 focus:border-yellow-400"
                }`}
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
                Description <span className="text-red-500">*</span>
              </label>

              <textarea
                name="description"
                placeholder="Enter description"
                value={formData.description}
                onChange={handleChange}
                className={`w-full rounded-lg border px-4 py-3 outline-none ${
                  errors.description
                    ? "border-red-500"
                    : "border-gray-300 focus:border-yellow-400"
                }`}
              />

              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Priority */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Priority <span className="text-red-500">*</span>
              </label>

              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className={`w-full rounded-lg border px-4 py-3 outline-none ${
                  errors.priority
                    ? "border-red-500"
                    : "border-gray-300 focus:border-yellow-400"
                }`}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>

              {errors.priority && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.priority}
                </p>
              )}
            </div>

            {/* Due Date */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Due Date <span className="text-red-500">*</span>
              </label>

              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className={`w-full rounded-lg border px-4 py-3 outline-none ${
                  errors.dueDate
                    ? "border-red-500"
                    : "border-gray-300 focus:border-yellow-400"
                }`}
              />

              {errors.dueDate && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.dueDate}
                </p>
              )}
            </div>

            {/* Assigned To */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Assign Employee <span className="text-red-500">*</span>
              </label>

              <select
                name="assignedToId"
                value={formData.assignedToId}
                onChange={handleChange}
                className={`w-full rounded-lg border px-4 py-3 outline-none ${
                  errors.assignedToId
                    ? "border-red-500"
                    : "border-gray-300 focus:border-yellow-400"
                }`}
              >
                <option value="">
                  Select Employee
                </option>

                {(employees ?? []).map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name}
                  </option>
                ))}
              </select>

              {errors.assignedToId && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.assignedToId}
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
                className="px-6 py-3 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold transition"
              >
                Create Task
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}