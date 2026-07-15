import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

function CustomerDetails({ customer }) {
  if (!customer) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 flex items-center justify-center">
        <p className="text-gray-500">
          Select a conversation
        </p>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col items-center p-6 border-b border-gray-200">
        <div className="w-24 h-24 rounded-full bg-green-500 text-white flex items-center justify-center text-3xl font-bold">
          {customer.customer?.name?.charAt(0)}
        </div>

        <h2 className="mt-4 text-xl font-semibold text-gray-800">
          {customer.customer?.name}
        </h2>

        <p className="text-sm text-gray-500">
          Customer
        </p>
      </div>

      {/* Details */}
      <div className="p-6 space-y-6">
        {/* Phone */}
        <div>
          <div className="flex items-center gap-3 text-gray-700">
            <FaPhoneAlt className="text-green-500" />

            <div>
              <p className="text-sm text-gray-500">
                Phone
              </p>

              <p className="font-medium">
                {customer.customer?.phone || "-"}
              </p>
            </div>
          </div>
        </div>

        {/* Email */}
        <div>
          <div className="flex items-center gap-3 text-gray-700">
            <FaEnvelope className="text-green-500" />

            <div>
              <p className="text-sm text-gray-500">
                Email
              </p>

              <p className="font-medium break-all">
                {customer.customer?.email || "-"}
              </p>
            </div>
          </div>
        </div>

        {/* Address */}
        <div>
          <div className="flex items-start gap-3 text-gray-700">
            <FaMapMarkerAlt className="text-green-500 mt-1" />

            <div>
              <p className="text-sm text-gray-500">
                Address
              </p>

              <p className="font-medium">
                {customer.customer?.address || "-"}
              </p>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-gray-800 font-semibold mb-4">
            Additional Information
          </h3>

          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">
                Status
              </p>

              <p className="font-medium">
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
    </div>
  );
}

export default CustomerDetails;