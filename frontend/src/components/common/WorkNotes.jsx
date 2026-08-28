import { useEffect, useState } from "react";
import { StickyNote, Pencil, Trash2, User } from "lucide-react";
import toast from "react-hot-toast";

import { useAuthStore } from "../../store/authStore";
import ConfirmModal from "./ConfirmModal";

/**
 * Reusable Work Notes section.
 *
 * Works identically for Lead, Task, and Ticket modules — the parent
 * component only needs to pass the entity id and the matching API
 * functions (getNotes / addNote / editNote / removeNote).
 *
 * Props:
 * - entityId:  id of the Lead / Task / Ticket the notes belong to
 * - getNotes:  (entityId) => Promise<{ data: WorkNote[] }>
 * - addNote:   (entityId, note) => Promise<{ data: WorkNote }>
 * - editNote:  (noteId, note) => Promise<{ data: WorkNote }>
 * - removeNote:(noteId) => Promise<void>
 */
export default function WorkNotes({
  entityId,
  getNotes,
  addNote,
  editNote,
  removeNote,
}) {
  const { user } = useAuthStore();

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [newNote, setNewNote] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const fetchNotes = async () => {
    if (!entityId) return;

    try {
      setLoading(true);

      const response = await getNotes(entityId);

      const sorted = [...(response?.data || [])].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setNotes(sorted);
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to load work notes"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityId]);

  const canManage = (note) =>
    user?.role === "ADMIN" || note.employeeId === user?.id;

  const handleAdd = async () => {
    if (!newNote.trim()) {
      toast.error("Note cannot be empty");
      return;
    }

    try {
      setSubmitting(true);

      await addNote(entityId, newNote.trim());

      setNewNote("");

      toast.success("Work note added");

      await fetchNotes();
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to add work note"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (note) => {
    setEditingId(note.id);
    setEditValue(note.note);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };

  const handleEditSave = async (noteId) => {
    if (!editValue.trim()) {
      toast.error("Note cannot be empty");
      return;
    }

    try {
      setSubmitting(true);

      await editNote(noteId, editValue.trim());

      toast.success("Work note updated");

      cancelEdit();

      await fetchNotes();
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to update work note"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (noteId) => {
    setDeleteTargetId(noteId);
  };

  const confirmDelete = async () => {
    const noteId = deleteTargetId;
    setDeleteTargetId(null);

    try {
      await removeNote(noteId);

      toast.success("Work note deleted");

      await fetchNotes();
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to delete work note"
      );
    }
  };

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <StickyNote size={16} className="text-[#128C7E]" />
        <h3 className="font-semibold text-gray-800">
          Work Notes
        </h3>
      </div>

      {/* Add Note */}
      <div className="mb-4 rounded-xl border border-gray-200 bg-gray-50 p-3">
        <textarea
          rows="2"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
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

      {/* Notes List */}
      {loading ? (
        <p className="py-4 text-center text-sm text-gray-500">
          Loading notes...
        </p>
      ) : notes.length === 0 ? (
        <p className="py-4 text-center text-sm text-gray-500">
          No work notes yet.
        </p>
      ) : (
        <div className="space-y-3">
          {notes.map((note) => (
            <div
              key={note.id}
              className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-[#DCF8C6] p-1.5 text-[#128C7E]">
                    <User size={13} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {note.employee?.name || "Unknown"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(note.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {canManage(note) && editingId !== note.id && (
                  <div className="flex shrink-0 gap-1">
                    <button
                      type="button"
                      onClick={() => startEdit(note)}
                      className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
                      title="Edit"
                    >
                      <Pencil size={14} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(note.id)}
                      className="rounded-lg p-1.5 text-red-500 hover:bg-red-50"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>

              {editingId === note.id ? (
                <div className="mt-2">
                  <textarea
                    rows="2"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#25D366]"
                  />

                  <div className="mt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="crm-secondary-button px-3 py-1.5 text-xs"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      disabled={submitting}
                      onClick={() => handleEditSave(note.id)}
                      className="crm-primary-button px-3 py-1.5 text-xs"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700">
                  {note.note}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTargetId}
        title="Delete Work Note"
        message="Are you sure you want to delete this work note? This cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}