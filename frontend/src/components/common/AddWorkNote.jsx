import { useState } from "react";
import { StickyNote } from "lucide-react";
import toast from "react-hot-toast";

/**
 * Create-only Work Note box for Edit modals.
 *
 * Unlike <WorkNotes /> (used in View modals, which lists notes with
 * edit/delete), this only lets the employee add a new note — no list,
 * no edit, no delete. Works identically for Lead, Task, and Ticket
 * modules; the parent just passes the entity id and the matching
 * "add" API function.
 *
 * Props:
 * - entityId: id of the Lead / Task / Ticket the note belongs to
 * - addNote:  (entityId, note) => Promise<{ data: WorkNote }>
 * - onAdded:  optional callback fired after a note is added successfully
 */
export default function AddWorkNote({ entityId, addNote, onAdded }) {
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleAdd = async () => {
    if (!note.trim()) {
      toast.error("Note cannot be empty");
      return;
    }

    if (!entityId) return;

    try {
      setSubmitting(true);

      await addNote(entityId, note.trim());

      setNote("");

      toast.success("Work note added");

      if (onAdded) {
        await onAdded();
      }
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message || "Failed to add work note"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <StickyNote size={16} className="text-[#128C7E]" />
        <h3 className="font-semibold text-gray-800">Work Note</h3>
      </div>

      <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
        <textarea
          rows="2"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add Note..."
          className="w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#25D366]"
        />

        <div className="mt-2 flex justify-end">
          <button
            type="button"
            disabled={submitting}
            onClick={handleAdd}
            className="crm-primary-button px-4 py-2 text-sm"
          >
            {submitting ? "Adding..." : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}