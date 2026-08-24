import { useEffect, useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";

import useTemplateStore from "../../store/templateStore";
import useMetaApprovedTemplates from "../../hooks/useMetaApprovedTemplates";

export default function EditTemplateModal({
  isOpen,
  onClose,
  template,
}) {
  const { editTemplate } = useTemplateStore();

  const [formData, setFormData] = useState({
    name: "",
    category: "MARKETING",
    messageType: "TEXT",
    content: "",
    status: "DRAFT",
    metaTemplateName: "",
    metaTemplateLanguage: "en_US",
  });

  // One line per Meta template body placeholder, in order: line 1 fills
  // {{1}}, line 2 fills {{2}}, etc. Only used when metaTemplateName is set.
  const [templateParamsText, setTemplateParamsText] = useState("");

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name || "",
        category: template.category || "MARKETING",
        messageType: template.messageType || "TEXT",
        content: template.content || "",
        status: template.status || "DRAFT",
        metaTemplateName: template.metaTemplateName || "",
        metaTemplateLanguage: template.metaTemplateLanguage || "en_US",
      });

      setTemplateParamsText(
        Array.isArray(template.templateParams)
          ? template.templateParams.join("\n")
          : ""
      );

      setErrors({});
    }
  }, [template]);

  // Live list of Meta-approved templates for the dropdown below — see
  // the hook for why this replaces the old free-text name/language
  // inputs.
  const {
    templates: approvedTemplates,
    loading: templatesLoading,
    error: templatesError,
  } = useMetaApprovedTemplates(isOpen);

  const selectedMetaTemplate = approvedTemplates.find(
    (t) =>
      t.name === formData.metaTemplateName &&
      t.language === formData.metaTemplateLanguage
  );

  const handleTemplateSelect = (e) => {
    const key = e.target.value;

    if (!key) {
      setFormData((prev) => ({
        ...prev,
        metaTemplateName: "",
        metaTemplateLanguage: "en_US",
      }));

      return;
    }

    // Keys are built as "name__language" — see the <option> values below.
    const separatorIndex = key.lastIndexOf("__");

    const name = key.slice(0, separatorIndex);

    const language = key.slice(separatorIndex + 2);

    setFormData((prev) => ({
      ...prev,
      metaTemplateName: name,
      metaTemplateLanguage: language,
    }));
  };

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

    if (!formData.messageType) {
      newErrors.messageType = "Message type is required";
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const templateParams = templateParamsText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (formData.metaTemplateName.trim() && templateParams.length === 0) {
      return toast.error(
        "You set a Meta template name — add its body parameter values below (one per line), or leave the template name blank."
      );
    }

    try {
      await editTemplate(template.id, {
        ...formData,
        templateParams,
      });

      toast.success("Template updated successfully!");

      setFormData({
        name: "",
        category: "MARKETING",
        messageType: "TEXT",
        content: "",
        status: "DRAFT",
      });

      setTemplateParamsText("");

      setErrors({});

      onClose();
    } catch (error) {
      toast.error("Failed to update template. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-3 sm:p-4">
        <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between gap-4 bg-[#25D366] px-5 py-4 sm:px-6 sm:py-5">
            <h2 className="break-words text-xl font-bold text-gray-800 sm:text-2xl">
              Edit Template
            </h2>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#128C7E] transition"
            >
              <X size={22} />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="max-h-[75vh] space-y-5 overflow-y-auto p-5 sm:p-6"
          >
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
                <option value="SUPPORT">Support</option>
                <option value="SALES">Sales</option>
                <option value="UTILITY">Utility</option>
                <option value="AUTHENTICATION">Authentication</option>
              </select>

              {errors.category && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.category}
                </p>
              )}
            </div>

            {/* Message Type */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Message Type <span className="text-red-500">*</span>
              </label>

              <select
                name="messageType"
                value={formData.messageType}
                onChange={handleChange}
                className={`w-full rounded-lg border px-4 py-3 outline-none ${
                  errors.messageType
                    ? "border-red-500"
                    : "border-gray-300 focus:border-[#25D366]"
                }`}
              >
                <option value="TEXT">Text</option>
                <option value="IMAGE">Image</option>
                <option value="VIDEO">Video</option>
                <option value="DOCUMENT">Document</option>
              </select>

              {errors.messageType && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.messageType}
                </p>
              )}
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

              {errors.content && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.content}
                </p>
              )}
            </div>

            {/* Meta Approved Template — fetched live from WhatsApp
                Business Manager, so only real approved (name, language)
                pairs are selectable. */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Meta Approved Template (optional)
              </label>

              <select
                value={
                  formData.metaTemplateName
                    ? `${formData.metaTemplateName}__${formData.metaTemplateLanguage}`
                    : ""
                }
                onChange={handleTemplateSelect}
                className="w-full rounded-lg border border-gray-300 bg-white focus:border-[#25D366] px-4 py-3 outline-none"
              >
                <option value="">— Use the default generic template —</option>

                {templatesLoading && <option disabled>Loading templates…</option>}

                {approvedTemplates.map((t) => (
                  <option
                    key={`${t.name}__${t.language}`}
                    value={`${t.name}__${t.language}`}
                  >
                    {t.name} ({t.language}) — {t.category}
                  </option>
                ))}
              </select>

              {templatesError && (
                <p className="mt-1 text-xs text-red-500">{templatesError}</p>
              )}

              <p className="text-gray-500 text-xs mt-1">
                This list is pulled live from WhatsApp Business Manager —
                only templates Meta has already approved show up here. Pick
                one to send that exact template, or leave it on the default
                to send via the generic template (line breaks won't be
                preserved on that one).
              </p>
            </div>

            {/* Dedicated Template Body Parameters */}
            {selectedMetaTemplate && (
              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Template Body Parameters (one per line, in order)
                </label>

                <textarea
                  rows={5}
                  value={templateParamsText}
                  onChange={(e) => setTemplateParamsText(e.target.value)}
                  placeholder={
                    "Eco & Natural Product Entrepreneurs Meetup\n22 August 2026, Saturday\n4:30 PM – 6:30 PM\nVannarpet, Tirunelveli\n9095422237"
                  }
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 font-mono text-sm outline-none focus:border-[#25D366]"
                />

                <p className="text-gray-500 text-xs mt-1">
                  This template needs{" "}
                  <strong>
                    {selectedMetaTemplate.paramCount} parameter
                    {selectedMetaTemplate.paramCount === 1 ? "" : "s"}
                  </strong>
                  , one per line, in order — line 1 fills {"{{1}}"}, line 2
                  fills {"{{2}}"}, and so on. You can use{" "}
                  {"{{customer_name}}"} in any line to personalize it per
                  recipient.
                  {selectedMetaTemplate.bodyText && (
                    <>
                      {" "}Approved body preview: "{selectedMetaTemplate.bodyText}"
                    </>
                  )}
                </p>
              </div>
            )}

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
                onClick={onClose}
                className="crm-secondary-button"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="crm-primary-button"
              >
                Update Template
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}