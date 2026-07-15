// import { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import { X, Send, Loader2 } from "lucide-react";

// import { getCustomers } from "../../api/customerApi";
// import useTemplateStore from "../../store/templateStore";

// export default function SendTemplateModal({
//   isOpen,
//   onClose,
//   template,
// }) {
//   const { sendTemplate } = useTemplateStore();

//   const [customers, setCustomers] = useState([]);
//   const [selectedCustomer, setSelectedCustomer] =
//     useState([]);

//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (isOpen) {
//       fetchCustomers();
//       setSelectedCustomer([]);
//       setSearch("");
//     }
//   }, [isOpen]);

//   const fetchCustomers = async () => {
//     try {
//       const response = await getCustomers();

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

//   if (!isOpen || !template) return null;

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
//     if (!selectedCustomers.length === 0) {
//       return toast.error(
//         "Please select a customer."
//       );
//     }

//     try {
//       setLoading(true);

//       const response =
//         await sendTemplate(
//           template.id,
//           selectedCustomers
//         );

//       toast.success(
//         response.message ||
//           "Template sent successfully."
//       );

//       onClose();
//     } catch (error) {
//       console.log(error);

//       toast.error(
//         error?.response?.data?.message ||
//           "Failed to send template."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
//       <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] flex flex-col">

//         {/* HEADER */}

//         <div className="border-b px-6 py-4 flex justify-between items-center">
//           <div>
//             <h2 className="text-2xl font-bold">
//               Send Template
//             </h2>

//             <p className="text-gray-500 text-sm mt-1">
//               {template.name}
//             </p>
//           </div>

//           <button
//             onClick={onClose}
//             disabled={loading}
//           >
//             <X />
//           </button>
//         </div>

//         {/* SEARCH */}

//         <div className="p-5">
//           <input
//             type="text"
//             placeholder="Search customer..."
//             value={search}
//             onChange={(e) =>
//               setSearch(e.target.value)
//             }
//             className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-green-500"
//           />
//         </div>

//         {/* CUSTOMER LIST */}

//         <div className="flex-1 overflow-y-auto px-5">

//           {filteredCustomers.length === 0 ? (
//             <div className="text-center py-10 text-gray-500">
//               No Customers Found
//             </div>
//           ) : (
//             filteredCustomers.map((customer) => (
//               <div
//                 key={customer.id}
//                 className="flex justify-between items-center border rounded-xl p-4 mb-3 hover:bg-gray-50"
//               >
//                 <div>
//                   <h3 className="font-semibold">
//                     {customer.name}
//                   </h3>

//                   <p className="text-sm text-gray-500">
//                     {customer.phone}
//                   </p>
//                 </div>

//                 <input
//                   type="checkbox"
//                   checked={selectedCustomers.includes(customer.id)}
//                   onChange={() => toggleCustomer(customer.id)}
//                   className="w-5 h-5 cursor-pointer"
//                 />
//               </div>
//             ))
//           )}

//         </div>

//         {/* FOOTER */}

//         <div className="border-t p-5 flex justify-between items-center">

//           <span className="text-gray-600 font-medium">
//             {selectedCustomer
//               ? "1 Customer Selected"
//               : "No Customer Selected"}
//           </span>

//           <div className="flex gap-3">

//             <button
//               onClick={onClose}
//               disabled={loading}
//               className="border rounded-xl px-5 py-2"
//             >
//               Cancel
//             </button>

//             <button
//               onClick={handleSend}
//               disabled={
//                 loading || !selectedCustomer
//               }
//               className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-xl px-6 py-2 flex items-center gap-2"
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
//                   Send Template
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
import { X, Send, Loader2 } from "lucide-react";

import { getCustomers } from "../../api/customerApi";
import useTemplateStore from "../../store/templateStore";

export default function SendTemplateModal({
  isOpen,
  onClose,
  template,
}) {
  const { sendTemplate } = useTemplateStore();

  const [customers, setCustomers] = useState([]);
  const [selectedCustomers, setSelectedCustomers] =
    useState([]);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCustomers();
      setSelectedCustomers([]);
      setSearch("");
    }
  }, [isOpen]);

  const fetchCustomers = async () => {
    try {
      const response = await getCustomers();

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

  if (!isOpen || !template) return null;

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

  const toggleCustomer = (id) => {
    if (selectedCustomers.includes(id)) {
      setSelectedCustomers((prev) =>
        prev.filter((item) => item !== id)
      );
    } else {
      setSelectedCustomers((prev) => [
        ...prev,
        id,
      ]);
    }
  };

  const handleSend = async () => {
    if (selectedCustomers.length === 0) {
      return toast.error(
        "Please select at least one customer."
      );
    }

    try {
      setLoading(true);

      const response =
        await sendTemplate(
          template.id,
          selectedCustomers
        );

      toast.success(
        response.message ||
          "Template sent successfully."
      );

      setSelectedCustomers([]);

      onClose();
    } catch (error) {
      console.log(error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to send template."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] flex flex-col">

        {/* HEADER */}

        <div className="border-b px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">
              Send Template
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              {template.name}
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={loading}
          >
            <X />
          </button>
        </div>

        {/* SEARCH */}

        <div className="p-5">
          <input
            type="text"
            placeholder="Search customer..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* CUSTOMER LIST */}

        <div className="flex-1 overflow-y-auto px-5">

          {filteredCustomers.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No Customers Found
            </div>
          ) : (
            filteredCustomers.map((customer) => (
              <div
                key={customer.id}
                className="flex justify-between items-center border rounded-xl p-4 mb-3 hover:bg-gray-50"
              >
                <div>
                  <h3 className="font-semibold">
                    {customer.name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {customer.phone}
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={selectedCustomers.includes(
                    customer.id
                  )}
                  onChange={() =>
                    toggleCustomer(customer.id)
                  }
                  className="w-5 h-5 cursor-pointer"
                />
              </div>
            ))
          )}

        </div>

        {/* FOOTER */}

        <div className="border-t p-5 flex justify-between items-center">

          <span className="text-gray-600 font-medium">
            Selected : {selectedCustomers.length}
          </span>

          <div className="flex gap-3">

            <button
              onClick={onClose}
              disabled={loading}
              className="border rounded-xl px-5 py-2"
            >
              Cancel
            </button>

            <button
              onClick={handleSend}
              disabled={
                loading ||
                selectedCustomers.length === 0
              }
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-xl px-6 py-2 flex items-center gap-2"
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
                  Send Template
                </>
              )}
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}