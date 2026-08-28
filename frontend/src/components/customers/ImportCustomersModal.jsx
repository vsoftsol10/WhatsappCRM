import { useEffect, useRef, useState } from "react";
import { X, Upload, Download, AlertTriangle, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

import {
  previewBulkImportCustomers,
  confirmBulkImportCustomers,
} from "../../api/customerApi";

// Downloadable sample so the customer knows what columns/headers we
// recognize. Kept as a plain client-side blob — no backend round trip
// needed for a static template file.
const SAMPLE_CSV =
  "Name,Phone,Email,Company,Source,Requirements\n" +
  "Ravi Kumar,9876543210,ravi@example.com,Ravi Traders,Website,Interested in bulk orders\n" +
  "Priya Sharma,9123456780,priya@example.com,Sharma Textiles,Referral,\n";

function downloadSampleTemplate() {
  const blob = new Blob([SAMPLE_CSV], { type: "text/csv" });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;

  link.download = "customer_import_template.csv";

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

// Builds and downloads a CSV of just the rows that failed, so the
// customer can fix and re-upload only those instead of the whole file.
function downloadFailedRowsCsv(failedRows) {
  const header = "Row,Name,Phone,Email,Company,Reason\n";

  const lines = failedRows.map((r) => {
    const d = r.data || {};

    const escape = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;

    return [
      r.rowNumber ?? "",
      escape(d.name),
      escape(d.phone),
      escape(d.email),
      escape(d.company),
      escape(r.reason),
    ].join(",");
  });

  const blob = new Blob([header + lines.join("\n")], { type: "text/csv" });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;

  link.download = "import_failed_rows.csv";

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

const STEP = {
  UPLOAD: "upload",
  PREVIEW: "preview",
  RESULT: "result",
};

export default function ImportCustomersModal({ isOpen, onClose, onSuccess }) {
  const [step, setStep] = useState(STEP.UPLOAD);

  const [dragActive, setDragActive] = useState(false);

  const [uploading, setUploading] = useState(false);

  const [importing, setImporting] = useState(false);

  const [preview, setPreview] = useState(null); // { totalRows, ready, duplicates, invalid }

  // rowNumber -> "update" | "skip", only for rows in preview.duplicates.
  // Defaults to "skip" for every duplicate until the customer explicitly
  // opts in, so nothing gets overwritten by accident.
  const [duplicateDecisions, setDuplicateDecisions] = useState({});

  const [result, setResult] = useState(null); // { created, updated, failed, failedRows }

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStep(STEP.UPLOAD);
      setPreview(null);
      setDuplicateDecisions({});
      setResult(null);
      setUploading(false);
      setImporting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFile = async (file) => {
    if (!file) return;

    const isAllowed = /\.(csv|xlsx|xls)$/i.test(file.name);

    if (!isAllowed) {
      toast.error("Please upload a .csv or .xlsx file.");
      return;
    }

    setUploading(true);

    try {
      const res = await previewBulkImportCustomers(file);

      const data = res?.data || { totalRows: 0, ready: [], duplicates: [], invalid: [] };

      setPreview(data);

      // Default every duplicate to "skip".
      const decisions = {};
      for (const d of data.duplicates) {
        decisions[d.rowNumber] = "skip";
      }
      setDuplicateDecisions(decisions);

      setStep(STEP.PREVIEW);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Couldn't read that file. Please check the format and try again."
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const toggleDuplicateDecision = (rowNumber) => {
    setDuplicateDecisions((prev) => ({
      ...prev,
      [rowNumber]: prev[rowNumber] === "update" ? "skip" : "update",
    }));
  };

  const handleConfirmImport = async () => {
    if (!preview) return;

    const toCreate = preview.ready.map((r) => ({
      rowNumber: r.rowNumber,
      data: r.data,
    }));

    const toUpdate = preview.duplicates
      .filter((d) => duplicateDecisions[d.rowNumber] === "update")
      .map((d) => ({
        rowNumber: d.rowNumber,
        existingCustomerId: d.existingCustomer.id,
        data: d.incoming,
      }));

    if (toCreate.length === 0 && toUpdate.length === 0) {
      toast.error("Nothing to import — every row was skipped or invalid.");
      return;
    }

    setImporting(true);

    try {
      const res = await confirmBulkImportCustomers({ toCreate, toUpdate });

      setResult(res.data);

      setStep(STEP.RESULT);

      onSuccess?.();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Import failed. Please try again."
      );
    } finally {
      setImporting(false);
    }
  };

  const updateCount = Object.values(duplicateDecisions).filter(
    (v) => v === "update"
  ).length;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Import Customers
              </h2>
              <p className="text-sm text-gray-500">
                Upload a CSV or Excel file to add many customers at once.
              </p>
            </div>

            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
            {/* ---------- STEP 1: UPLOAD ---------- */}
            {step === STEP.UPLOAD && (
              <div className="space-y-4">
                <button
                  onClick={downloadSampleTemplate}
                  className="flex items-center gap-2 text-sm font-medium text-[#128C7E] hover:underline"
                >
                  <Download size={16} />
                  Download sample CSV template
                </button>

                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-12 text-center transition ${
                    dragActive
                      ? "border-[#25D366] bg-[#DCF8C6]/30"
                      : "border-gray-300 bg-gray-50 hover:border-gray-400"
                  }`}
                >
                  <Upload size={28} className="text-gray-400" />

                  <p className="text-sm font-medium text-gray-700">
                    {uploading
                      ? "Reading file…"
                      : "Click to upload, or drag and drop"}
                  </p>

                  <p className="text-xs text-gray-500">
                    .csv or .xlsx — up to 5,000 rows
                  </p>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    className="hidden"
                    onChange={(e) => handleFile(e.target.files?.[0])}
                  />
                </div>

                <p className="text-xs text-gray-500">
                  Recognized columns: Name, Phone, Email, Company, Source,
                  Requirements — header names are matched flexibly (e.g.
                  "Mobile Number" also works for Phone).
                </p>
              </div>
            )}

            {/* ---------- STEP 2: PREVIEW ---------- */}
            {step === STEP.PREVIEW && preview && (
              <div className="space-y-5">
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-center">
                    <p className="text-2xl font-bold text-green-700">
                      {preview.ready.length}
                    </p>
                    <p className="text-xs text-green-700">Ready to import</p>
                  </div>

                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-center">
                    <p className="text-2xl font-bold text-amber-700">
                      {preview.duplicates.length}
                    </p>
                    <p className="text-xs text-amber-700">
                      Already exist
                    </p>
                  </div>

                  <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-center">
                    <p className="text-2xl font-bold text-red-700">
                      {preview.invalid.length}
                    </p>
                    <p className="text-xs text-red-700">Invalid rows</p>
                  </div>
                </div>

                {/* Duplicates — the customer decides per row */}
                {preview.duplicates.length > 0 && (
                  <div>
                    <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-800">
                      <AlertTriangle size={16} className="text-amber-500" />
                      Already in your customer list ({preview.duplicates.length})
                    </h3>

                    <p className="mb-2 text-xs text-gray-500">
                      These phone numbers already belong to an existing
                      customer. Turn on "Update" for the ones you want
                      overwritten with the new file's data — everything
                      else is left untouched.
                    </p>

                    <div className="max-h-56 overflow-y-auto rounded-xl border border-gray-200">
                      <table className="w-full text-left text-xs">
                        <thead className="sticky top-0 bg-gray-50 text-gray-600">
                          <tr>
                            <th className="px-3 py-2">Row</th>
                            <th className="px-3 py-2">Existing (in CRM)</th>
                            <th className="px-3 py-2">Incoming (in file)</th>
                            <th className="px-3 py-2 text-center">Update?</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {preview.duplicates.map((d) => (
                            <tr key={d.rowNumber}>
                              <td className="px-3 py-2 text-gray-500">
                                {d.rowNumber}
                              </td>
                              <td className="px-3 py-2">
                                <div className="font-medium text-gray-800">
                                  {d.existingCustomer.name}
                                </div>
                                <div className="text-gray-500">
                                  {d.existingCustomer.phone}
                                  {d.existingCustomer.email
                                    ? ` · ${d.existingCustomer.email}`
                                    : ""}
                                </div>
                              </td>
                              <td className="px-3 py-2">
                                <div className="font-medium text-gray-800">
                                  {d.incoming.name}
                                </div>
                                <div className="text-gray-500">
                                  {d.incoming.phone}
                                  {d.incoming.email
                                    ? ` · ${d.incoming.email}`
                                    : ""}
                                </div>
                              </td>
                              <td className="px-3 py-2 text-center">
                                <input
                                  type="checkbox"
                                  checked={
                                    duplicateDecisions[d.rowNumber] === "update"
                                  }
                                  onChange={() =>
                                    toggleDuplicateDecision(d.rowNumber)
                                  }
                                  className="h-4 w-4 accent-[#25D366]"
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Invalid rows — informational only, can't be fixed here */}
                {preview.invalid.length > 0 && (
                  <div>
                    <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-800">
                      <AlertTriangle size={16} className="text-red-500" />
                      Couldn't be imported ({preview.invalid.length})
                    </h3>

                    <div className="max-h-40 overflow-y-auto rounded-xl border border-gray-200">
                      <table className="w-full text-left text-xs">
                        <thead className="sticky top-0 bg-gray-50 text-gray-600">
                          <tr>
                            <th className="px-3 py-2">Row</th>
                            <th className="px-3 py-2">Name</th>
                            <th className="px-3 py-2">Phone</th>
                            <th className="px-3 py-2">Reason</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {preview.invalid.map((r) => (
                            <tr key={r.rowNumber}>
                              <td className="px-3 py-2 text-gray-500">
                                {r.rowNumber}
                              </td>
                              <td className="px-3 py-2">{r.data?.name}</td>
                              <td className="px-3 py-2">{r.data?.phone}</td>
                              <td className="px-3 py-2 text-red-600">
                                {r.reason}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {preview.ready.length === 0 &&
                  preview.duplicates.length === 0 &&
                  preview.invalid.length > 0 && (
                    <p className="text-sm text-gray-500">
                      Every row in this file had a problem — fix the issues
                      above and re-upload.
                    </p>
                  )}
              </div>
            )}

            {/* ---------- STEP 3: RESULT ---------- */}
            {step === STEP.RESULT && result && (
              <div className="space-y-4 text-center">
                <CheckCircle2 size={40} className="mx-auto text-green-500" />

                <h3 className="text-lg font-bold text-gray-900">
                  Import complete
                </h3>

                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-xl border border-green-200 bg-green-50 p-3">
                    <p className="text-2xl font-bold text-green-700">
                      {result.created}
                    </p>
                    <p className="text-xs text-green-700">Created</p>
                  </div>

                  <div className="rounded-xl border border-blue-200 bg-blue-50 p-3">
                    <p className="text-2xl font-bold text-blue-700">
                      {result.updated}
                    </p>
                    <p className="text-xs text-blue-700">Updated</p>
                  </div>

                  <div className="rounded-xl border border-red-200 bg-red-50 p-3">
                    <p className="text-2xl font-bold text-red-700">
                      {result.failed}
                    </p>
                    <p className="text-xs text-red-700">Failed</p>
                  </div>
                </div>

                {result.failed > 0 && (
                  <button
                    onClick={() => downloadFailedRowsCsv(result.failedRows)}
                    className="mx-auto flex items-center gap-2 text-sm font-medium text-[#128C7E] hover:underline"
                  >
                    <Download size={16} />
                    Download failed rows ({result.failed})
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
            {step === STEP.PREVIEW && (
              <>
                <button
                  onClick={() => setStep(STEP.UPLOAD)}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
                >
                  Back
                </button>

                <button
                  onClick={handleConfirmImport}
                  disabled={importing}
                  className="crm-primary-button disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {importing
                    ? "Importing…"
                    : `Import ${preview.ready.length + updateCount} customer${
                        preview.ready.length + updateCount === 1 ? "" : "s"
                      }`}
                </button>
              </>
            )}

            {step === STEP.RESULT && (
              <button onClick={onClose} className="crm-primary-button">
                Done
              </button>
            )}

            {step === STEP.UPLOAD && (
              <button
                onClick={onClose}
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}