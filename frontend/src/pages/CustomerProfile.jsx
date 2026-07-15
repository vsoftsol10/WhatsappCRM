// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { getCustomerById } from "../api/customerApi";
// import { FaArrowLeft } from "react-icons/fa";

// function CustomerProfile() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [customer, setCustomer] = useState(null);

//   useEffect(() => {
//     const fetchCustomer = async () => {
//       try {
//         const data = await getCustomerById(id);
//         setCustomer(data.customer);
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     fetchCustomer();
//   }, [id]);

//   if (!customer) {
//     return (
//       <div className="min-h-screen bg-black text-white flex justify-center items-center">
//         Loading...
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen ml-8.5 bg-black text-white p-8">
//       <div className="max-w-5xl mx-auto">

//         {/* Header */}
//         <div className="flex items-center gap-4 mb-8">
//           <button
//             onClick={() => navigate("/customers")}
//             className="bg-gray-800 hover:bg-gray-700 p-3 rounded-lg transition"
//           >
//             <FaArrowLeft className="text-yellow-400" />
//           </button>

//           <h1 className="text-4xl font-bold text-yellow-400">
//             Customer Profile
//           </h1>
//         </div>

//         {/* Customer Information */}
//         <div className="bg-white text-black rounded-2xl p-8 mb-8 shadow-xl">
//           <h2 className="text-2xl font-bold mb-6">
//             Customer Information
//           </h2>

//           <div className="grid grid-cols-2 gap-6">

//             <div>
//               <p className="text-gray-500">Name</p>
//               <p className="font-semibold">{customer.name}</p>
//             </div>

//             <div>
//               <p className="text-gray-500">Phone</p>
//               <p className="font-semibold">{customer.phone}</p>
//             </div>

//             <div>
//               <p className="text-gray-500">Email</p>
//               <p className="font-semibold">{customer.email || "-"}</p>
//             </div>

//             <div>
//               <p className="text-gray-500">Company</p>
//               <p className="font-semibold">{customer.company || "-"}</p>
//             </div>

//             <div>
//               <p className="text-gray-500">Status</p>
//               <p className="font-semibold">{customer.status}</p>
//             </div>

//             <div>
//               <p className="text-gray-500">Created At</p>
//               <p className="font-semibold">
//                 {new Date(customer.createdAt).toLocaleDateString()}
//               </p>
//             </div>

//           </div>
//         </div>

//         {/* Activity Timeline */}
//         <div className="bg-white text-black rounded-2xl p-8 shadow-xl">
//           <h2 className="text-2xl font-bold mb-6">
//             Activity Timeline
//           </h2>

//           <div className="space-y-4">

//             <div className="border-l-4 border-yellow-400 pl-4">
//               <h3 className="font-semibold">
//                 Customer Created
//               </h3>
//               <p className="text-gray-500">
//                 {new Date(customer.createdAt).toLocaleString()}
//               </p>
//             </div>

//             <div className="border-l-4 border-blue-500 pl-4">
//               <h3 className="font-semibold">
//                 Profile Updated
//               </h3>
//               <p className="text-gray-500">
//                 {new Date(customer.updatedAt).toLocaleString()}
//               </p>
//             </div>

//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }

// export default CustomerProfile;

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCustomerById } from "../api/customerApi";
import { FaArrowLeft } from "react-icons/fa";

function CustomerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const data = await getCustomerById(id);
        setCustomer(data.customer);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCustomer();
  }, [id]);

  if (!customer) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-700 flex justify-center items-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen ml-8.5 bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">

          <button
            onClick={() => navigate("/customers")}
            className="
              bg-white 
              border 
              border-gray-200
              hover:bg-gray-100
              p-3 
              rounded-lg 
              transition
              shadow-sm
            "
          >
            <FaArrowLeft className="text-yellow-500" />
          </button>

          <h1 className="text-4xl font-bold text-gray-900">
            Customer Profile
          </h1>

        </div>


        {/* Customer Information */}
        <div className="bg-white rounded-2xl p-8 mb-8 shadow-sm border border-gray-100">

          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Customer Information
          </h2>


          <div className="grid grid-cols-2 gap-6">

            <div>
              <p className="text-gray-500 text-sm">
                Name
              </p>
              <p className="font-semibold text-gray-900">
                {customer.name}
              </p>
            </div>


            <div>
              <p className="text-gray-500 text-sm">
                Phone
              </p>
              <p className="font-semibold text-gray-900">
                {customer.phone}
              </p>
            </div>


            <div>
              <p className="text-gray-500 text-sm">
                Email
              </p>
              <p className="font-semibold text-gray-900">
                {customer.email || "-"}
              </p>
            </div>


            <div>
              <p className="text-gray-500 text-sm">
                Company
              </p>
              <p className="font-semibold text-gray-900">
                {customer.company || "-"}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">
                Source
              </p>

              <p className="font-semibold text-gray-900">
                {customer.source || "-"}
              </p>
            </div>

            <div className="col-span-2">
              <p className="text-gray-500 text-sm">
                Requirements
              </p>

              <p className="font-semibold text-gray-900 whitespace-pre-wrap">
                {customer.requirements || "-"}
              </p>
            </div>


            <div>
              <p className="text-gray-500 text-sm">
                Status
              </p>

              <span
                className="
                  inline-block
                  mt-1
                  px-3
                  py-1
                  rounded-full
                  text-sm
                  font-medium
                  bg-green-100
                  text-green-700
                "
              >
                {customer.status}
              </span>
            </div>


            <div>
              <p className="text-gray-500 text-sm">
                Created At
              </p>

              <p className="font-semibold text-gray-900">
                {new Date(customer.createdAt).toLocaleDateString()}
              </p>
            </div>

          </div>

        </div>



        {/* Activity Timeline */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">

          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Activity Timeline
          </h2>


          <div className="space-y-5">


            <div className="border-l-4 border-yellow-400 pl-4">

              <h3 className="font-semibold text-gray-900">
                Customer Created
              </h3>

              <p className="text-gray-500 text-sm">
                {new Date(customer.createdAt).toLocaleString()}
              </p>

            </div>



            <div className="border-l-4 border-blue-500 pl-4">

              <h3 className="font-semibold text-gray-900">
                Profile Updated
              </h3>

              <p className="text-gray-500 text-sm">
                {new Date(customer.updatedAt).toLocaleString()}
              </p>

            </div>


          </div>

        </div>


      </div>
    </div>
  );
}

export default CustomerProfile;