import { useEffect, useState } from "react";
import { X, Mail, Phone, Briefcase, Shield, User } from "lucide-react";
import apiClient from "../../api/apiClient";
import toast from "react-hot-toast";

export default function ViewEmployeeModal({
  isOpen,
  employeeId,
  onClose,
  onEdit,
}) {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen || !employeeId) return;

    const fetchEmployee = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/api/employees/${employeeId}`);
        setEmployee(response.data.employee);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load employee.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [isOpen, employeeId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between bg-[#25D366] px-6 py-5">
            <div className="min-w-0">
              <h2 className="break-words text-xl font-bold text-gray-800">
                {loading ? "Loading..." : employee?.name}
              </h2>
              {!loading && employee?.designation && (
                <p className="mt-1 text-sm text-black/70">
                  {employee.designation}
                </p>
              )}
            </div>

            <button
              onClick={onClose}
              className="rounded-full p-2 transition hover:bg-[#128C7E]"
            >
              <X size={22} />
            </button>
          </div>

          {/* Body */}
          <div className="max-h-[70vh] space-y-5 overflow-y-auto p-6">
            {loading ? (
              <p className="py-10 text-center text-gray-500">
                Loading employee...
              </p>
            ) : !employee ? (
              <p className="py-10 text-center text-red-500">
                Employee not found.
              </p>
            ) : (
              <>
                <InfoRow icon={Mail} label="Email" value={employee.email} />
                <InfoRow icon={Phone} label="Phone" value={employee.phone} />
                <InfoRow
                  icon={Briefcase}
                  label="Department"
                  value={employee.department}
                />
                <InfoRow
                  icon={User}
                  label="Designation"
                  value={employee.designation}
                />

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-lg bg-[#DCF8C6] p-2 text-[#128C7E]">
                    <Shield size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-400">Role</p>
                    <span
                      className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        employee.role === "ADMIN"
                          ? "bg-red-100 text-red-600"
                          : "bg-green-100 text-[#128C7E]"
                      }`}
                    >
                      {employee.role}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t px-6 py-4">
            <button
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-6 py-2.5 text-gray-700 transition hover:bg-gray-100"
            >
              Close
            </button>

            {employee && (
              <button
                onClick={() => {
                  onEdit?.(employee.id);
                  onClose();
                }}
                className="crm-primary-button"
              >
                Edit Employee
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  if (!value) return null;

  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 rounded-lg bg-[#DCF8C6] p-2 text-[#128C7E]">
        <Icon size={16} />
      </div>
      <div>
        <p className="text-xs font-medium text-gray-400">{label}</p>
        <p className="text-sm font-medium text-gray-800">{value}</p>
      </div>
    </div>
  );
}