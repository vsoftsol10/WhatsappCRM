import { X, FileText } from "lucide-react";

export default function TemplatePreviewModal({
  isOpen,
  onClose,
  template,
}) {
  if (!isOpen || !template) return null;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden">

        {/* Header */}
        <div className="flex justify-between items-center border-b p-6">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-xl">
              <FileText
                className="text-green-600"
                size={24}
              />
            </div>

            <div>
              <h2 className="text-2xl font-bold">
                {template.name}
              </h2>

              <p className="text-gray-500">
                Template Preview
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="hover:bg-gray-100 p-2 rounded-lg"
          >
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">

          <div className="grid grid-cols-2 gap-4">

            <div>
              <p className="text-sm text-gray-500">
                Category
              </p>

              <p className="font-semibold">
                {template.category}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Message Type
              </p>

              <p className="font-semibold">
                {template.messageType}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Status
              </p>

              <span
                className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${
                  template.status === "ACTIVE"
                    ? "bg-green-100 text-green-700"
                    : template.status === "INACTIVE"
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {template.status}
              </span>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Created By
              </p>

              <p className="font-semibold">
                {template.createdBy?.name || "Admin"}
              </p>
            </div>

          </div>

          <div>
            <p className="text-sm text-gray-500 mb-2">
              Template Content
            </p>

            <div className="bg-green-50 rounded-xl p-5 whitespace-pre-wrap text-gray-700 min-h-[180px]">
              {template.content}
            </div>
          </div>

          <div className="border-t pt-4 text-sm text-gray-500">
            Created :
            {" "}
            {formatDate(template.createdAt)}
          </div>

        </div>

        {/* Footer */}
        <div className="border-t p-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}