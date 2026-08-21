// import { useEffect, useRef, useState } from "react";
// import { X } from "lucide-react";
// import toast from "react-hot-toast";

// import useCampaignStore from "../../store/campaignStore";

// export default function CreateCampaignModal({
//   isOpen,
//   onClose,
//   campaign,
// }) {
//   const { editCampaign } = useCampaignStore();
//   const [image, setImage] = useState(null);

// const [imagePreview, setImagePreview] = useState("");

// const fileInputRef = useRef(null);

//   const [formData, setFormData] = useState({
//     name: "",
//     type: "PROMOTIONAL",
//     messageContent: "",
//     scheduledAt: "",
//     metaTemplateName: "",
//   });

// useEffect(() => {
//   if (campaign) {
//     console.log(campaign);

//     setFormData({
//       name: campaign.name || "",
//       type: campaign.type || "PROMOTIONAL",
//       messageContent: campaign.messageContent || "",
//       scheduledAt: campaign.scheduledAt
//         ? campaign.scheduledAt.slice(0, 16)
//         : "",
//       metaTemplateName: campaign.metaTemplateName || "",
//     });

//     setImagePreview(campaign.imageUrl || "");
//     setImage(null);
//   }
// }, [campaign]);

//   if (!isOpen) return null;

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleImageChange = (e) => {
//   const file = e.target.files[0];

//   if (!file) return;

//   if (!file.type.startsWith("image/")) {
//     return toast.error("Please select an image.");
//   }

//   if (file.size > 15 * 1024 * 1024) {
//     return toast.error("Maximum image size is 15MB.");
//   }

//   setImage(file);
//   setImagePreview(URL.createObjectURL(file));
// };

// const removeImage = () => {
//   setImage(null);
//   setImagePreview("");

//   if (fileInputRef.current) {
//     fileInputRef.current.value = "";
//   }
// };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       await editCampaign(
//     campaign.id,
//     {
//         ...formData,
//         image,
//     }
// );

//       toast.success("Campaign updated successfully!");

//       setFormData({
//         name: "",
//         type: "PROMOTIONAL",
//         messageContent: "",
//         scheduledAt: "",
//         metaTemplateName: "",
//       });

//       onClose();
//     } catch (error) {
//       toast.error("Failed to update campaign. Please try again.");
//       console.error(error);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
//       <div className="min-h-screen flex items-center justify-center p-4">
//         <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden">
//           {/* Header */}
//           <div className="bg-[#25D366] px-6 py-5 flex justify-between items-center">
//             <h2 className="text-2xl font-bold text-gray-800">
//               Edit Campaign
//             </h2>

//             <button
//               type="button"
//               onClick={onClose}
//               className="p-2 rounded-full hover:bg-[#128C7E] transition"
//             >
//               <X size={22} />
//             </button>
//           </div>

//           {/* Form */}
//           <form
//             onSubmit={handleSubmit}
//             className="p-6 space-y-5 max-h-[75vh] overflow-y-auto"
//           >
//             {/* Campaign Name */}
//             <div>
//               <label className="block mb-2 font-medium text-gray-700">
//                 Campaign Name{" "}
//                 <span className="text-red-500">*</span>
//               </label>

//               <input
//                 type="text"
//                 name="name"
//                 placeholder="Enter campaign name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 required
//                 className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#25D366]"
//               />
//             </div>

//             {/* Campaign Type */}
//             <div>
//               <label className="block mb-2 font-medium text-gray-700">
//                 Campaign Type{" "}
//                 <span className="text-red-500">*</span>
//               </label>

//               <select
//                 name="type"
//                 value={formData.type}
//                 onChange={handleChange}
//                 className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#25D366]"
//               >
//                 <option value="PROMOTIONAL">
//                   Promotional
//                 </option>

//                 <option value="BROADCAST">
//                   Broadcast
//                 </option>

//                 <option value="FOLLOW_UP">
//                   Follow Up
//                 </option>

//                 <option value="ANNOUNCEMENT">
//                   Announcement
//                 </option>
//               </select>
//             </div>

//             {/* Campaign Message */}
//             <div>
//               <label className="block mb-2 font-medium text-gray-700">
//                 Campaign Message{" "}
//                 <span className="text-red-500">*</span>
//               </label>

//               <textarea
//                 rows="5"
//                 name="messageContent"
//                 placeholder="Enter campaign message"
//                 value={formData.messageContent}
//                 onChange={handleChange}
//                 required
//                 className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none resize-none focus:border-[#25D366]"
//               />
//             </div>

//             {/* Scheduled Date */}
//             <div>
//               <label className="block mb-2 font-medium text-gray-700">
//                 Scheduled Date & Time
//               </label>

//               <input
//                 type="datetime-local"
//                 name="scheduledAt"
//                 value={formData.scheduledAt}
//                 onChange={handleChange}
//                 className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#25D366]"
//               />
//             </div>

//             {/* Meta Approved Template Name */}
//             <div>
//               <label className="block mb-2 font-medium text-gray-700">
//                 Meta Approved Template Name (optional)
//               </label>

//               <input
//                 type="text"
//                 name="metaTemplateName"
//                 placeholder="e.g. vedaconnect_campaign — leave blank to use the default"
//                 value={formData.metaTemplateName}
//                 onChange={handleChange}
//                 className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#25D366]"
//               />

//               <p className="mt-1 text-xs text-gray-500">
//                 Only fill this in if this exact message + image was approved
//                 as its own template in WhatsApp Business Manager. Leave
//                 blank to send via the generic template — line breaks won't
//                 be preserved on WhatsApp for that one.
//               </p>
//             </div>

//             <div>

//   <label className="block mb-2 font-medium text-gray-700">
//     Campaign Image
//   </label>

//   <input
//     ref={fileInputRef}
//     type="file"
//     accept="image/*"
//     onChange={handleImageChange}
//     className="hidden"
//   />

//   {!imagePreview ? (

//     <button
//       type="button"
//       onClick={() => fileInputRef.current.click()}
//       className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#25D366] bg-green-50 p-8"
//     >
//       Upload Image
//     </button>

//   ) : (

//     <div className="rounded-xl border p-4">

//       <img
//         src={imagePreview}
//         alt="Campaign"
//         className="max-h-72 w-full object-contain rounded-lg"
//       />

//       <div className="mt-4 flex gap-3">

//         <button
//           type="button"
//           onClick={() => fileInputRef.current.click()}
//           className="rounded-lg bg-[#25D366] px-4 py-2 text-white"
//         >
//           Change Image
//         </button>

//         <button
//           type="button"
//           onClick={removeImage}
//           className="rounded-lg bg-red-500 px-4 py-2 text-white"
//         >
//           Remove
//         </button>

//       </div>

//     </div>

//   )}

// </div>

//             {/* Buttons */}
//             <div className="flex justify-end gap-3 pt-4 border-t mt-6">
//               <button
//                 type="button"
//                 onClick={onClose}
//                 className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
//               >
//                 Cancel
//               </button>

//               <button
//                 type="submit"
//                 className="px-6 py-3 rounded-lg bg-[#25D366] hover:bg-[#128C7E] text-gray-800 font-semibold transition"
//               >
//                 Update Campaign
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";

import useCampaignStore from "../../store/campaignStore";

export default function CreateCampaignModal({
  isOpen,
  onClose,
  campaign,
}) {
  const { editCampaign } = useCampaignStore();
  const [image, setImage] = useState(null);

const [imagePreview, setImagePreview] = useState("");

const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    type: "PROMOTIONAL",
    messageContent: "",
    scheduledAt: "",
    metaTemplateName: "",
    metaTemplateLanguage: "en_US",
  });

useEffect(() => {
  if (campaign) {
    console.log(campaign);

    setFormData({
      name: campaign.name || "",
      type: campaign.type || "PROMOTIONAL",
      messageContent: campaign.messageContent || "",
      scheduledAt: campaign.scheduledAt
        ? campaign.scheduledAt.slice(0, 16)
        : "",
      metaTemplateName: campaign.metaTemplateName || "",
      metaTemplateLanguage: campaign.metaTemplateLanguage || "en_US",
    });

    setImagePreview(campaign.imageUrl || "");
    setImage(null);
  }
}, [campaign]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
  const file = e.target.files[0];

  if (!file) return;

  if (!file.type.startsWith("image/")) {
    return toast.error("Please select an image.");
  }

  if (file.size > 15 * 1024 * 1024) {
    return toast.error("Maximum image size is 15MB.");
  }

  setImage(file);
  setImagePreview(URL.createObjectURL(file));
};

const removeImage = () => {
  setImage(null);
  setImagePreview("");

  if (fileInputRef.current) {
    fileInputRef.current.value = "";
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await editCampaign(
    campaign.id,
    {
        ...formData,
        image,
    }
);

      toast.success("Campaign updated successfully!");

      setFormData({
        name: "",
        type: "PROMOTIONAL",
        messageContent: "",
        scheduledAt: "",
        metaTemplateName: "",
        metaTemplateLanguage: "en_US",
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
          <div className="bg-[#25D366] px-6 py-5 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              Edit Campaign
            </h2>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#128C7E] transition"
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
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#25D366]"
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
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#25D366]"
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
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none resize-none focus:border-[#25D366]"
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
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#25D366]"
              />
            </div>

            {/* Meta Approved Template Name */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Meta Approved Template Name (optional)
              </label>

              <input
                type="text"
                name="metaTemplateName"
                placeholder="e.g. vedaconnect_campaign — leave blank to use the default"
                value={formData.metaTemplateName}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#25D366]"
              />

              <p className="mt-1 text-xs text-gray-500">
                Only fill this in if this exact message + image was approved
                as its own template in WhatsApp Business Manager. Leave
                blank to send via the generic template — line breaks won't
                be preserved on WhatsApp for that one.
              </p>
            </div>

            {/* Meta Template Language */}
            {formData.metaTemplateName && (
              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Meta Template Language
                </label>

                <input
                  type="text"
                  name="metaTemplateLanguage"
                  placeholder="e.g. en_US or en"
                  value={formData.metaTemplateLanguage}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#25D366]"
                />

                <p className="mt-1 text-xs text-gray-500">
                  Must match the language shown for this template in
                  WhatsApp Business Manager exactly (e.g. "en_US" for
                  "English (US)", "en" for plain "English") — a mismatch
                  makes WhatsApp reject the send.
                </p>
              </div>
            )}

            <div>

  <label className="block mb-2 font-medium text-gray-700">
    Campaign Image
  </label>

  <input
    ref={fileInputRef}
    type="file"
    accept="image/*"
    onChange={handleImageChange}
    className="hidden"
  />

  {!imagePreview ? (

    <button
      type="button"
      onClick={() => fileInputRef.current.click()}
      className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#25D366] bg-green-50 p-8"
    >
      Upload Image
    </button>

  ) : (

    <div className="rounded-xl border p-4">

      <img
        src={imagePreview}
        alt="Campaign"
        className="max-h-72 w-full object-contain rounded-lg"
      />

      <div className="mt-4 flex gap-3">

        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          className="rounded-lg bg-[#25D366] px-4 py-2 text-white"
        >
          Change Image
        </button>

        <button
          type="button"
          onClick={removeImage}
          className="rounded-lg bg-red-500 px-4 py-2 text-white"
        >
          Remove
        </button>

      </div>

    </div>

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
                Update Campaign
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}