// import {
//   FileText,
//   Eye,
//   SquarePen,
//   Send,
//   Trash2,
//   RefreshCw,
// } from "lucide-react";

// export default function TemplateCard({
//   template,
//   onEdit,
//   onDelete,
//   onPreview,
//   onSend,
//   onSubmitMeta,
//   onSyncMeta,
// }) {
//   const formatDate = (date) => {
//     return new Date(date).toLocaleDateString("en-IN");
//   };

//   return (
//     <div className="flex flex-col h-full bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
//       {/* HEADER */}
//       <div className="flex items-start gap-3 p-5">
//         <div className="flex min-w-0 flex-1 gap-4">
//           <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-green-100">
//             <FileText
//               size={28}
//               className="text-green-600"
//             />
//           </div>

//           <div className="min-w-0">
//             <h2 className="break-words text-xl font-bold leading-tight text-gray-800">
//               {template.name}
//             </h2>

//             <p className="text-gray-500 mt-1">
//               {template.category} · {template.metaTemplateLanguage || "en_US"}
//             </p>
//           </div>
//         </div>

//         <span
//           className={`shrink-0 whitespace-nowrap px-4 py-1 rounded-full text-xs font-semibold ${
//             template.status === "ACTIVE"
//               ? "bg-green-100 text-green-700"
//               : template.status === "INACTIVE"
//               ? "bg-red-100 text-red-700"
//               : "bg-gray-100 text-gray-700"
//           }`}
//         >
//           {template.status}
//         </span>
//       </div>

//       <div className="px-5 pb-3 text-sm">
//         <p><span className="font-semibold">Business:</span> {template.business?.name || "All businesses (global)"}</p>
//         <p className={template.metaApprovalStatus === "APPROVED" ? "text-green-700" : template.metaApprovalStatus === "REJECTED" ? "text-red-700" : "text-amber-700"}><span className="font-semibold">Meta:</span> {template.metaApprovalStatus === "APPROVED" ? "Approved by Meta" : template.metaApprovalStatus === "PENDING" ? "Waiting for Meta Approval" : template.metaApprovalStatus === "REJECTED" ? "Rejected by Meta" : "Not submitted"}</p>
//         {template.metaRejectionReason && <p className="mt-1 text-xs text-red-600">Reason: {template.metaRejectionReason}</p>}
//       </div>

//       {/* DIVIDER */}
//       <div className="border-t" />

//       {/* CONTENT */}
//       <div className="p-5 flex-1 flex flex-col">
//         <div className="bg-green-50 rounded-2xl p-5 h-72 overflow-y-auto">
//           <p className="text-gray-700 whitespace-pre-line">
//             {template.content}
//           </p>
//         </div>

//         {/* INFO */}
//         <div className="mt-5 pt-4 border-t space-y-1 text-sm">
//           <p>
//             <span className="font-semibold">
//               Created By:
//             </span>{" "}
//             {template.createdBy?.name || "Admin"}
//           </p>

//           <p>
//             <span className="font-semibold">
//               Created:
//             </span>{" "}
//             {formatDate(template.createdAt)}
//           </p>
//         </div>
//       </div>

//       {/* DIVIDER */}
//       <div className="border-t" />

//       {/* ACTIONS */}
//       <div className={`grid ${template.metaApprovalStatus === "APPROVED" ? "grid-cols-5" : "grid-cols-6"} py-3 text-center`}>
//         {/* Preview */}
//         <button
//           onClick={() =>
//             onPreview?.(template)
//           }
//           className="flex flex-col items-center gap-1 text-blue-600 hover:text-blue-700 transition"
//         >
//           <Eye size={22} />
//           <span className="text-sm">
//             view
//           </span>
//         </button>

//         {/* Edit */}
//         <button
//           onClick={() =>
//             onEdit?.(template)
//           }
//           className="flex flex-col items-center gap-1 text-amber-500 hover:text-amber-600 transition"
//         >
//           <SquarePen size={22} />
//           <span className="text-sm">
//             Edit
//           </span>
//         </button>

//         {/* Send stays visible; Meta requires approval before it can be used. */}
//         <button disabled={template.metaApprovalStatus !== "APPROVED"} onClick={() => onSend?.(template)} title={template.metaApprovalStatus !== "APPROVED" ? "Waiting for Meta approval" : "Send to customers"} className={`flex flex-col items-center gap-1 transition ${template.metaApprovalStatus === "APPROVED" ? "text-green-600 hover:text-green-700" : "cursor-not-allowed text-gray-300"}`}><Send size={22} /><span className="text-sm">Send</span></button>

//         <button onClick={() => onSyncMeta?.(template)} className="flex flex-col items-center gap-1 text-blue-600 hover:text-blue-700 transition"><RefreshCw size={22} /><span className="text-sm">Sync Meta</span></button>

//         {template.metaApprovalStatus !== "APPROVED" ? (
//           <button onClick={() => onSubmitMeta?.(template)} className="flex flex-col items-center gap-1 text-green-600 hover:text-green-700 transition"><Send size={22} /><span className="text-sm">Submit</span></button>
//         ) : <span />}


//         {/* Delete */}
//         <button
//           onClick={() =>
//             onDelete?.(template.id)
//           }
//           className="flex flex-col items-center gap-1 text-red-600 hover:text-red-700 transition"
//         >
//           <Trash2 size={22} />
//           <span className="text-sm">
//             Delete
//           </span>
//         </button>
//       </div>
//     </div>
//   );
// }

import {
  FileText,
  Eye,
  SquarePen,
  Send,
  Trash2,
  RefreshCw,
} from "lucide-react";

export default function TemplateCard({
  template,
  onEdit,
  onDelete,
  onPreview,
  onSend,
  onSubmitMeta,
  onSyncMeta,
}) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN");
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* HEADER */}
      <div className="flex items-start gap-3 p-5">
        <div className="flex min-w-0 flex-1 gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-green-100">
            <FileText
              size={28}
              className="text-green-600"
            />
          </div>

          <div className="min-w-0">
            <h2 className="break-words text-xl font-bold leading-tight text-gray-800">
              {template.name}
            </h2>

            <p className="text-gray-500 mt-1">
              {template.category} · {template.metaTemplateLanguage || "en_US"}
            </p>
          </div>
        </div>

        <span
          className={`shrink-0 whitespace-nowrap px-4 py-1 rounded-full text-xs font-semibold ${
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

      <div className="px-5 pb-3 text-sm">
        <p><span className="font-semibold">Business:</span> {template.business?.name || "All businesses (global)"}</p>
        <p className={template.metaApprovalStatus === "APPROVED" ? "text-green-700" : template.metaApprovalStatus === "REJECTED" ? "text-red-700" : "text-amber-700"}><span className="font-semibold">Meta:</span> {template.metaApprovalStatus === "APPROVED" ? "Approved by Meta" : template.metaApprovalStatus === "PENDING" ? "Waiting for Meta Approval" : template.metaApprovalStatus === "REJECTED" ? "Rejected by Meta" : "Not submitted"}</p>
        {template.metaRejectionReason && <p className="mt-1 text-xs text-red-600">Reason: {template.metaRejectionReason}</p>}
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
      {(() => {
        const isApproved = template.metaApprovalStatus === "APPROVED";

        // Building this as a list first (instead of the old grid-cols-5 /
        // grid-cols-6 switch) keeps every button the same width on every
        // card, whether it has 5 or 6 actions — the old approach gave
        // approved cards one width and pending cards a narrower one,
        // which is what squeezed "Sync Meta" and pushed Delete onto its
        // own row.
        const actions = [
          { key: "view", label: "view", icon: Eye, onClick: () => onPreview?.(template), color: "text-blue-600 hover:text-blue-700" },
          { key: "edit", label: "Edit", icon: SquarePen, onClick: () => onEdit?.(template), color: "text-amber-500 hover:text-amber-600" },
          {
            key: "send",
            label: "Send",
            icon: Send,
            onClick: () => onSend?.(template),
            disabled: !isApproved,
            title: !isApproved ? "Waiting for Meta approval" : "Send to customers",
            color: isApproved ? "text-green-600 hover:text-green-700" : "cursor-not-allowed text-gray-300",
          },
          { key: "sync", label: "Sync Meta", icon: RefreshCw, onClick: () => onSyncMeta?.(template), color: "text-blue-600 hover:text-blue-700" },
          !isApproved && { key: "submit", label: "Submit", icon: Send, onClick: () => onSubmitMeta?.(template), color: "text-green-600 hover:text-green-700" },
          { key: "delete", label: "Delete", icon: Trash2, onClick: () => onDelete?.(template.id), color: "text-red-600 hover:text-red-700" },
        ].filter(Boolean);

        return (
          <div className="grid grid-cols-3 gap-y-4 py-4 text-center">
            {actions.map(({ key, label, icon: Icon, onClick, disabled, title, color }) => (
              <button
                key={key}
                onClick={onClick}
                disabled={disabled}
                title={title}
                className={`flex flex-col items-center gap-1 transition whitespace-nowrap ${color}`}
              >
                <Icon size={22} />
                <span className="text-sm">{label}</span>
              </button>
            ))}
          </div>
        );
      })()}
    </div>
  );
}