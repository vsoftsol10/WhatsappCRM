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
      <div className="min-h-screen bg-gray-100 ml-8 flex items-center justify-center">
        <p className="text-lg text-gray-500">
          Loading Employee...
        </p>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-screen bg-gray-100 ml-8 flex items-center justify-center">
        <p className="text-lg text-red-500">
          Employee not found.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 ml-8 p-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">

        <div className="flex items-center gap-4">

          <button
            onClick={() => navigate("/employees")}
            className="p-3 rounded-xl bg-white shadow hover:bg-gray-50 transition"
          >
            <FiArrowLeft size={20} />
          </button>

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Employee Details
            </h1>

            <p className="text-gray-500 mt-1">
              View employee information.
            </p>
          </div>

        </div>

        {/* <button
          onClick={() =>
            navigate(`/employees/edit/${employee.id}`)
          }
          className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-5 py-3 rounded-xl shadow transition"
        >
          <FiEdit2 />
          Edit Employee
        </button> */}

      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">

        <div className="flex items-center gap-6">

          <div className="w-24 h-24 rounded-full bg-yellow-400 flex items-center justify-center text-4xl font-bold text-black">
            {employee.name?.charAt(0).toUpperCase()}
          </div>

          <div>

            <h2 className="text-3xl font-bold text-gray-900">
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
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">

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
                <FiPhone className="text-green-600" size={20} />
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
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">

          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Employee Information
          </h2>

          <div className="space-y-5">

            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-yellow-100">
                <FiBriefcase
                  className="text-yellow-600"
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
                      : "bg-green-100 text-green-600"
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
      <div className="mt-8 flex justify-end gap-4">

        <button
          onClick={() => navigate("/employees")}
          className="px-6 py-3 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 font-semibold transition"
        >
          Back
        </button>

        <button
          onClick={() =>
            navigate(`/employees/edit/${employee.id}`)
          }
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-black font-semibold transition"
        >
          <FiEdit2 />
          Edit Employee
        </button>

      </div>

    </div>
  );
};

export default ViewEmployee;