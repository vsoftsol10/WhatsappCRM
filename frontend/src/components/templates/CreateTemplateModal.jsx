import { useState } from "react";
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
  Headset,} 
  from "lucide-react";
import useTemplateStore from "../../store/templateStore";
import toast from "react-hot-toast";

export default function CreateTemplateModal({
  isOpen,
  onClose,
}) {
  const { addTemplate, generateTemplate } = useTemplateStore();

  const [formData, setFormData] = useState({
    name: "",
    category: "SUPPORT",
    messageType: "TEXT",
    content: "",
    status: "DRAFT",
    metaTemplateName: "",
    metaTemplateLanguage: "en_US",
  });

  // One line per Meta template body placeholder, in order: line 1 fills
  // {{1}}, line 2 fills {{2}}, etc. Only used when metaTemplateName is set.
  const [templateParamsText, setTemplateParamsText] = useState("");

  const [aiPrompt, setAiPrompt] = useState("");

  const [aiTone, setAiTone] = useState("Professional");

  const [generating, setGenerating] = useState(false);

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

  const [errors, setErrors] = useState({});

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
      await addTemplate({
        ...formData,
        templateParams,
      });

      toast.success("Template created successfully!");

      setFormData({
        name: "",
        category: "SUPPORT",
        messageType: "TEXT",
        content: "",
        status: "DRAFT",
        metaTemplateName: "",
        metaTemplateLanguage: "en_US",
      });

      setTemplateParamsText("");

      setErrors({});

      onClose();
    } catch (error) {
      toast.error("Failed to create template!");
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
              Create Template
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
                <option value="MEDIA">Media</option>
              </select>

              {errors.messageType && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.messageType}
                </p>
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

              {errors.content && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.content}
                </p>
              )}
            </div>

            {/* Meta Template Name */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Meta Approved Template Name (optional)
              </label>

              <input
                type="text"
                name="metaTemplateName"
                placeholder="e.g. vedaconnect_meetup_invite — leave blank to use the default"
                value={formData.metaTemplateName}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 focus:border-[#25D366] px-4 py-3 outline-none"
              />

              <p className="text-gray-500 text-xs mt-1">
                Only fill this in if this exact message was approved as its
                own template in WhatsApp Business Manager (full formatting
                baked in, only the customer's name as a variable). Leave
                blank to send via the generic template — line breaks won't
                be preserved on WhatsApp for that one.
              </p>
            </div>

            {/* Dedicated Template Body Parameters */}
            {formData.metaTemplateName.trim() && (
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
                  Line 1 fills {"{{1}}"} in "{formData.metaTemplateName.trim()}", line 2 fills {"{{2}}"}, and so on — match the exact order and count approved in WhatsApp Manager, or Meta will reject the send. You can use {"{{customer_name}}"} in any line to personalize it per recipient.
                </p>
              </div>
            )}

            {/* Meta Template Language */}
            {formData.metaTemplateName && (
              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Meta Template Language
                </label>

                <input
                  type="text"
                  name="metaTemplateLanguage"
                  placeholder="e.g. en_US or en"
                  value={formData.metaTemplateLanguage}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 focus:border-[#25D366] px-4 py-3 outline-none"
                />

                <p className="text-gray-500 text-xs mt-1">
                  Must match the language shown for this template in
                  WhatsApp Business Manager exactly (e.g. "en_US" for
                  "English (US)", "en" for plain "English") — a mismatch
                  makes WhatsApp reject the send.
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
                {/* <option value="APPROVED">Approved</option> */}
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
                Create Template
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}