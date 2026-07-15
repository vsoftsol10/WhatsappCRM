// import { useEffect, useState } from "react";
// import { X } from "lucide-react";
// import toast from "react-hot-toast";

// import useCampaignStore from "../../store/campaignStore";

// export default function CreateCampaignModal({
//   isOpen,
//   onClose,
//   campaign,
// }) {
//   const { editCampaign } = useCampaignStore();

//   const [formData, setFormData] = useState({
//     name: "",
//     type: "PROMOTIONAL",
//     messageContent: "",
//     scheduledAt: "",
//   });

//   useEffect(() => {
//     if (campaign) {
//       setFormData({
//         name: campaign.name || "",
//         type: campaign.type || "PROMOTIONAL",
//         messageContent:
//           campaign.messageContent || "",
//         scheduledAt: campaign.scheduledAt
//           ? campaign.scheduledAt.slice(0, 16)
//           : "",
//       });
//     }
//   }, [campaign]);

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
//       await editCampaign(
//         campaign.id,
//         formData
//       );

//       toast.success("Campaign updated successfully!");

//       setFormData({
//         name: "",
//         type: "PROMOTIONAL",
//         messageContent: "",
//         scheduledAt: "",
//       });

//       onClose();
//     } catch (error) {
//       toast.error("Failed to update campaign. Please try again.");

//       console.error(error);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white w-full max-w-xl rounded-2xl p-6">
        
//         {/* HEADER */}

//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-2xl font-bold">
//             Edit Campaign
//           </h2>

//           <button onClick={onClose}>
//             <X />
//           </button>
//         </div>

//         {/* FORM */}

//         <form
//           onSubmit={handleSubmit}
//           className="space-y-4"
//         >
//           <input
//             type="text"
//             name="name"
//             placeholder="Campaign Name"
//             value={formData.name}
//             onChange={handleChange}
//             required
//             className="w-full border rounded-xl p-3"
//           />

//           <select
//             name="type"
//             value={formData.type}
//             onChange={handleChange}
//             className="w-full border rounded-xl p-3"
//           >
//             <option value="PROMOTIONAL">
//               Promotional
//             </option>

//             <option value="BROADCAST">
//               Broadcast
//             </option>

//             <option value="FOLLOW_UP">
//               Follow Up
//             </option>

//             <option value="ANNOUNCEMENT">
//               Announcement
//             </option>
//           </select>

//           <textarea
//             rows="5"
//             name="messageContent"
//             placeholder="Campaign Message"
//             value={formData.messageContent}
//             onChange={handleChange}
//             required
//             className="w-full border rounded-xl p-3"
//           />

//           <input
//             type="datetime-local"
//             name="scheduledAt"
//             value={formData.scheduledAt}
//             onChange={handleChange}
//             className="w-full border rounded-xl p-3"
//           />

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
//               Edit Campaign
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

import useCampaignStore from "../../store/campaignStore";

export default function CreateCampaignModal({
  isOpen,
  onClose,
  campaign,
}) {
  const { editCampaign } = useCampaignStore();

  const [formData, setFormData] = useState({
    name: "",
    type: "PROMOTIONAL",
    messageContent: "",
    scheduledAt: "",
  });

  useEffect(() => {
    if (campaign) {
      setFormData({
        name: campaign.name || "",
        type: campaign.type || "PROMOTIONAL",
        messageContent: campaign.messageContent || "",
        scheduledAt: campaign.scheduledAt
          ? campaign.scheduledAt.slice(0, 16)
          : "",
      });
    }
  }, [campaign]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await editCampaign(campaign.id, formData);

      toast.success("Campaign updated successfully!");

      setFormData({
        name: "",
        type: "PROMOTIONAL",
        messageContent: "",
        scheduledAt: "",
      });

      onClose();
    } catch (error) {
      toast.error("Failed to update campaign. Please try again.");
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
              Edit Campaign
            </h2>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-yellow-500 transition"
            >
              <X size={22} />
            </button>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="p-6 space-y-5 max-h-[75vh] overflow-y-auto"
          >
            {/* Campaign Name */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Campaign Name{" "}
                <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                name="name"
                placeholder="Enter campaign name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-yellow-400"
              />
            </div>

            {/* Campaign Type */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Campaign Type{" "}
                <span className="text-red-500">*</span>
              </label>

              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-yellow-400"
              >
                <option value="PROMOTIONAL">
                  Promotional
                </option>

                <option value="BROADCAST">
                  Broadcast
                </option>

                <option value="FOLLOW_UP">
                  Follow Up
                </option>

                <option value="ANNOUNCEMENT">
                  Announcement
                </option>
              </select>
            </div>

            {/* Campaign Message */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Campaign Message{" "}
                <span className="text-red-500">*</span>
              </label>

              <textarea
                rows="5"
                name="messageContent"
                placeholder="Enter campaign message"
                value={formData.messageContent}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none resize-none focus:border-yellow-400"
              />
            </div>

            {/* Scheduled Date */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Scheduled Date & Time
              </label>

              <input
                type="datetime-local"
                name="scheduledAt"
                value={formData.scheduledAt}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-yellow-400"
              />
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
                Update Campaign
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}