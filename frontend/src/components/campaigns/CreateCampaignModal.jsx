// import { useState, useEffect } from "react";
// import { X } from "lucide-react";
// import { getCustomers } from "../../api/customerApi";
// import useCampaignStore from "../../store/campaignStore";
// import toast from "react-hot-toast";

// export default function CreateCampaignModal({
// isOpen,
// onClose,
// }) {
// const [customers, setCustomers] = useState([]);
// const [selectedCustomers, setSelectedCustomers] =
// useState([]);

// const { addCampaign } = useCampaignStore();

// const [formData, setFormData] = useState({
// name: "",
// type: "PROMOTIONAL",
// messageContent: "",
// scheduledAt: "",
// });

// useEffect(() => {
// const fetchCustomers = async () => {
// try {
// const data = await getCustomers();


//     setCustomers(
//       data.customers ||
//         data.data ||
//         []
//     );
//   } catch (error) {
//     console.error(error);
//   }
// };

// if (isOpen) {
//   fetchCustomers();
// }


// }, [isOpen]);

// if (!isOpen) return null;

// const handleChange = (e) => {
// setFormData({
// ...formData,
// [e.target.name]:
// e.target.value,
// });
// };

// const toggleCustomer = (id) => {
// setSelectedCustomers((prev) =>
// prev.includes(id)
// ? prev.filter(
// (item) => item !== id
// )
// : [...prev, id]
// );
// };

// const handleSubmit = async (e) => {
// e.preventDefault();


// try {
//   await addCampaign({
//     ...formData,
//     customerIds:
//       selectedCustomers,
//   });

//   toast.success("Campaign created successfully!");

//   setFormData({
//     name: "",
//     type: "PROMOTIONAL",
//     messageContent: "",
//     scheduledAt: "",
//   });

//   setSelectedCustomers([]);

//   onClose();
// } catch (error) {
//   toast.error("Failed to create campaign!");

//   console.error(error);
// }


// };

// return ( <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"> <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl p-6">


//     {/* HEADER */}

//     <div className="flex items-center justify-between mb-6">
//       <h2 className="text-2xl font-bold">
//         Create Campaign
//       </h2>

//       <button
//         onClick={onClose}
//         className="text-gray-500 hover:text-black"
//       >
//         <X />
//       </button>
//     </div>

//     {/* FORM */}

//     <form
//       onSubmit={handleSubmit}
//       className="space-y-4"
//     >
//       <input
//         type="text"
//         name="name"
//         placeholder="Campaign Name"
//         value={formData.name}
//         onChange={
//           handleChange
//         }
//         required
//         className="w-full border rounded-xl p-3"
//       />

//       <select
//         name="type"
//         value={formData.type}
//         onChange={
//           handleChange
//         }
//         className="w-full border rounded-xl p-3"
//       >
//         <option value="PROMOTIONAL">
//           Promotional
//         </option>

//         <option value="BROADCAST">
//           Broadcast
//         </option>

//         <option value="FOLLOW_UP">
//           Follow Up
//         </option>

//         <option value="ANNOUNCEMENT">
//           Announcement
//         </option>
//       </select>

//       <textarea
//         rows="5"
//         name="messageContent"
//         placeholder="Campaign Message"
//         value={
//           formData.messageContent
//         }
//         onChange={
//           handleChange
//         }
//         required
//         className="w-full border rounded-xl p-3"
//       />

//       <input
//         type="datetime-local"
//         name="scheduledAt"
//         value={
//           formData.scheduledAt
//         }
//         onChange={
//           handleChange
//         }
//         className="w-full border rounded-xl p-3"
//       />

//       {/* AUDIENCE */}

//       <div className="border rounded-xl p-4">
//         <h3 className="font-semibold mb-3">
//           Select Audience
//         </h3>

//         <div className="max-h-48 overflow-y-auto space-y-2">
//           {customers.map(
//             (customer) => (
//               <label
//                 key={
//                   customer.id
//                 }
//                 className="flex items-center gap-3"
//               >
//                 <input
//                   type="checkbox"
//                   checked={selectedCustomers.includes(
//                     customer.id
//                   )}
//                   onChange={() =>
//                     toggleCustomer(
//                       customer.id
//                     )
//                   }
//                 />

//                 <span>
//                   {
//                     customer.name
//                   }
//                 </span>
//               </label>
//             )
//           )}
//         </div>

//         <p className="mt-3 text-sm font-medium text-blue-600">
//           Selected Customers:
//           {" "}
//           {
//             selectedCustomers.length
//           }
//         </p>
//       </div>

//       {/* ACTIONS */}

//       <div className="flex justify-end gap-3 pt-2">
//         <button
//           type="button"
//           onClick={
//             onClose
//           }
//           className="border px-4 py-2 rounded-xl"
//         >
//           Cancel
//         </button>

//         <button
//           type="submit"
//           className="bg-blue-600 text-white px-5 py-2 rounded-xl font-medium"
//         >
//           Create Campaign
//         </button>
//       </div>
//     </form>
//   </div>
// </div>


// );
// }

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";

import { getCustomers } from "../../api/customerApi";
import useCampaignStore from "../../store/campaignStore";

export default function CreateCampaignModal({
  isOpen,
  onClose,
  aiCampaign, // ⭐ NEW ADDED PROP
}) {
  const { addCampaign } = useCampaignStore();

  const [customers, setCustomers] = useState([]);

  const [selectedCustomers, setSelectedCustomers] =
    useState([]);

  const [formData, setFormData] = useState({
    name: "",
    type: "PROMOTIONAL",
    messageContent: "",
    scheduledAt: "",
  });

  // =========================
  // FETCH CUSTOMERS
  // =========================
  useEffect(() => {
    if (!isOpen) return;
    fetchCustomers();
  }, [isOpen]);

  const fetchCustomers = async () => {
    try {
      const response = await getCustomers();
      console.log("Customers Response:", response);

      if (Array.isArray(response)) {
        setCustomers(response);
      } else if (Array.isArray(response.customers)) {
        setCustomers(response.customers);
      } else {
        setCustomers([]);
      }
    } catch (error) {
      console.log(error);
      setCustomers([]);
    }
  };

  // =========================
  // ⭐ AI AUTO FILL EFFECT
  // =========================
  useEffect(() => {
    if (aiCampaign) {
      setFormData((prev) => ({
        ...prev,
        name: aiCampaign.name || "",
        type: aiCampaign.type || "PROMOTIONAL",
        messageContent: aiCampaign.messageContent || "",
      }));
    }
  }, [aiCampaign]);

  if (!isOpen) return null;

  // =========================
  // HANDLE INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // =========================
  // TOGGLE CUSTOMER
  // =========================
  const toggleCustomer = (id) => {
    if (selectedCustomers.includes(id)) {
      setSelectedCustomers(
        selectedCustomers.filter((item) => item !== id)
      );
    } else {
      setSelectedCustomers([...selectedCustomers, id]);
    }
  };

  // =========================
  // SUBMIT CAMPAIGN
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedCustomers.length === 0) {
      return toast.error(
        "Please select at least one customer."
      );
    }

    try {
      await addCampaign({
        ...formData,
        customerIds: selectedCustomers,
      });

      toast.success("Campaign Created");

      // reset form
      setFormData({
        name: "",
        type: "PROMOTIONAL",
        messageContent: "",
        scheduledAt: "",
      });

      setSelectedCustomers([]);

      onClose();
    } catch (error) {
      toast.error("Unable to create campaign");
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-yellow-400 px-6 py-5 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              Create Campaign
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
                Campaign Name <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                name="name"
                placeholder="Enter campaign name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded-lg border px-4 py-3 outline-none border-gray-300 focus:border-yellow-400"
              />
            </div>

            {/* Type */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Type <span className="text-red-500">*</span>
              </label>

              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full rounded-lg border px-4 py-3 outline-none border-gray-300 focus:border-yellow-400"
              >
                <option value="PROMOTIONAL">Promotional</option>
                <option value="BROADCAST">Broadcast</option>
                <option value="FOLLOW_UP">Follow Up</option>
                <option value="ANNOUNCEMENT">Announcement</option>
              </select>
            </div>

            {/* Message */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Message Content
              </label>

              <textarea
                rows="5"
                name="messageContent"
                placeholder="Enter campaign message"
                value={formData.messageContent}
                onChange={handleChange}
                className="w-full rounded-lg border px-4 py-3 outline-none border-gray-300 focus:border-yellow-400 resize-none"
              />
            </div>

            {/* Schedule */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Scheduled At
              </label>

              <input
                type="datetime-local"
                name="scheduledAt"
                value={formData.scheduledAt}
                onChange={handleChange}
                className="w-full rounded-lg border px-4 py-3 outline-none border-gray-300 focus:border-yellow-400"
              />
            </div>

            {/* Customers */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Select Customers <span className="text-red-500">*</span>
              </label>

              <div className="border rounded-lg p-4 bg-gray-50 border-gray-300">
                <div className="max-h-52 overflow-y-auto space-y-2">
                  {Array.isArray(customers) &&
                    customers.map((customer) => (
                      <label
                        key={customer.id}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCustomers.includes(
                            customer.id
                          )}
                          onChange={() =>
                            toggleCustomer(customer.id)
                          }
                          className="w-4 h-4 rounded text-yellow-500 focus:ring-yellow-400"
                        />

                        <span className="text-gray-700">
                          {customer.name}
                        </span>
                      </label>
                    ))}
                </div>

                <p className="text-yellow-600 font-semibold mt-3 text-sm">
                  Selected: {selectedCustomers.length}
                </p>
              </div>
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
                Create Campaign
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}