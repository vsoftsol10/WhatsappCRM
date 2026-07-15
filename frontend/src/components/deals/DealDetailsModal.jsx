// import DealActivity from "./DealActivity";

// export default function DealDetailsModal({
//   isOpen,
//   onClose,
//   deal,
// }) {
//   if (!isOpen || !deal) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
//       <div className="bg-white w-[750px] max-h-[85vh] overflow-hidden rounded-2xl shadow-2xl flex flex-col">

//         {/* HEADER */}
//         <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50">

//           <div>
//             <h2 className="text-xl font-bold text-gray-800">
//               Activity Timeline
//             </h2>

//             <p className="text-sm text-gray-500">
//               {deal.title}
//               {deal.customer?.name
//                 ? ` • ${deal.customer.name}`
//                 : ""}
//             </p>
//           </div>

//           <button
//             onClick={onClose}
//             className="text-2xl hover:text-red-500"
//           >
//             ✕
//           </button>

//         </div>

//         {/* BODY */}
//         <div className="p-6 overflow-y-auto">
//           <DealActivity dealId={deal.id} />
//         </div>

//       </div>
//     </div>
//   );
// }

import { useEffect } from "react";
import DealActivity from "./DealActivity";
import useDealStore from "../../store/dealStore";

export default function DealDetailsModal({
  isOpen,
  onClose,
  deal,
}) {
  const { fetchDealById, selectedDeal, isLoading } =
    useDealStore();

  // Fetch full deal + activities when modal opens
//   useEffect(() => {
//   if (isOpen && deal?.id) {
//     console.log("Fetching deal...");
//     fetchDealById(deal.id);
//   }
// }, [isOpen, deal?.id]);

  if (!isOpen || !deal) return null;

  const data = selectedDeal || deal;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-[750px] max-h-[85vh] overflow-hidden rounded-2xl shadow-2xl flex flex-col">

        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Activity Timeline
            </h2>

            <p className="text-sm text-gray-500">
              {data.title}
              {data.customer?.name
                ? ` • ${data.customer.name}`
                : ""}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-2xl hover:text-red-500"
          >
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 overflow-y-auto">
          {isLoading && !selectedDeal ? (
            <p className="text-gray-500">Loading deal...</p>
          ) : (
            <DealActivity dealId={data.id} />
          )}
        </div>
      </div>
    </div>
  );
}