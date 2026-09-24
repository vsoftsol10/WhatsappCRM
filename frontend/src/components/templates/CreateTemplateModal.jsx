// import { useState } from "react";
// import {
//   X,
//   Sparkles,
//   Loader2,
//   CircleDollarSign,
//   Package,
//   CalendarDays,
//   PartyPopper,
//   Megaphone,
//   Gift,
//   HeartHandshake,
//   Headset,} 
//   from "lucide-react";
// import useTemplateStore from "../../store/templateStore";
// import toast from "react-hot-toast";
// import useMetaApprovedTemplates from "../../hooks/useMetaApprovedTemplates";
// import BusinessSelect from "../common/BusinessSelect";

// export default function CreateTemplateModal({
//   isOpen,
//   onClose,
// }) {
//   const { addTemplate, generateTemplate } = useTemplateStore();

//   const [formData, setFormData] = useState({
//     name: "",
//     category: "SUPPORT",
//     messageType: "TEXT",
//     content: "",
//     status: "DRAFT",
//     metaTemplateName: "",
//     metaTemplateLanguage: "en_US",
//     businessId: "",
//   });

//   // One line per Meta template body placeholder, in order: line 1 fills
//   // {{1}}, line 2 fills {{2}}, etc. Only used when metaTemplateName is set.
//   const [templateParamsText, setTemplateParamsText] = useState("");

//   const [aiPrompt, setAiPrompt] = useState("");

//   const [aiTone, setAiTone] = useState("Professional");

//   const [generating, setGenerating] = useState(false);

//   const [submitting, setSubmitting] = useState(false);

//   const quickTemplates = [
//     {
//       label: "Payment Reminder",
//       icon: CircleDollarSign,
//     },
//     {
//       label: "Order Confirmation",
//       icon: Package,
//     },
//     {
//       label: "Appointment Reminder",
//       icon: CalendarDays,
//     },
//     {
//       label: "Festival Wishes",
//       icon: PartyPopper,
//     },
//     {
//       label: "Product Launch",
//       icon: Megaphone,
//     },
//     {
//       label: "Offer Announcement",
//       icon: Gift,
//     },
//     {
//       label: "Thank You Message",
//       icon: HeartHandshake,
//     },
//     {
//       label: "Support Follow-up",
//       icon: Headset,
//     },
//   ];

//   const [errors, setErrors] = useState({});

//   // Live list of Meta-approved templates for the dropdown below — see
//   // the hook for why this replaces the old free-text name/language
//   // inputs.
//   const {
//     templates: approvedTemplates,
//     loading: templatesLoading,
//     error: templatesError,
//   } = useMetaApprovedTemplates(isOpen);

//   const selectedMetaTemplate = approvedTemplates.find(
//     (t) =>
//       t.name === formData.metaTemplateName &&
//       t.language === formData.metaTemplateLanguage
//   );

//   const handleTemplateSelect = (e) => {
//     const key = e.target.value;

//     if (!key) {
//       setFormData((prev) => ({
//         ...prev,
//         metaTemplateName: "",
//         metaTemplateLanguage: "en_US",
//       }));

//       return;
//     }

//     // Keys are built as "name__language" — see the <option> values below.
//     const separatorIndex = key.lastIndexOf("__");

//     const name = key.slice(0, separatorIndex);

//     const language = key.slice(separatorIndex + 2);

//     setFormData((prev) => ({
//       ...prev,
//       metaTemplateName: name,
//       metaTemplateLanguage: language,
//     }));
//   };

//   if (!isOpen) return null;

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.name.trim()) {
//       newErrors.name = "Template name is required";
//     } else if (formData.name.trim().length < 3) {
//       newErrors.name =
//         "Template name must be at least 3 characters";
//     }

//     if (!formData.category) {
//       newErrors.category = "Category is required";
//     }

//     if (!formData.messageType) {
//       newErrors.messageType = "Message type is required";
//     }

//     if (!formData.content.trim()) {
//       newErrors.content = "Template content is required";
//     } else if (formData.content.trim().length < 10) {
//       newErrors.content =
//         "Template content must be at least 10 characters";
//     }

//     if (!formData.status) {
//       newErrors.status = "Status is required";
//     }

//     setErrors(newErrors);

//     return Object.keys(newErrors).length === 0;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setFormData({
//       ...formData,
//       [name]: value,
//     });

//     setErrors((prev) => ({
//       ...prev,
//       [name]: "",
//     }));
//   };

//   const handleGenerateAI = async () => {
//       if (!aiPrompt.trim()) {
//         return toast.error(
//           "Please enter a topic."
//         );
//       }

//       try {
//         setGenerating(true);

//         const content =
//           await generateTemplate(
//             aiPrompt,
//             aiTone
//           );

//         setFormData((prev) => ({
//           ...prev,
//           content,
//         }));

//         toast.success(
//           "Template generated successfully."
//         );
//       } catch (error) {
//         console.error(error);

//         toast.error(
//           "Failed to generate template."
//         );
//       } finally {
//         setGenerating(false);
//       }
//     };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) return;

//     const templateParams = templateParamsText
//       .split("\n")
//       .map((line) => line.trim())
//       .filter((line) => line.length > 0);

//     if (false && formData.metaTemplateName.trim() && templateParams.length === 0) {
//       return toast.error(
//         "You set a Meta template name — add its body parameter values below (one per line), or leave the template name blank."
//       );
//     }

//     try {
//       setSubmitting(true);

//       await addTemplate({
//         ...formData,
//         templateParams,
//       });

//       toast.success("Template created successfully!");

//       setFormData({
//         name: "",
//         category: "SUPPORT",
//         messageType: "TEXT",
//         content: "",
//         status: "DRAFT",
//         metaTemplateName: "",
//         metaTemplateLanguage: "en_US",
//       });

//       setTemplateParamsText("");

//       setErrors({});

//       onClose();
//     } catch (error) {
//       toast.error("Failed to create template!");
//       console.error(error);
//     } finally {
//       setSubmitting(false);
//     }
//   };


//   return (
//     <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
//       <div className="flex min-h-screen items-center justify-center p-3 sm:p-4">
//         <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
//           {/* Header */}
//           <div className="flex items-center justify-between gap-4 bg-[#25D366] px-5 py-4 sm:px-6 sm:py-5">
//             <h2 className="break-words text-xl font-bold text-gray-800 sm:text-2xl">
//               Create Template
//             </h2>

//             <button
//               type="button"
//               onClick={onClose}
//               className="p-2 rounded-full hover:bg-[#128C7E] transition"
//             >
//               <X size={22} />
//             </button>
//           </div>

//           <form
//             onSubmit={handleSubmit}
//             className="max-h-[75vh] space-y-5 overflow-y-auto p-5 sm:p-6"
//           >
//             <div>
//               <label className="block mb-2 font-medium text-gray-700">Business <span className="font-normal text-gray-400">(optional — leave empty for all customers)</span></label>
//               <BusinessSelect value={formData.businessId} onChange={(businessId) => setFormData((prev) => ({ ...prev, businessId }))} />
//               {errors.businessId && <p className="mt-1 text-sm text-red-500">{errors.businessId}</p>}
//             </div>
//             {/* Name */}
//             <div>
//               <label className="block mb-2 font-medium text-gray-700">
//                 Template Name <span className="text-red-500">*</span>
//               </label>

//               <input
//                 type="text"
//                 name="name"
//                 placeholder="Enter template name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 className={`w-full rounded-lg border px-4 py-3 outline-none ${
//                   errors.name
//                     ? "border-red-500"
//                     : "border-gray-300 focus:border-[#25D366]"
//                 }`}
//               />

//               {errors.name && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors.name}
//                 </p>
//               )}
//             </div>

//             {/* Category */}
//             <div>
//               <label className="block mb-2 font-medium text-gray-700">
//                 Category <span className="text-red-500">*</span>
//               </label>

//               <select
//                 name="category"
//                 value={formData.category}
//                 onChange={handleChange}
//                 className={`w-full rounded-lg border px-4 py-3 outline-none ${
//                   errors.category
//                     ? "border-red-500"
//                     : "border-gray-300 focus:border-[#25D366]"
//                 }`}
//               >
//                 <option value="MARKETING">Marketing</option>
//                 <option value="SUPPORT">Support</option>
//               </select>

//               {errors.category && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors.category}
//                 </p>
//               )}
//             </div>

//             {/* Message Type */}
//             <div>
//               <label className="block mb-2 font-medium text-gray-700">
//                 Message Type <span className="text-red-500">*</span>
//               </label>

//               <select
//                 name="messageType"
//                 value={formData.messageType}
//                 onChange={handleChange}
//                 className={`w-full rounded-lg border px-4 py-3 outline-none ${
//                   errors.messageType
//                     ? "border-red-500"
//                     : "border-gray-300 focus:border-[#25D366]"
//                 }`}
//               >
//                 <option value="TEXT">Text</option>
//                 <option value="IMAGE">Image</option>
//                 <option value="MEDIA">Media</option>
//               </select>

//               {errors.messageType && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors.messageType}
//                 </p>
//               )}
//             </div>

//             {/* AI Generator */}

//             <div className="rounded-xl border bg-green-50 p-4">

//               <div className="flex items-center gap-2 mb-3">
//                 <Sparkles
//                   size={18}
//                   className="text-green-600"
//                 />

//                 <h3 className="font-semibold">
//                   AI Template Generator
//                 </h3>
//               </div>

//               {/* Quick Templates */}
//               <div className="mb-4">

//                 <label className="block mb-2 font-medium text-gray-700">
//                   Quick Templates
//                 </label>

//                 <div className="flex flex-wrap gap-2">

//                   {quickTemplates.map((item) => {
//                     const Icon = item.icon;

//                     return (
//                       <button
//                         key={item.label}
//                         type="button"
//                         onClick={() => setAiPrompt(item.label)}
//                         className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm transition ${
//                           aiPrompt === item.label
//                             ? "bg-green-600 text-white"
//                             : "border border-gray-300 hover:bg-green-50"
//                         }`}
//                       >
//                         <Icon size={16} />
//                         {item.label}
//                       </button>
//                     );
//                   })}

//                 </div>

//               </div>

//               {/* Custom Prompt */}
//               <input
//                 type="text"
//                 placeholder="Or describe your own template..."
//                 value={aiPrompt}
//                 onChange={(e) =>
//                   setAiPrompt(e.target.value)
//                 }
//                 className="w-full rounded-lg border px-4 py-3 mb-3"
//               />

//               {/* Tone + Generate */}
//               <div className="flex gap-3">

//                 <select
//                   value={aiTone}
//                   onChange={(e) =>
//                     setAiTone(e.target.value)
//                   }
//                   className="rounded-lg border px-4 py-3"
//                 >
//                   <option>Professional</option>
//                   <option>Friendly</option>
//                   <option>Formal</option>
//                   <option>Promotional</option>
//                 </select>

//                 <button
//                   type="button"
//                   onClick={handleGenerateAI}
//                   disabled={generating}
//                   className="crm-primary-button flex items-center gap-2"
//                 >
//                   {generating ? (
//                     <>
//                       <Loader2
//                         size={16}
//                         className="animate-spin"
//                       />
//                       Generating...
//                     </>
//                   ) : (
//                     <>
//                       <Sparkles size={16} />
//                       Generate with AI
//                     </>
//                   )}
//                 </button>

//               </div>

//             </div>

//             {/* Content */}
//             <div>
//               <label className="block mb-2 font-medium text-gray-700">
//                 Template Content <span className="text-red-500">*</span>
//               </label>

//               <textarea
//                 rows="5"
//                 name="content"
//                 placeholder="Enter template content"
//                 value={formData.content}
//                 onChange={handleChange}
//                 className={`w-full rounded-lg border px-4 py-3 outline-none ${
//                   errors.content
//                     ? "border-red-500"
//                     : "border-gray-300 focus:border-[#25D366]"
//                 }`}
//               />

//               {errors.content && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors.content}
//                 </p>
//               )}
//             </div>

//             {/* Meta Approved Template — fetched live from WhatsApp
//                 Business Manager, so only real approved (name, language)
//                 pairs are selectable. */}
//             <div>
//               <label className="block mb-2 font-medium text-gray-700">
//                 Meta Approved Template (optional)
//               </label>

//               <select
//                 value={
//                   formData.metaTemplateName
//                     ? `${formData.metaTemplateName}__${formData.metaTemplateLanguage}`
//                     : ""
//                 }
//                 onChange={handleTemplateSelect}
//                 className="w-full rounded-lg border border-gray-300 bg-white focus:border-[#25D366] px-4 py-3 outline-none"
//               >
//                 <option value="">— Use the default generic template —</option>

//                 {templatesLoading && <option disabled>Loading templates…</option>}

//                 {approvedTemplates.map((t) => (
//                   <option
//                     key={`${t.name}__${t.language}`}
//                     value={`${t.name}__${t.language}`}
//                   >
//                     {t.name} ({t.language}) — {t.category}
//                   </option>
//                 ))}
//               </select>

//               {templatesError && (
//                 <p className="mt-1 text-xs text-red-500">{templatesError}</p>
//               )}

//               <p className="text-gray-500 text-xs mt-1">
//                 This list is pulled live from WhatsApp Business Manager —
//                 only templates Meta has already approved show up here. Pick
//                 one to send that exact template, or leave it on the default
//                 to send via the generic template (line breaks won't be
//                 preserved on that one).
//               </p>
//             </div>

//             {/* Template Parameters — always available, whether or not a
//                 dedicated Meta template is selected above. Non-technical
//                 users can fill these in directly instead of needing to
//                 know Meta's {{1}}, {{2}} convention beforehand. */}
//             <div>
//               <label className="block mb-2 font-medium text-gray-700">
//                 Parameters (one per line, in order)
//               </label>

//               <textarea
//                 rows={5}
//                 value={templateParamsText}
//                 onChange={(e) => setTemplateParamsText(e.target.value)}
//                 placeholder={
//                   "Eco & Natural Product Entrepreneurs Meetup\n22 August 2026, Saturday\n4:30 PM – 6:30 PM\nVannarpet, Tirunelveli\n9095422237"
//                 }
//                 className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 font-mono text-sm outline-none focus:border-[#25D366]"
//               />

//               {selectedMetaTemplate ? (
//                 <p className="text-gray-500 text-xs mt-1">
//                   This template needs{" "}
//                   <strong>
//                     {selectedMetaTemplate.paramCount} parameter
//                     {selectedMetaTemplate.paramCount === 1 ? "" : "s"}
//                   </strong>
//                   , one per line, in order — line 1 fills {"{{1}}"}, line 2
//                   fills {"{{2}}"}, and so on. You can use{" "}
//                   {"{{customer_name}}"} in any line to personalize it per
//                   recipient.
//                   {selectedMetaTemplate.bodyText && (
//                     <>
//                       {" "}Approved body preview: "{selectedMetaTemplate.bodyText}"
//                     </>
//                   )}
//                 </p>
//               ) : (
//                 <p className="text-gray-500 text-xs mt-1">
//                   Fill in one value per line for any {"{{1}}"}, {"{{2}}"},
//                   etc. placeholders used in your content above (in order).
//                   You can use {"{{customer_name}}"}, {"{{company}}"},{" "}
//                   {"{{phone}}"} or {"{{email}}"} in any line to personalize
//                   it per recipient. Leave blank if your content has no
//                   placeholders.
//                 </p>
//               )}
//             </div>

//             {/* Preview — shows a sample of exactly what the customer will
//                 see on WhatsApp, before the template is saved. */}
//             <div>
//               <label className="block mb-2 font-medium text-gray-700">
//                 Preview
//               </label>

//               <div className="rounded-lg border border-gray-300 bg-[#e5ddd5] p-4">
//                 <div className="max-w-sm rounded-lg rounded-tl-none bg-white px-3 py-2 shadow">
//                   <p className="whitespace-pre-wrap text-sm text-gray-800">
//                     {(() => {
//                       const sampleName = "Customer";

//                       const paramLines = templateParamsText
//                         .split("\n")
//                         .map((l) => l.trim())
//                         .filter((l) => l.length > 0);

//                       const fillSample = (text) =>
//                         (text || "")
//                           .replaceAll("{{customer_name}}", sampleName)
//                           .replaceAll("{{company}}", "Your Company")
//                           .replaceAll("{{phone}}", "—")
//                           .replaceAll("{{email}}", "—");

//                       if (selectedMetaTemplate) {
//                         let body = selectedMetaTemplate.bodyText || "";
//                         paramLines.forEach((val, idx) => {
//                           body = body.replaceAll(
//                             `{{${idx + 1}}}`,
//                             fillSample(val)
//                           );
//                         });
//                         return body || "Select a template to preview it here.";
//                       }

//                       return (
//                         fillSample(formData.content) ||
//                         "Type your template content to preview it here."
//                       );
//                     })()}
//                   </p>

//                   <p className="mt-1 text-right text-[10px] text-gray-400">
//                     Preview only — actual message may vary
//                   </p>
//                 </div>
//               </div>

//               <p className="text-gray-500 text-xs mt-1">
//                 This is a sample of how the message will look on WhatsApp,
//                 using a placeholder name.
//               </p>
//             </div>

//             {/* Status */}
//             <div>
//               <label className="block mb-2 font-medium text-gray-700">
//                 Status <span className="text-red-500">*</span>
//               </label>

//               <select
//                 name="status"
//                 value={formData.status}
//                 onChange={handleChange}
//                 className={`w-full rounded-lg border px-4 py-3 outline-none ${
//                   errors.status
//                     ? "border-red-500"
//                     : "border-gray-300 focus:border-[#25D366]"
//                 }`}
//               >
//                 <option value="DRAFT">Draft</option>
//                 {/* <option value="APPROVED">Approved</option> */}
//                 <option value="ACTIVE">Active</option>
//                 <option value="INACTIVE">Inactive</option>
//               </select>

//               {errors.status && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors.status}
//                 </p>
//               )}
//             </div>

//             {/* Actions */}
//             <div className="mt-6 flex flex-col-reverse gap-3 border-t pt-4 sm:flex-row sm:justify-end">
//               <button
//                 type="button"
//                 onClick={onClose}
//                 disabled={submitting}
//                 className="crm-secondary-button disabled:cursor-not-allowed disabled:opacity-60"
//               >
//                 Cancel
//               </button>

//               <button
//                 type="submit"
//                 disabled={submitting}
//                 className="crm-primary-button disabled:cursor-not-allowed disabled:opacity-60"
//               >
//                 {submitting ? "Creating..." : "Create Template"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useMemo, useState } from "react";
import {
  X,
  Sparkles,
  Loader2,
  CircleDollarSign,
  Package,
  CalendarDays,
  PartyPopper,
  Megaphone,
  Gift,
  HeartHandshake,
  Headset,
  ImagePlus,
} from "lucide-react";
import useTemplateStore from "../../store/templateStore";
import { uploadTemplateHeaderImage } from "../../api/templateApi";
import toast from "react-hot-toast";
import BusinessSelect from "../common/BusinessSelect";

export default function CreateTemplateModal({
  isOpen,
  onClose,
}) {
  const { addTemplate, generateTemplate } = useTemplateStore();

  const [formData, setFormData] = useState({
    businessId: "",
    name: "",
    category: "MARKETING",
    purpose: "CUSTOM",
    language: "en_US",
    headerType: "NONE",
    headerContent: "",
    content: "",
    footerContent: "",
    status: "DRAFT",
    variableSamples: {},
  });

  const [aiPrompt, setAiPrompt] = useState("");

  const [aiTone, setAiTone] = useState("Professional");

  const [generating, setGenerating] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [uploadingHeader, setUploadingHeader] = useState(false);

  const [errors, setErrors] = useState({});

  // Detect {{1}}, {{2}}, ... placeholders in the body so Meta-required
  // sample values can be collected for each one, in order.
  const detectedVariables = useMemo(() => {
    const matches = [...formData.content.matchAll(/\{\{(\d+)\}\}/g)];
    const unique = [...new Set(matches.map((m) => m[1]))];
    return unique.sort((a, b) => Number(a) - Number(b));
  }, [formData.content]);

  const quickTemplates = [
    {
      label: "Payment Reminder",
      icon: CircleDollarSign,
    },
    {
      label: "Order Confirmation",
      icon: Package,
    },
    {
      label: "Appointment Reminder",
      icon: CalendarDays,
    },
    {
      label: "Festival Wishes",
      icon: PartyPopper,
    },
    {
      label: "Product Launch",
      icon: Megaphone,
    },
    {
      label: "Offer Announcement",
      icon: Gift,
    },
    {
      label: "Thank You Message",
      icon: HeartHandshake,
    },
    {
      label: "Support Follow-up",
      icon: Headset,
    },
  ];

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Template name is required";
    } else if (formData.name.trim().length < 3) {
      newErrors.name =
        "Template name must be at least 3 characters";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.language) {
      newErrors.language = "Language is required";
    }

    if (formData.headerType === "TEXT" && !formData.headerContent.trim()) {
      newErrors.headerContent = "Header text is required";
    }

    if (formData.headerType === "IMAGE" && !formData.headerContent.trim()) {
      newErrors.headerContent = "Please upload a sample image before saving";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Template content is required";
    } else if (formData.content.trim().length < 10) {
      newErrors.content =
        "Template content must be at least 10 characters";
    }

    if (!formData.status) {
      newErrors.status = "Status is required";
    }

    detectedVariables.forEach((varNum) => {
      const sample = formData.variableSamples[varNum];
      if (!sample || !sample.trim()) {
        newErrors[`sample_${varNum}`] = `Sample value for {{${varNum}}} is required`;
      }
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // Switching header type clears whatever was in headerContent — a text
  // heading and an uploaded image URL are never valid for each other's
  // type, so stale data should never silently carry over.
  const handleHeaderTypeChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      headerType: e.target.value,
      headerContent: "",
    }));

    setErrors((prev) => ({
      ...prev,
      headerContent: "",
    }));
  };

  const handleHeaderImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB (Meta's limit for header images).");
      return;
    }

    try {
      setUploadingHeader(true);

      const result = await uploadTemplateHeaderImage(file);

      setFormData((prev) => ({
        ...prev,
        headerContent: result.data.imageUrl,
      }));

      setErrors((prev) => ({
        ...prev,
        headerContent: "",
      }));

      toast.success("Sample image uploaded.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload sample image.");
    } finally {
      setUploadingHeader(false);
    }
  };

  const handleSampleChange = (varNum, value) => {
    setFormData((prev) => ({
      ...prev,
      variableSamples: {
        ...prev.variableSamples,
        [varNum]: value,
      },
    }));

    setErrors((prev) => ({
      ...prev,
      [`sample_${varNum}`]: "",
    }));
  };

  const handleGenerateAI = async () => {
      if (!aiPrompt.trim()) {
        return toast.error(
          "Please enter a topic."
        );
      }

      try {
        setGenerating(true);

        const content =
          await generateTemplate(
            aiPrompt,
            aiTone
          );

        setFormData((prev) => ({
          ...prev,
          content,
        }));

        toast.success(
          "Template generated successfully."
        );
      } catch (error) {
        console.error(error);

        toast.error(
          "Failed to generate template."
        );
      } finally {
        setGenerating(false);
      }
    };

  const resetForm = () => {
    setFormData({
      businessId: "",
      name: "",
      category: "MARKETING",
      purpose: "CUSTOM",
      language: "en_US",
      headerType: "NONE",
      headerContent: "",
      content: "",
      footerContent: "",
      status: "DRAFT",
      variableSamples: {},
    });

    setAiPrompt("");
    setAiTone("Professional");
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return;

    if (generating) {
      toast.error("Please wait until AI generation is complete.");
      return;
    }

    if (uploadingHeader) {
      toast.error("Please wait for the header image to finish uploading.");
      return;
    }

    if (!validateForm()) return;

    try {
      setSubmitting(true);

      const bodyExamples = detectedVariables.map(
        (varNum) => formData.variableSamples[varNum]
      );

      await addTemplate({
        businessId: formData.businessId,
        name: formData.name,
        category: formData.category,
        purpose: formData.purpose,
        metaTemplateLanguage: formData.language,
        headerType: formData.headerType,
        headerContent: formData.headerContent,
        content: formData.content,
        footerContent: formData.footerContent,
        status: formData.status,
        bodyExamples,
      });

      toast.success("Template created successfully!");

      resetForm();

      onClose();
    } catch (error) {
      toast.error("Failed to create template!");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (submitting) return;
    if (generating) return;
    if (uploadingHeader) return;
    onClose();
  };


  return (
    <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-3 sm:p-4">
        <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between gap-4 bg-[#25D366] px-5 py-4 sm:px-6 sm:py-5">
            <h2 className="break-words text-xl font-bold text-gray-800 sm:text-2xl">
              Create Template
            </h2>

            <button
              type="button"
              onClick={handleClose}
              disabled={submitting || generating || uploadingHeader}
              className={`p-2 rounded-full transition ${
                submitting || generating || uploadingHeader
                  ? "cursor-not-allowed opacity-50"
                  : "hover:bg-[#128C7E]"
              }`}
            >
              <X size={22} />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="max-h-[75vh] space-y-5 overflow-y-auto p-5 sm:p-6"
          >
            <div>
              <label className="block mb-2 font-medium text-gray-700">Business <span className="font-normal text-gray-400">(optional — leave empty for all customers)</span></label>
              <BusinessSelect value={formData.businessId} onChange={(businessId) => setFormData((prev) => ({ ...prev, businessId }))} />
              {errors.businessId && <p className="mt-1 text-sm text-red-500">{errors.businessId}</p>}
            </div>

            {/* Name */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Template Name <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                name="name"
                placeholder="Enter template name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full rounded-lg border px-4 py-3 outline-none ${
                  errors.name
                    ? "border-red-500"
                    : "border-gray-300 focus:border-[#25D366]"
                }`}
              />

              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Category */}
              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Category <span className="text-red-500">*</span>
                </label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full rounded-lg border px-4 py-3 outline-none ${
                    errors.category
                      ? "border-red-500"
                      : "border-gray-300 focus:border-[#25D366]"
                  }`}
                >
                  <option value="MARKETING">Marketing</option>
                  <option value="UTILITY">Utility</option>
                  <option value="AUTHENTICATION">Authentication</option>
                </select>

                <p className="mt-1 text-xs text-gray-500">
                  This classification is used for Meta WhatsApp templates.
                </p>

                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.category}
                  </p>
                )}
              </div>

              {/* Purpose (optional) */}
              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Purpose
                </label>

                <select
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#25D366]"
                >
                  <option value="WELCOME">Welcome</option>
                  <option value="ORDER_CONFIRMATION">Order Confirmation</option>
                  <option value="ORDER_UPDATE">Order Update</option>
                  <option value="PAYMENT_REMINDER">Payment Reminder</option>
                  <option value="APPOINTMENT_REMINDER">Appointment Reminder</option>
                  <option value="SUPPORT_FOLLOW_UP">Support Follow-up</option>
                  <option value="FESTIVAL_GREETING">Festival Greeting</option>
                  <option value="PROMOTION">Promotion</option>
                  <option value="CUSTOM">Custom</option>
                </select>
              </div>

              {/* Language */}
              <div className="md:col-span-2">
                <label className="block mb-2 font-medium text-gray-700">
                  Language <span className="text-red-500">*</span>
                </label>

                <select
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className={`w-full rounded-lg border px-4 py-3 outline-none ${
                    errors.language
                      ? "border-red-500"
                      : "border-gray-300 focus:border-[#25D366]"
                  }`}
                >
                  <option value="en_US">English (US)</option>
                  <option value="en_GB">English (UK)</option>
                  <option value="ta">Tamil</option>
                  <option value="hi">Hindi</option>
                </select>

                {errors.language && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.language}
                  </p>
                )}
              </div>
            </div>

            {/* Header */}
            <div className="border-t pt-5">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">Header</h3>

              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Header Type
                </label>

                <select
                  name="headerType"
                  value={formData.headerType}
                  onChange={handleHeaderTypeChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#25D366]"
                >
                  <option value="NONE">No Header</option>
                  <option value="TEXT">Text</option>
                  <option value="IMAGE">Image</option>
                </select>

                <p className="mt-1 text-xs text-gray-500">
                  Meta locks this in permanently once approved — a template
                  approved with an image header can never later be sent with
                  text instead.
                </p>
              </div>

              {formData.headerType === "TEXT" && (
                <div className="mt-4">
                  <label className="block mb-2 font-medium text-gray-700">
                    Header Text <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    name="headerContent"
                    value={formData.headerContent}
                    onChange={handleChange}
                    placeholder="Enter header text"
                    className={`w-full rounded-lg border px-4 py-3 outline-none ${
                      errors.headerContent
                        ? "border-red-500"
                        : "border-gray-300 focus:border-[#25D366]"
                    }`}
                  />

                  {errors.headerContent && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.headerContent}
                    </p>
                  )}
                </div>
              )}

              {formData.headerType === "IMAGE" && (
                <div className="mt-4">
                  <label className="block mb-2 font-medium text-gray-700">
                    Sample Image <span className="text-red-500">*</span>
                  </label>

                  <p className="mb-2 text-xs text-gray-500">
                    Upload a real sample image (JPEG/PNG, under 5MB). This is
                    what Meta's reviewers see, and what gets referenced when
                    the template is approved.
                  </p>

                  {!formData.headerContent ? (
                    <label
                      className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition ${
                        submitting || uploadingHeader
                          ? "cursor-not-allowed opacity-50 border-gray-300"
                          : "cursor-pointer border-[#25D366] bg-green-50 hover:bg-green-100"
                      } ${errors.headerContent ? "border-red-500" : ""}`}
                    >
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleHeaderImageUpload}
                        disabled={submitting || uploadingHeader}
                        className="hidden"
                      />

                      {uploadingHeader ? (
                        <>
                          <Loader2 size={24} className="animate-spin text-[#25D366]" />
                          <span className="mt-2 text-sm text-gray-600">
                            Uploading...
                          </span>
                        </>
                      ) : (
                        <>
                          <ImagePlus size={24} className="text-[#25D366]" />
                          <span className="mt-2 text-sm text-gray-600">
                            Click to upload sample image
                          </span>
                        </>
                      )}
                    </label>
                  ) : (
                    <div className="flex items-center gap-4 rounded-lg border border-gray-200 p-3">
                      <img
                        src={formData.headerContent}
                        alt="Header sample"
                        className="h-20 w-20 rounded-lg object-cover"
                      />

                      <button
                        type="button"
                        disabled={submitting}
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            headerContent: "",
                          }))
                        }
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Change Image
                      </button>
                    </div>
                  )}

                  {errors.headerContent && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.headerContent}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* AI Generator */}

            <div className="rounded-xl border bg-green-50 p-4">

              <div className="flex items-center gap-2 mb-3">
                <Sparkles
                  size={18}
                  className="text-green-600"
                />

                <h3 className="font-semibold">
                  AI Template Generator
                </h3>
              </div>

              {/* Quick Templates */}
              <div className="mb-4">

                <label className="block mb-2 font-medium text-gray-700">
                  Quick Templates
                </label>

                <div className="flex flex-wrap gap-2">

                  {quickTemplates.map((item) => {
                    const Icon = item.icon;

                    return (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => setAiPrompt(item.label)}
                        className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm transition ${
                          aiPrompt === item.label
                            ? "bg-green-600 text-white"
                            : "border border-gray-300 hover:bg-green-50"
                        }`}
                      >
                        <Icon size={16} />
                        {item.label}
                      </button>
                    );
                  })}

                </div>

              </div>

              {/* Custom Prompt */}
              <input
                type="text"
                placeholder="Or describe your own template..."
                value={aiPrompt}
                onChange={(e) =>
                  setAiPrompt(e.target.value)
                }
                className="w-full rounded-lg border px-4 py-3 mb-3"
              />

              {/* Tone + Generate */}
              <div className="flex gap-3">

                <select
                  value={aiTone}
                  onChange={(e) =>
                    setAiTone(e.target.value)
                  }
                  className="rounded-lg border px-4 py-3"
                >
                  <option>Professional</option>
                  <option>Friendly</option>
                  <option>Formal</option>
                  <option>Promotional</option>
                </select>

                <button
                  type="button"
                  onClick={handleGenerateAI}
                  disabled={generating}
                  className="crm-primary-button flex items-center gap-2"
                >
                  {generating ? (
                    <>
                      <Loader2
                        size={16}
                        className="animate-spin"
                      />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      Generate with AI
                    </>
                  )}
                </button>

              </div>

            </div>

            {/* Content */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Template Content <span className="text-red-500">*</span>
              </label>

              <textarea
                rows="5"
                name="content"
                placeholder="Enter template content"
                value={formData.content}
                onChange={handleChange}
                className={`w-full rounded-lg border px-4 py-3 outline-none ${
                  errors.content
                    ? "border-red-500"
                    : "border-gray-300 focus:border-[#25D366]"
                }`}
              />

              <div className="mt-2 rounded-lg bg-gray-50 p-3">
                <p className="text-sm font-medium text-gray-700">Dynamic variables</p>
                <p className="mt-1 text-sm text-gray-500">
                  Use variables such as{" "}
                  <span className="font-semibold text-gray-700">{"{{1}}"}</span>,{" "}
                  <span className="font-semibold text-gray-700">{"{{2}}"}</span> for
                  dynamic customer information.
                </p>

                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        content: prev.content + (prev.content ? " " : "") + "{{1}}",
                      }))
                    }
                    className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm hover:bg-gray-100"
                  >
                    + {"{{1}}"}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        content: prev.content + (prev.content ? " " : "") + "{{2}}",
                      }))
                    }
                    className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm hover:bg-gray-100"
                  >
                    + {"{{2}}"}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        content: prev.content + (prev.content ? " " : "") + "{{3}}",
                      }))
                    }
                    className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm hover:bg-gray-100"
                  >
                    + {"{{3}}"}
                  </button>
                </div>
              </div>

              {errors.content && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.content}
                </p>
              )}
            </div>

            {/* Variable Samples */}
            {detectedVariables.length > 0 && (
              <div className="border-t pt-5">
                <h3 className="mb-2 text-lg font-semibold text-gray-800">
                  Variable Samples
                </h3>

                <p className="mb-3 text-sm text-gray-500">
                  Meta requires a realistic example value for every variable
                  in your body text before it will review the template.
                </p>

                <div className="space-y-3">
                  {detectedVariables.map((varNum) => (
                    <div key={varNum}>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Sample value for {`{{${varNum}}}`}{" "}
                        <span className="text-red-500">*</span>
                      </label>

                      <input
                        type="text"
                        value={formData.variableSamples[varNum] || ""}
                        onChange={(e) =>
                          handleSampleChange(varNum, e.target.value)
                        }
                        placeholder={
                          varNum === "1" ? "e.g. Rahul" : "e.g. ORD1234"
                        }
                        className={`w-full rounded-lg border px-4 py-2 outline-none ${
                          errors[`sample_${varNum}`]
                            ? "border-red-500"
                            : "border-gray-300 focus:border-[#25D366]"
                        }`}
                      />

                      {errors[`sample_${varNum}`] && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors[`sample_${varNum}`]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="border-t pt-5">
              <h3 className="mb-2 text-lg font-semibold text-gray-800">Footer</h3>
              <p className="mb-3 text-sm text-gray-500">
                Optional text displayed at the bottom of the message.
              </p>

              <input
                type="text"
                name="footerContent"
                value={formData.footerContent}
                onChange={handleChange}
                placeholder="Example: Thank you for choosing us."
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#25D366]"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Status <span className="text-red-500">*</span>
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={`w-full rounded-lg border px-4 py-3 outline-none ${
                  errors.status
                    ? "border-red-500"
                    : "border-gray-300 focus:border-[#25D366]"
                }`}
              >
                <option value="DRAFT">Draft</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>

              {errors.status && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.status}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-col-reverse gap-3 border-t pt-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleClose}
                disabled={submitting || generating || uploadingHeader}
                className="crm-secondary-button disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting || generating || uploadingHeader}
                className="crm-primary-button disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Creating..." : "Create Template"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}