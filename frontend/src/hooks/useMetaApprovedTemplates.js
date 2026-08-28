import { useState, useEffect, useCallback } from "react";
import { getMetaApprovedTemplates } from "../api/templateApi";

// Shared by CreateCampaignModal, EditCampaignModal, CreateTemplateModal,
// and EditTemplateModal. Fetches the live, APPROVED-only template list
// from WhatsApp Business Manager (via our backend) so those modals can
// offer a dropdown instead of a free-text "type the exact name" field —
// the root cause of the 132001 typo/language-mismatch errors we hit
// earlier is eliminated by construction, since only real, approved
// (name, language) pairs are ever selectable.
export default function useMetaApprovedTemplates(isOpen) {
  const [templates, setTemplates] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const fetchTemplates = useCallback(async () => {
    setLoading(true);

    setError("");

    try {
      const res = await getMetaApprovedTemplates();

      setTemplates(res?.data || []);
    } catch (err) {
      // Non-fatal: the dedicated-template feature just becomes
      // unavailable for this session. Generic template sending (the
      // built-in fallback) still works fine without this list.
      console.error("Failed to fetch Meta approved templates:", err);

      setError(
        "Couldn't load approved templates from WhatsApp Business Manager. You can still use the generic template, or try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Only fetch when the modal is actually open, and only fetch once
    // per open (not on every keystroke/re-render).
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchTemplates();
    }
  }, [isOpen, fetchTemplates]);

  return { templates, loading, error, refetch: fetchTemplates };
}