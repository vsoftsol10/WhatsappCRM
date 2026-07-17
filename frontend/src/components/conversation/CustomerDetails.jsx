// import {
//   FaPhoneAlt,
//   FaEnvelope,
//   FaMapMarkerAlt,
// } from "react-icons/fa";

// function CustomerDetails({ customer }) {
//   if (!customer) {
//     return (
//       <div className="flex h-full w-full items-center justify-center bg-white p-6">
//         <p className="text-gray-500">
//           Select a conversation
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="h-full w-full overflow-y-auto bg-white">
//       {/* Header */}
//       <div className="flex flex-col items-center border-b border-gray-200 p-5 sm:p-6">
//         <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#25D366] text-2xl font-bold text-black sm:h-24 sm:w-24 sm:text-3xl">
//           {customer.customer?.name?.charAt(0)}
//         </div>

//         <h2 className="mt-4 max-w-full break-words text-center text-xl font-semibold text-gray-800">
//           {customer.customer?.name}
//         </h2>

//         <p className="text-sm text-gray-500">
//           Customer
//         </p>
//       </div>

//       {/* Details */}
//       <div className="space-y-6 p-5 sm:p-6">
//         {/* Phone */}
//         <div>
//           <div className="flex items-center gap-3 text-gray-700">
//             <FaPhoneAlt className="text-[#25D366]" />

//             <div>
//               <p className="text-sm text-gray-500">
//                 Phone
//               </p>

//               <p className="font-medium">
//                 {customer.customer?.phone || "-"}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Email */}
//         <div>
//           <div className="flex items-center gap-3 text-gray-700">
//             <FaEnvelope className="text-[#25D366]" />

//             <div>
//               <p className="text-sm text-gray-500">
//                 Email
//               </p>

//               <p className="font-medium break-all">
//                 {customer.customer?.email || "-"}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Address */}
//         <div>
//           <div className="flex items-start gap-3 text-gray-700">
//             <FaMapMarkerAlt className="mt-1 text-[#25D366]" />

//             <div>
//               <p className="text-sm text-gray-500">
//                 Address
//               </p>

//               <p className="break-words font-medium">
//                 {customer.customer?.address || "-"}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Additional Information */}
//         <div className="border-t border-gray-200 pt-6">
//           <h3 className="text-gray-800 font-semibold mb-4">
//             Additional Information
//           </h3>

//           <div className="space-y-3">
//             <div>
//               <p className="text-sm text-gray-500">
//                 Status
//               </p>

//               <p className="font-medium">
//                 {customer.customer?.status || "Active"}
//               </p>
//             </div>

//             <div>
//               <p className="text-sm text-gray-500">
//                 Created At
//               </p>

//               <p className="font-medium">
//                 {new Date(customer.createdAt).toLocaleString()}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default CustomerDetails;

import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaArrowLeft,
} from "react-icons/fa";

function CustomerDetails({
  customer,
  showCustomerDetails,
  setShowCustomerDetails,
}) {
  if (!customer) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-white p-6">
        <p className="text-gray-500">
          Select a conversation
        </p>
      </div>
    );
  }

  const customerInfo = (
    <>
      {/* Header */}
      <div className="flex flex-col items-center border-b border-gray-200 p-5 sm:p-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#25D366] text-2xl font-bold text-white sm:h-24 sm:w-24 sm:text-3xl">
          {customer.customer?.name?.charAt(0)}
        </div>

        <h2 className="mt-4 max-w-full break-words text-center text-xl font-semibold text-gray-800">
          {customer.customer?.name}
        </h2>

        <p className="text-sm text-gray-500">
          Customer
        </p>
      </div>

      {/* Details */}
      <div className="space-y-6 p-5 sm:p-6">
        {/* Phone */}
        <div className="flex items-center gap-3 text-gray-700">
          <FaPhoneAlt className="text-[#128C7E]" />

          <div>
            <p className="text-sm text-gray-500">
              Phone
            </p>

            <p className="font-medium">
              {customer.customer?.phone || "-"}
            </p>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-center gap-3 text-gray-700">
          <FaEnvelope className="text-[#128C7E]" />

          <div>
            <p className="text-sm text-gray-500">
              Email
            </p>

            <p className="break-all font-medium">
              {customer.customer?.email || "-"}
            </p>
          </div>
        </div>

        {/* Address */}
        <div className="flex items-start gap-3 text-gray-700">
          <FaMapMarkerAlt className="mt-1 text-[#128C7E]" />

          <div>
            <p className="text-sm text-gray-500">
              Address
            </p>

            <p className="break-words font-medium">
              {customer.customer?.address || "-"}
            </p>
          </div>
        </div>

        {/* Additional Information */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="mb-4 font-semibold text-gray-800">
            Additional Information
          </h3>

          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">
                Status
              </p>

              <p className="font-semibold text-[#25D366]">
                {customer.customer?.status || "Active"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Created At
              </p>

              <p className="font-medium">
                {new Date(customer.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop */}
      <div className="hidden h-full w-full overflow-y-auto bg-white lg:block">
        {customerInfo}
      </div>

      {/* Mobile */}
      {showCustomerDetails && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white lg:hidden">
          <div className="flex h-16 items-center gap-4 border-b border-gray-200 px-4">
            <button
              onClick={() => setShowCustomerDetails(false)}
              className="rounded-full p-2 transition hover:bg-gray-100"
            >
              <FaArrowLeft size={18} />
            </button>

            <h2 className="text-lg font-semibold">
              Contact Info
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto">
            {customerInfo}
          </div>
        </div>
      )}
    </>
  );
}

export default CustomerDetails;
