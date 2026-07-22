import {
  FileText,
  Eye,
  SquarePen,
  Send,
  Trash2,
} from "lucide-react";

export default function TemplateCard({
  template,
  onEdit,
  onDelete,
  onPreview,
  onSend,
}) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN");
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* HEADER */}
      <div className="flex justify-between items-start p-5">
        <div className="flex gap-4">
          <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center">
            <FileText
              size={28}
              className="text-green-600"
            />
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {template.name}
            </h2>

            <p className="text-gray-500 mt-1">
              {template.category}
            </p>
          </div>
        </div>

        <span
          className={`px-4 py-1 rounded-full text-xs font-semibold ${
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

      {/* DIVIDER */}
      <div className="border-t" />

      {/* CONTENT */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="bg-green-50 rounded-2xl p-5 h-72 overflow-y-auto">
          <p className="text-gray-700 whitespace-pre-line">
            {template.content}
          </p>
        </div>

        {/* INFO */}
        <div className="mt-5 pt-4 border-t space-y-1 text-sm">
          <p>
            <span className="font-semibold">
              Created By:
            </span>{" "}
            {template.createdBy?.name || "Admin"}
          </p>

          <p>
            <span className="font-semibold">
              Created:
            </span>{" "}
            {formatDate(template.createdAt)}
          </p>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="border-t" />

      {/* ACTIONS */}
      <div className="grid grid-cols-4 text-center py-3">
        {/* Preview */}
        <button
          onClick={() =>
            onPreview?.(template)
          }
          className="flex flex-col items-center gap-1 text-blue-600 hover:text-blue-700 transition"
        >
          <Eye size={22} />
          <span className="text-sm">
            Preview
          </span>
        </button>

        {/* Edit */}
        <button
          onClick={() =>
            onEdit?.(template)
          }
          className="flex flex-col items-center gap-1 text-amber-500 hover:text-amber-600 transition"
        >
          <SquarePen size={22} />
          <span className="text-sm">
            Edit
          </span>
        </button>

        {/* Send */}
        <button
          onClick={() =>
            onSend?.(template)
          }
          className="flex flex-col items-center gap-1 text-green-600 hover:text-green-700 transition"
        >
          <Send size={22} />
          <span className="text-sm">
            Send
          </span>
        </button>

        {/* Delete */}
        <button
          onClick={() =>
            onDelete?.(template.id)
          }
          className="flex flex-col items-center gap-1 text-red-600 hover:text-red-700 transition"
        >
          <Trash2 size={22} />
          <span className="text-sm">
            Delete
          </span>
        </button>
      </div>
    </div>
  );
}