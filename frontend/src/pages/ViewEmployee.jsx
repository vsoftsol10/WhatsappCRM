import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiUser,
  FiMail,
  FiPhone,
  FiBriefcase,
  FiShield,
  FiEdit2,
} from "react-icons/fi";

import apiClient from "../api/apiClient";
import toast from "react-hot-toast";

const ViewEmployee = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployee();
  }, []);

  const fetchEmployee = async () => {
    try {
      const response = await apiClient.get(
        `/api/employees/${id}`
      );

      setEmployee(response.data.employee);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load employee.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="crm-page flex items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-500">
          Loading Employee...
        </p>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="crm-page flex items-center justify-center bg-gray-100">
        <p className="text-lg text-red-500">
          Employee not found.
        </p>
      </div>
    );
  }

  return (
    <div className="crm-page bg-gray-100">

      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

          <button
            onClick={() => navigate("/employees")}
            className="p-3 rounded-xl bg-white shadow hover:bg-gray-50 transition"
          >
            <FiArrowLeft size={20} />
          </button>

          <div className="min-w-0">
            <h1 className="crm-title">
              Employee Details
            </h1>

            <p className="crm-subtitle">
              View employee information.
            </p>
          </div>

        </div>

        {/* <button
          onClick={() =>
            navigate(`/employees/edit/${employee.id}`)
          }
          className="flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-black font-semibold px-5 py-3 rounded-xl shadow transition"
        >
          <FiEdit2 />
          Edit Employee
        </button> */}

      </div>

      {/* Profile Card */}
      <div className="crm-page-surface mb-8 p-5 sm:p-8">

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">

          <div className="w-24 h-24 rounded-full bg-[#25D366] flex items-center justify-center text-4xl font-bold text-black">
            {employee.name?.charAt(0).toUpperCase()}
          </div>

          <div className="min-w-0">

            <h2 className="break-words text-2xl font-bold text-gray-900 sm:text-3xl">
              {employee.name}
            </h2>

            <p className="text-gray-500 mt-2">
              {employee.designation || "Employee"}
            </p>

            {/* <span
              className={`inline-block mt-4 px-4 py-2 rounded-full text-sm font-semibold ${
                employee.status === "ACTIVE"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {employee.status}
            </span> */}

          </div>

        </div>

      </div>

            {/* Information Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Contact Information */}
        <div className="crm-page-surface p-5 sm:p-6">

          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Contact Information
          </h2>

          <div className="space-y-5">

            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-100">
                <FiMail className="text-blue-600" size={20} />
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Email
                </p>

                <p className="font-semibold text-gray-800 break-all">
                  {employee.email || "-"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-100">
                <FiPhone className="text-[#128C7E]" size={20} />
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Phone
                </p>

                <p className="font-semibold text-gray-800">
                  {employee.phone || "-"}
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* Employee Information */}
        <div className="crm-page-surface p-5 sm:p-6">

          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Employee Information
          </h2>

          <div className="space-y-5">

            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-[#DCF8C6]">
                <FiBriefcase
                  className="text-[#25D366]"
                  size={20}
                />
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Department
                </p>

                <p className="font-semibold text-gray-800">
                  {employee.department || "-"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-red-100">
                <FiShield
                  className="text-red-600"
                  size={20}
                />
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Role
                </p>

                <span
                  className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${
                    employee.role === "ADMIN"
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-[#128C7E]"
                  }`}
                >
                  {employee.role}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-gray-100">
                <FiUser
                  className="text-gray-600"
                  size={20}
                />
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Designation
                </p>

                <p className="font-semibold text-gray-800">
                  {employee.designation || "-"}
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Footer */}
      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:gap-4">

        <button
          onClick={() => navigate("/employees")}
          className="crm-secondary-button"
        >
          Back
        </button>

        <button
          onClick={() =>
            navigate(`/employees/edit/${employee.id}`)
          }
          className="crm-primary-button"
        >
          <FiEdit2 />
          Edit Employee
        </button>

      </div>

    </div>
  );
};

export default ViewEmployee;
