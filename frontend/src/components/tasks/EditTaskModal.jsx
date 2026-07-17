// import { useEffect, useState } from "react";
// import toast from "react-hot-toast";

// import useTaskStore from "../../store/taskStore";

// export default function EditTaskModal({
//   isOpen,
//   onClose,
//   task,
// }) {
//   const { editTask, employees, fetchEmployees } =
//     useTaskStore();

//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     priority: "MEDIUM",
//     dueDate: "",
//     assignedToId: "",
//   });

//   const [loadingEmployees, setLoadingEmployees] =
//     useState(true);

//   // Fetch employees safely
//   useEffect(() => {
//     const loadEmployees = async () => {
//       try {
//         setLoadingEmployees(true);
//         await fetchEmployees();
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoadingEmployees(false);
//       }
//     };

//     if (isOpen) {
//       loadEmployees();
//     }
//   }, [isOpen]);

//   // Sync task into form safely
//   useEffect(() => {
//     if (task) {
//       setFormData({
//         title: task.title || "",
//         description: task.description || "",
//         priority: task.priority || "MEDIUM",
//         dueDate: task.dueDate
//           ? task.dueDate.split("T")[0]
//           : "",
//         assignedToId: task.assignedToId || "",
//       });
//     }
//   }, [task]);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       await editTask(task.id, formData);
//       toast.success("Task updated successfully!");
//       onClose();
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to update task");
//     }
//   };

//   if (!isOpen || !task) return null;

//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//       <div className="bg-white w-full max-w-lg rounded-xl p-6">

//         <h2 className="text-xl font-bold mb-4">
//           Edit Task
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-4">

//           {/* TITLE */}
//           <input
//             name="title"
//             value={formData.title}
//             onChange={handleChange}
//             className="w-full border p-2 rounded"
//             required
//           />

//           {/* DESCRIPTION */}
//           <textarea
//             name="description"
//             value={formData.description}
//             onChange={handleChange}
//             className="w-full border p-2 rounded"
//           />

//           {/* PRIORITY */}
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

//           {/* DUE DATE */}
//           <input
//             type="date"
//             name="dueDate"
//             value={formData.dueDate}
//             onChange={handleChange}
//             className="w-full border p-2 rounded"
//           />

//           {/* EMPLOYEE DROPDOWN */}
//           <div>
//             {loadingEmployees ? (
//               <p className="text-sm text-gray-500">
//                 Loading employees...
//               </p>
//             ) : (
//               <select
//                 name="assignedToId"
//                 value={formData.assignedToId}
//                 onChange={handleChange}
//                 className="w-full border p-2 rounded"
//                 required
//               >
//                 <option value="">
//                   Select Employee
//                 </option>

//                 {(employees || []).map((emp) => (
//                   <option
//                     key={emp.id}
//                     value={emp.id}
//                   >
//                     {emp.name} 
//                   </option>
//                 ))}
//               </select>
//             )}
//           </div>

//           {/* BUTTONS */}
//           <div className="flex justify-end gap-3">

//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 border rounded"
//             >
//               Cancel
//             </button>

//             <button
//               type="submit"
//               className="bg-green-600 text-white px-4 py-2 rounded"
//             >
//               Update
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

export default function EditTaskModal({
  isOpen,
  onClose,
  task,
}) {
  const { editTask, employees, fetchEmployees } =
    useTaskStore();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
    dueDate: "",
    assignedToId: "",
  });

  const [errors, setErrors] = useState({});

  const [loadingEmployees, setLoadingEmployees] =
    useState(true);

  // Fetch employees safely
  useEffect(() => {
    const loadEmployees = async () => {
      try {
        setLoadingEmployees(true);
        await fetchEmployees();
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingEmployees(false);
      }
    };

    if (isOpen) {
      loadEmployees();
    }
  }, [isOpen]);

  // Sync task into form safely
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        priority: task.priority || "MEDIUM",
        dueDate: task.dueDate
          ? task.dueDate.split("T")[0]
          : "",
        assignedToId: task.assignedToId || "",
      });

      setErrors({});
    }
  }, [task]);

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
      await editTask(task.id, formData);

      toast.success("Task updated successfully!");

      setErrors({});

      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update task");
    }
  };

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-[#25D366] px-6 py-5 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              Edit Task
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
            {/* TITLE */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Task Title <span className="text-red-500">*</span>
              </label>

              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter task title"
                className={`w-full rounded-lg border px-4 py-3 outline-none ${
                  errors.title
                    ? "border-red-500"
                    : "border-gray-300 focus:border-[#25D366]"
                }`}
              />

              {errors.title && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.title}
                </p>
              )}
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Description <span className="text-red-500">*</span>
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter description"
                className={`w-full rounded-lg border px-4 py-3 outline-none ${
                  errors.description
                    ? "border-red-500"
                    : "border-gray-300 focus:border-[#25D366]"
                }`}
              />

              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            {/* PRIORITY */}
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
                    : "border-gray-300 focus:border-[#25D366]"
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

            {/* DUE DATE */}
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
                    : "border-gray-300 focus:border-[#25D366]"
                }`}
              />

              {errors.dueDate && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.dueDate}
                </p>
              )}
            </div>

            {/* EMPLOYEE DROPDOWN */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Assign Employee <span className="text-red-500">*</span>
              </label>

              {loadingEmployees ? (
                <p className="text-sm text-gray-500">
                  Loading employees...
                </p>
              ) : (
                <>
                  <select
                    name="assignedToId"
                    value={formData.assignedToId}
                    onChange={handleChange}
                    className={`w-full rounded-lg border px-4 py-3 outline-none ${
                      errors.assignedToId
                        ? "border-red-500"
                        : "border-gray-300 focus:border-[#25D366]"
                    }`}
                  >
                    <option value="">
                      Select Employee
                    </option>

                    {(employees || []).map((emp) => (
                      <option
                        key={emp.id}
                        value={emp.id}
                      >
                        {emp.name}
                      </option>
                    ))}
                  </select>

                  {errors.assignedToId && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.assignedToId}
                    </p>
                  )}
                </>
              )}
            </div>

            {/* BUTTONS */}
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
                Update Task
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}