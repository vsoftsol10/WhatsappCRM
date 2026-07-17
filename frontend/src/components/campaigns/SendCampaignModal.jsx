// import { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import { X, Send, Loader2 } from "lucide-react";

// import { getCustomers } from "../../api/customerApi";
// import useCampaignStore from "../../store/campaignStore";

// export default function SendCampaignModal({
//   isOpen,
//   onClose,
//   campaign,
// }) {
//  const { sendCampaign } =
//   useCampaignStore();

//   const [customers, setCustomers] = useState([]);
//   const [selectedCustomers, setSelectedCustomers] =
//     useState([]);
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (isOpen) {
//       fetchCustomers();
//       setSelectedCustomers([]);
//       setSearch("");
//     }
//   }, [isOpen]);

//   // const fetchCustomers = async () => {
//   //   try {
//   //     const response = await getCustomers();

//   //     if (Array.isArray(response)) {
//   //       setCustomers(response);
//   //     } else if (Array.isArray(response.data)) {
//   //       setCustomers(response.data);
//   //     } else {
//   //       setCustomers([]);
//   //     }
//   //   } catch (error) {
//   //     console.log(error);
//   //     setCustomers([]);
//   //   }
//   // };

//   const fetchCustomers = async () => {
//     try {
//       const response = await getCustomers();

//       console.log("Customers Response:", response);

//       if (Array.isArray(response)) {
//         setCustomers(response);
//       } else if (Array.isArray(response.customers)) {
//         setCustomers(response.customers);
//       } else {
//         setCustomers([]);
//       }
//     } catch (error) {
//       console.log(error);
//       setCustomers([]);
//     }
//   };

//   if (!isOpen || !campaign) return null;

//   const filteredCustomers = customers.filter(
//     (customer) => {
//       const keyword = search.toLowerCase();

//       return (
//         customer.name
//           ?.toLowerCase()
//           .includes(keyword) ||
//         customer.phone
//           ?.toLowerCase()
//           .includes(keyword)
//       );
//     }
//   );

//   const toggleCustomer = (id) => {
//     if (selectedCustomers.includes(id)) {
//       setSelectedCustomers((prev) =>
//         prev.filter((item) => item !== id)
//       );
//     } else {
//       setSelectedCustomers((prev) => [
//         ...prev,
//         id,
//       ]);
//     }
//   };

//   const handleSend = async () => {
//     if (selectedCustomers.length === 0) {
//       return toast.error(
//         "Please select at least one customer."
//       );
//     }

//     try {
//       setLoading(true);

//       const response =
//   await sendCampaign(
//     campaign.id,
//     selectedCustomers
//   );

//       toast.success(
//         response.message ||
//           "Campaign sent successfully"
//       );

//       setSelectedCustomers([]);

//       onClose();
//     } catch (error) {
//       console.log(error);

//       toast.error(
//         error?.response?.data?.message ||
//           "Unable to send campaign."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-3 sm:p-4">

//       <div className="flex max-h-[90vh] w-full max-w-xl flex-col rounded-2xl bg-white shadow-xl">

//         {/* Header */}

//         <div className="flex items-center justify-between gap-4 border-b bg-[#25D366] px-5 py-4 sm:px-6">

//           <div className="min-w-0">

//             <h2 className="text-xl font-bold text-black sm:text-2xl">
//               Send Campaign
//             </h2>

//             <p className="mt-1 truncate text-sm text-gray-800">
//               {campaign.name}
//             </p>

//           </div>

//           <button
//             onClick={onClose}
//             disabled={loading}
//           >
//             <X />
//           </button>

//         </div>

//         {/* Search */}

//         <div className="p-5">

//           <input
//             type="text"
//             placeholder="Search customer..."
//             value={search}
//             onChange={(e) =>
//               setSearch(e.target.value)
//             }
//             className="crm-input"
//           />

//         </div>

//         {/* Customer List */}

//         <div className="flex-1 overflow-y-auto px-5">

//           {filteredCustomers.length === 0 ? (

//             <div className="text-center py-10 text-gray-500">
//               No Customers Found
//             </div>

//           ) : (

//             filteredCustomers.map((customer) => (

//               <div
//                 key={customer.id}
//                 className="mb-3 flex items-center justify-between gap-3 rounded-xl border p-4 hover:bg-[#DCF8C6]"
//               >

//                 <div className="min-w-0">

//                   <h3 className="break-words font-semibold">
//                     {customer.name}
//                   </h3>

//                   <p className="break-all text-sm text-gray-500">
//                     {customer.phone}
//                   </p>

//                 </div>

//                 <input
//                   type="checkbox"
//                   checked={selectedCustomers.includes(
//                     customer.id
//                   )}
//                   onChange={() =>
//                     toggleCustomer(customer.id)
//                   }
//                   className="h-5 w-5 shrink-0 cursor-pointer accent-[#25D366]"
//                 />

//               </div>

//             ))

//           )}

//         </div>

//         {/* Footer */}

//         <div className="flex flex-col gap-4 border-t p-5 sm:flex-row sm:items-center sm:justify-between">

//           <span className="text-gray-600 font-medium">

//             Selected : {selectedCustomers.length}

//           </span>

//           <div className="flex flex-col-reverse gap-3 sm:flex-row">

//             <button
//               onClick={onClose}
//               disabled={loading}
//               className="crm-secondary-button"
//             >
//               Cancel
//             </button>

//             <button
//               onClick={handleSend}
//               disabled={
//                 loading ||
//                 selectedCustomers.length === 0
//               }
//               className="crm-primary-button disabled:bg-gray-300"
//             >

//               {loading ? (
//                 <>
//                   <Loader2
//                     size={18}
//                     className="animate-spin"
//                   />
//                   Sending...
//                 </>
//               ) : (
//                 <>
//                   <Send size={18} />
//                   Send Campaign
//                 </>
//               )}

//             </button>

//           </div>

//         </div>

//       </div>

//     </div>
//   );
// }

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  X,
  Send,
  Loader2,
} from "lucide-react";

import { getCustomers } from "../../api/customerApi";
import { getCampaignRecipients } from "../../api/campaignApi";
import useCampaignStore from "../../store/campaignStore";

export default function SendCampaignModal({
  isOpen,
  onClose,
  campaign,
}) {
  const { sendCampaign } = useCampaignStore();

  const [customers, setCustomers] = useState([]);
  const [selectedCustomers, setSelectedCustomers] =
    useState([]);

  // Already sent customers
  const [sentCustomers, setSentCustomers] =
    useState([]);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // ===========================
  // LOAD DATA
  // ===========================
  useEffect(() => {
    if (isOpen && campaign) {
      fetchCustomers();
      fetchSentCustomers();

      setSelectedCustomers([]);
      setSearch("");
    }
  }, [isOpen, campaign]);

  // ===========================
  // GET CUSTOMERS
  // ===========================
  const fetchCustomers = async () => {
    try {
      const response = await getCustomers();

      console.log("Customers Response:", response);

      if (Array.isArray(response)) {
        setCustomers(response);
      } else if (Array.isArray(response.customers)) {
        setCustomers(response.customers);
      } else if (Array.isArray(response.data)) {
        setCustomers(response.data);
      } else {
        setCustomers([]);
      }
    } catch (error) {
      console.log(error);
      setCustomers([]);
    }
  };

  // ===========================
  // GET ALREADY SENT CUSTOMERS
  // ===========================
const fetchSentCustomers = async () => {
  try {

    const response =
      await getCampaignRecipients(campaign.id);

    console.log("Campaign ID:", campaign.id);
    console.log("Recipients Response:", response);
    console.log("Recipients Data:", response.data);

    if (Array.isArray(response.data)) {
      setSentCustomers(response.data);

      console.log("Saved IDs:", response.data);
    } else {
      setSentCustomers([]);
    }

  } catch (error) {

    console.log("Recipients Error:", error);

    setSentCustomers([]);

  }
};

  if (!isOpen || !campaign) return null;

  // ===========================
  // FILTER
  // ===========================
  const filteredCustomers = customers.filter(
    (customer) => {
      const keyword = search.toLowerCase();

      return (
        customer.name
          ?.toLowerCase()
          .includes(keyword) ||
        customer.phone
          ?.toLowerCase()
          .includes(keyword)
      );
    }
  );

  // ===========================
  // SELECT CUSTOMER
  // ===========================
  const toggleCustomer = (id) => {

    // Don't allow selecting
    // already sent customers
    if (sentCustomers.includes(id)) {
      return;
    }

    if (selectedCustomers.includes(id)) {

      setSelectedCustomers((prev) =>
        prev.filter(
          (item) => item !== id
        )
      );

    } else {

      setSelectedCustomers((prev) => [
        ...prev,
        id,
      ]);

    }
  };

  // ===========================
  // SEND CAMPAIGN
  // ===========================
  const handleSend = async () => {

    if (selectedCustomers.length === 0) {

      return toast.error(
        "Please select at least one customer."
      );

    }

    try {

      setLoading(true);

      const response =
        await sendCampaign(
          campaign.id,
          selectedCustomers
        );

      toast.success(
        response.message ||
          "Campaign sent successfully"
      );

      // Refresh recipients
      await fetchSentCustomers();

      setSelectedCustomers([]);

      onClose();

    } catch (error) {

      console.log(error);

      toast.error(
        error?.response?.data?.message ||
          "Unable to send campaign."
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] flex flex-col">

        {/* Header */}

        <div className="border-b px-6 py-4 flex justify-between items-center">

          <div>

            <h2 className="text-2xl font-bold">
              Send Campaign
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              {campaign.name}
            </p>

          </div>

          <button
            onClick={onClose}
            disabled={loading}
          >
            <X />
          </button>

        </div>

        {/* Search */}

        <div className="p-5">

          <input
            type="text"
            placeholder="Search customer..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-green-500 outline-none"
          />

        </div>
                {/* Customer List */}

        <div className="flex-1 overflow-y-auto px-5">

          {filteredCustomers.length === 0 ? (

            <div className="text-center py-10 text-gray-500">
              No Customers Found
            </div>

          ) : (

            filteredCustomers.map((customer) => {

              const alreadySent =
                sentCustomers.includes(customer.id);

              const selected =
                selectedCustomers.includes(customer.id);

              return (

                <div
                  key={customer.id}
                  onClick={() => {
                    if (!alreadySent) {
                      toggleCustomer(customer.id);
                    }
                  }}
                  className={`
                    flex justify-between items-center
                    border rounded-xl p-4 mb-3
                    transition-all duration-200

                    ${
                      alreadySent
                        ? "opacity-50 bg-gray-100 cursor-not-allowed"
                        : "hover:bg-gray-50 cursor-pointer"
                    }

                    ${
                      selected
                        ? "ring-2 ring-green-500 border-green-500"
                        : ""
                    }
                  `}
                >

                  <div>

                    <h3 className="font-semibold">
                      {customer.name}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {customer.phone}
                    </p>

                    {alreadySent && (
                      <span className="inline-flex items-center mt-2 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                        ✓ Already Sent
                      </span>
                    )}

                  </div>

                  <input
                    type="checkbox"

                    disabled={alreadySent}

                    checked={selected}

                    onClick={(e) =>
                      e.stopPropagation()
                    }

                    onChange={() =>
                      toggleCustomer(customer.id)
                    }

                    className={`w-5 h-5 ${
                      alreadySent
                        ? "cursor-not-allowed opacity-40"
                        : "cursor-pointer"
                    }`}
                  />

                </div>

              );

            })

          )}

        </div>
                {/* Footer */}

        <div className="border-t p-5 flex justify-between items-center">

          <span className="text-gray-600 font-medium">
            Selected : {selectedCustomers.length}
          </span>

          <div className="flex gap-3">

            <button
              onClick={onClose}
              disabled={loading}
              className="border rounded-xl px-5 py-2 hover:bg-gray-100 transition"
            >
              Cancel
            </button>

            <button
              onClick={handleSend}
              disabled={
                loading ||
                selectedCustomers.length === 0
              }
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-xl px-6 py-2 flex items-center gap-2 transition"
            >
              {loading ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Send Campaign
                </>
              )}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}