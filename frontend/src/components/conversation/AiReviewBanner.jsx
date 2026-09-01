import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import toast from "react-hot-toast";

import useLeadStore from "../../store/leadStore";
import { sendLeadToErp } from "../../api/leadApi";
import { resolveMessageClassification } from "../../api/messageApi";

// Shown above the chat when the latest inbound message's AI
// classification failed after all retries (classificationStatus ===
// "FAILED") — lets an employee do by hand what the AI pipeline would
// normally do automatically: create a Lead from this conversation,
// then forward it to the external ERP-CRM. Both actions reuse the
// exact same backend logic/endpoints the automated flow uses.
export default function AiReviewBanner({ message, conversation, onResolved }) {
  const { addLead } = useLeadStore();

  const [showForm, setShowForm] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [createdLead, setCreatedLead] = useState(null);

  const [form, setForm] = useState({
    name: conversation?.customer?.name || "",
    phone: conversation?.phone || conversation?.customer?.phone || "",
    company: "",
    email: "",
    requirements: message?.content || "",
  });

  if (!message) return null;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreateLead = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.phone.trim()) {
      toast.error("Name and phone are required.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await addLead({
        name: form.name.trim(),
        phone: form.phone.trim(),
        company: form.company.trim() || undefined,
        email: form.email.trim() || undefined,
        requirements: form.requirements.trim() || undefined,
        source: "WhatsApp (manual review)",
        status: "NEW",
      });

      setCreatedLead(response?.data || null);

      toast.success("Lead created.");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to create lead."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendToErp = async () => {
    if (!createdLead?.id) return;

    setSubmitting(true);

    try {
      await sendLeadToErp(createdLead.id);

      toast.success("Lead sent to ERP-CRM.");

      await handleResolve();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Couldn't reach the ERP-CRM system. Try again shortly."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleResolve = async () => {
    try {
      await resolveMessageClassification(message.id);
    } catch (error) {
      console.error("Failed to mark classification resolved:", error);
    } finally {
      onResolved?.(message.id);
    }
  };

  return (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-3">
      <div className="flex items-start gap-3">
        <AlertTriangle
          size={18}
          className="mt-0.5 flex-shrink-0 text-amber-500"
        />

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-amber-800">
            AI classification failed for this message
          </p>

          <p className="mt-0.5 text-xs text-amber-700">
            Gemini couldn't process this enquiry automatically. Review it and
            create a Lead / send it to ERP-CRM manually, or dismiss if no
            action is needed.
          </p>

          {!showForm && !createdLead && (
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => setShowForm(true)}
                className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-amber-700"
              >
                Create Lead
              </button>

              <button
                onClick={handleResolve}
                className="rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium text-amber-700 transition hover:bg-amber-100"
              >
                Dismiss (no action needed)
              </button>
            </div>
          )}

          {showForm && !createdLead && (
            <form
              onSubmit={handleCreateLead}
              className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2"
            >
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Name *"
                className="rounded-lg border border-amber-300 px-3 py-1.5 text-xs outline-none focus:border-amber-500"
              />
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone *"
                className="rounded-lg border border-amber-300 px-3 py-1.5 text-xs outline-none focus:border-amber-500"
              />
              <input
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="Company (optional)"
                className="rounded-lg border border-amber-300 px-3 py-1.5 text-xs outline-none focus:border-amber-500"
              />
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email (optional)"
                className="rounded-lg border border-amber-300 px-3 py-1.5 text-xs outline-none focus:border-amber-500"
              />
              <textarea
                name="requirements"
                value={form.requirements}
                onChange={handleChange}
                rows={2}
                placeholder="What are they looking for?"
                className="col-span-full rounded-lg border border-amber-300 px-3 py-1.5 text-xs outline-none focus:border-amber-500"
              />

              <div className="col-span-full flex gap-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Creating..." : "Create Lead"}
                </button>

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium text-amber-700 transition hover:bg-amber-100"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {createdLead && (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-amber-800">
                Lead "{createdLead.name}" created.
              </span>

              <button
                onClick={handleSendToErp}
                disabled={submitting}
                className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Sending..." : "Send to ERP-CRM"}
              </button>

              <button
                onClick={handleResolve}
                className="rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium text-amber-700 transition hover:bg-amber-100"
              >
                Done (skip ERP send)
              </button>
            </div>
          )}
        </div>

        <button
          onClick={handleResolve}
          className="flex-shrink-0 rounded-full p-1 text-amber-500 transition hover:bg-amber-100"
          title="Dismiss"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}