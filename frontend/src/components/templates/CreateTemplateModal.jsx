// import { useState } from "react";
// import { X } from "lucide-react";
// import useTemplateStore from "../../store/templateStore";
// import toast from "react-hot-toast";

// export default function CreateTemplateModal({
//   isOpen,
//   onClose,
// }) {
//   const { addTemplate } = useTemplateStore();

//   const [formData, setFormData] = useState({
//     name: "",
//     category: "SUPPORT",
//     messageType: "TEXT",
//     content: "",
//     status: "DRAFT",
//   });

//   if (!isOpen) return null;

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       await addTemplate(formData);

//       toast.success("Template created successfully!");

//       setFormData({
//         name: "",
//         category: "SUPPORT",
//         messageType: "TEXT",
//         content: "",
//         status: "DRAFT",
//       });

//       onClose();
//     } catch (error) {
//       toast.error("Failed to create template!");
//       console.error(error);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl p-6">

//         {/* HEADER */}
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-2xl font-bold">
//             Create Template
//           </h2>

//           <button
//             onClick={onClose}
//             className="text-gray-500 hover:text-black"
//           >
//             <X />
//           </button>
//         </div>

//         {/* FORM */}
//         <form onSubmit={handleSubmit} className="space-y-4">

//           <input
//             type="text"
//             name="name"
//             placeholder="Template Name"
//             value={formData.name}
//             onChange={handleChange}
//             required
//             className="w-full border rounded-xl p-3"
//           />

//           <select
//             name="category"
//             value={formData.category}
//             onChange={handleChange}
//             className="w-full border rounded-xl p-3"
//           >
//             <option value="MARKETING">Marketing</option>
//             <option value="SUPPORT">Support</option>
//           </select>

//           <select
//             name="messageType"
//             value={formData.messageType}
//             onChange={handleChange}
//             className="w-full border rounded-xl p-3"
//           >
//             <option value="TEXT">Text</option>
//             <option value="IMAGE">Image</option>
//             <option value="MEDIA">Media</option>
//           </select>

//           <textarea
//             rows="5"
//             name="content"
//             placeholder="Template Content"
//             value={formData.content}
//             onChange={handleChange}
//             required
//             className="w-full border rounded-xl p-3"
//           />

//           <select
//             name="status"
//             value={formData.status}
//             onChange={handleChange}
//             className="w-full border rounded-xl p-3"
//           >
//             <option value="DRAFT">Draft</option>
//             <option value="APPROVED">Approved</option>
//             <option value="INACTIVE">Inactive</option>
//           </select>

//           {/* ACTIONS */}
//           <div className="flex justify-end gap-3 pt-2">
//             <button
//               type="button"
//               onClick={onClose}
//               className="border px-4 py-2 rounded-xl"
//             >
//               Cancel
//             </button>

//             <button
//               type="submit"
//               className="bg-blue-600 text-white px-5 py-2 rounded-xl font-medium"
//             >
//               Create Template
//             </button>
//           </div>

//         </form>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { X } from "lucide-react";
import useTemplateStore from "../../store/templateStore";
import toast from "react-hot-toast";

export default function CreateTemplateModal({
  isOpen,
  onClose,
}) {
  const { addTemplate } = useTemplateStore();

  const [formData, setFormData] = useState({
    name: "",
    category: "SUPPORT",
    messageType: "TEXT",
    content: "",
    status: "DRAFT",
  });

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Template name is required";
    } else if (formData.name.trim().length < 3) {
      newErrors.name =
        "Template name must be at least 3 characters";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.messageType) {
      newErrors.messageType = "Message type is required";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Template content is required";
    } else if (formData.content.trim().length < 10) {
      newErrors.content =
        "Template content must be at least 10 characters";
    }

    if (!formData.status) {
      newErrors.status = "Status is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await addTemplate(formData);

      toast.success("Template created successfully!");

      setFormData({
        name: "",
        category: "SUPPORT",
        messageType: "TEXT",
        content: "",
        status: "DRAFT",
      });

      setErrors({});

      onClose();
    } catch (error) {
      toast.error("Failed to create template!");
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-yellow-400 px-6 py-5 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              Create Template
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
            {/* Name */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Template Name <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                name="name"
                placeholder="Enter template name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full rounded-lg border px-4 py-3 outline-none ${
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

            {/* Category */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Category <span className="text-red-500">*</span>
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full rounded-lg border px-4 py-3 outline-none ${
                  errors.category
                    ? "border-red-500"
                    : "border-gray-300 focus:border-yellow-400"
                }`}
              >
                <option value="MARKETING">Marketing</option>
                <option value="SUPPORT">Support</option>
              </select>

              {errors.category && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.category}
                </p>
              )}
            </div>

            {/* Message Type */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Message Type <span className="text-red-500">*</span>
              </label>

              <select
                name="messageType"
                value={formData.messageType}
                onChange={handleChange}
                className={`w-full rounded-lg border px-4 py-3 outline-none ${
                  errors.messageType
                    ? "border-red-500"
                    : "border-gray-300 focus:border-yellow-400"
                }`}
              >
                <option value="TEXT">Text</option>
                <option value="IMAGE">Image</option>
                <option value="MEDIA">Media</option>
              </select>

              {errors.messageType && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.messageType}
                </p>
              )}
            </div>

            {/* Content */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Template Content <span className="text-red-500">*</span>
              </label>

              <textarea
                rows="5"
                name="content"
                placeholder="Enter template content"
                value={formData.content}
                onChange={handleChange}
                className={`w-full rounded-lg border px-4 py-3 outline-none ${
                  errors.content
                    ? "border-red-500"
                    : "border-gray-300 focus:border-yellow-400"
                }`}
              />

              {errors.content && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.content}
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
                className={`w-full rounded-lg border px-4 py-3 outline-none ${
                  errors.status
                    ? "border-red-500"
                    : "border-gray-300 focus:border-yellow-400"
                }`}
              >
                <option value="DRAFT">Draft</option>
                <option value="APPROVED">Approved</option>
                <option value="INACTIVE">Inactive</option>
              </select>

              {errors.status && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.status}
                </p>
              )}
            </div>

            {/* Actions */}
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
                Create Template
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}