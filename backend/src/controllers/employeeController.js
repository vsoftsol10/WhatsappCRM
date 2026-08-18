// const prisma = require("../config/prisma");
// const bcrypt = require("bcryptjs");
// const generatePassword = require("../utils/generatePassword");
// const sendEmployeeCredentials = require("../services/emailService");

// // CREATE EMPLOYEE
// const createEmployee = async (req, res) => {
//   try {
//     const { 
//       name, 
//       email, 
//       phone, 
//       department, 
//       designation, 
//       address,
//       role,
//       status,
//      } = req.body;

//     const existingUser = await prisma.user.findUnique({
//       where: { email },
//     });

//     if (existingUser) {
//       return res.status(400).json({
//         success: false,
//         message: "Employee already exists",
//       });
//     }

//     const tempPassword = generatePassword();

//     const hashedPassword = await bcrypt.hash(tempPassword, 10);

//     const employee = await prisma.user.create({
//       data: {
//         name,
//         email,
//         password: hashedPassword,
//         role: role || "USER",
//         status: status || "ACTIVE",
//         phone,
//         department,
//         designation,
//         address
//       },
//     });

//     await sendEmployeeCredentials(name, email, tempPassword);

//     res.status(201).json({
//       success: true,
//       message: "Employee created successfully",
//       employee,
//     });
//   } catch (error) {
//     console.error(error);

//     res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//     });
//   }
// };

// // GET ALL EMPLOYEES
// const getEmployees = async (req, res) => {
//   try {
//     const employees = await prisma.user.findMany({
//       where: {
//         role: "USER",
//         status: "ACTIVE",
//       },
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         phone: true,
//         department: true,
//         designation: true,
//         address: true,
//         role: true,
//         status: true,
//       },
//     });

//     res.status(200).json({
//       success: true,
//       employees,
//     });
//   } catch (error) {
//     console.error(error);

//     res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//     });
//   }
// };

// // GET EMPLOYEE BY ID
// const getEmployeeById = async (req, res) => {
//   try {
//     const employee = await prisma.user.findUnique({
//       where: {
//         id: req.params.id,
//       },
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         phone: true,
//         department: true,
//         designation: true,
//         address: true,
//         role: true,
//         status: true,
//       },
//     });

//     if (!employee) {
//       return res.status(404).json({
//         success: false,
//         message: "Employee not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       employee,
//     });
//   } catch (error) {
//     console.error(error);

//     res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//     });
//   }
// };

// // UPDATE EMPLOYEE
// const VALID_ROLES = ["USER", "ADMIN"];
// const VALID_STATUSES = ["ACTIVE", "INACTIVE"];

// const updateEmployee = async (req, res) => {
//   try {
//     const { 
//       name, 
//       email, 
//       phone, 
//       department, 
//       designation, 
//       address, 
//       role, 
//       status,
//     } = req.body;

//     if (role !== undefined && !VALID_ROLES.includes(role)) {
//       return res.status(400).json({
//         success: false,
//         message: `Invalid role. Must be one of: ${VALID_ROLES.join(", ")}`,
//       });
//     }

//     if (status !== undefined && !VALID_STATUSES.includes(status)) {
//       return res.status(400).json({
//         success: false,
//         message: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`,
//       });
//     }

//     const employee = await prisma.user.update({
//       where: {
//         id: req.params.id,
//       },
//       data: {
//         name,
//         email,
//         phone,
//         department,
//         designation,
//         address,
//         role,
//         status,
//       },
//     });

//     res.status(200).json({
//       success: true,
//       message: "Employee updated successfully",
//       employee,
//     });
//   } catch (error) {
//     console.error(error);

//     res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//     });
//   }
// };

// // DELETE EMPLOYEE
// const deleteEmployee = async (req, res) => {
//   try {
//     const employeeId = req.params.id;

//     // Check assigned tasks
//     const taskCount = await prisma.task.count({
//       where: {
//         assignedToId: employeeId,
//       },
//     });

//     if (taskCount > 0) {
//       return res.status(400).json({
//         success: false,
//         message: `Cannot delete employee. ${taskCount} task(s) are still assigned.`,
//       });
//     }

//     // Check assigned deals
//     const dealCount = await prisma.deal.count({
//       where: {
//         assignedToId: employeeId,
//       },
//     });

//     if (dealCount > 0) {
//       return res.status(400).json({
//         success: false,
//         message: `Cannot delete employee. ${dealCount} deal(s) are still assigned.`,
//       });
//     }

//     await prisma.user.delete({
//       where: {
//         id: employeeId,
//       },
//     });

//     return res.status(200).json({
//       success: true,
//       message: "Employee deleted successfully",
//     });
//   } catch (error) {
//     console.error(error);

//     return res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//     });
//   }
// };

// module.exports = {
//   createEmployee,
//   getEmployees,
//   getEmployeeById,
//   updateEmployee,
//   deleteEmployee,
// };

const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");
const generatePassword = require("../utils/generatePassword");
const sendEmployeeCredentials = require("../services/emailService");
const { recordAuditLog } = require("../services/auditLogService");

// CREATE EMPLOYEE
const createEmployee = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      phone, 
      department, 
      designation, 
      address,
      role,
      status,
     } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Employee already exists",
      });
    }

    const tempPassword = generatePassword();

    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const employee = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "USER",
        status: status || "ACTIVE",
        phone,
        department,
        designation,
        address
      },
    });

    await sendEmployeeCredentials(name, email, tempPassword);

    await recordAuditLog({
      action: "EMPLOYEE_CREATED",
      entityType: "Employee",
      entityId: employee.id,
      details: `${employee.name} (${employee.email}), role: ${employee.role}`,
      actorId: req.user?.userId,
    });

    res.status(201).json({
      success: true,
      message: "Employee created successfully",
      employee,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// GET ALL EMPLOYEES
const getEmployees = async (req, res) => {
  try {
    const employees = await prisma.user.findMany({
      where: {
        role: "USER",
        status: "ACTIVE",
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        department: true,
        designation: true,
        address: true,
        role: true,
        status: true,
      },
    });

    res.status(200).json({
      success: true,
      employees,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// GET EMPLOYEE BY ID
const getEmployeeById = async (req, res) => {
  try {
    const employee = await prisma.user.findUnique({
      where: {
        id: req.params.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        department: true,
        designation: true,
        address: true,
        role: true,
        status: true,
      },
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      employee,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// UPDATE EMPLOYEE
const VALID_ROLES = ["USER", "ADMIN"];
const VALID_STATUSES = ["ACTIVE", "INACTIVE"];

const updateEmployee = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      phone, 
      department, 
      designation, 
      address, 
      role, 
      status,
    } = req.body;

    if (role !== undefined && !VALID_ROLES.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Invalid role. Must be one of: ${VALID_ROLES.join(", ")}`,
      });
    }

    if (status !== undefined && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`,
      });
    }

    const existingEmployee = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: { role: true, status: true, name: true },
    });

    const employee = await prisma.user.update({
      where: {
        id: req.params.id,
      },
      data: {
        name,
        email,
        phone,
        department,
        designation,
        address,
        role,
        status,
      },
    });

    // Role/status changes are the sensitive part of an employee
    // update — log them specifically (with the before/after values)
    // rather than just "employee updated", so an admin can actually
    // audit who escalated or deactivated whose account.
    if (existingEmployee) {
      const changes = [];
      if (role !== undefined && role !== existingEmployee.role) {
        changes.push(`role: ${existingEmployee.role} -> ${role}`);
      }
      if (status !== undefined && status !== existingEmployee.status) {
        changes.push(`status: ${existingEmployee.status} -> ${status}`);
      }

      if (changes.length > 0) {
        await recordAuditLog({
          action: "EMPLOYEE_UPDATED",
          entityType: "Employee",
          entityId: employee.id,
          details: `${existingEmployee.name}: ${changes.join(", ")}`,
          actorId: req.user?.userId,
        });
      }
    }

    res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      employee,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// DELETE EMPLOYEE
const deleteEmployee = async (req, res) => {
  try {
    const employeeId = req.params.id;

    // Check assigned tasks
    const taskCount = await prisma.task.count({
      where: {
        assignedToId: employeeId,
      },
    });

    if (taskCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete employee. ${taskCount} task(s) are still assigned.`,
      });
    }

    // Check assigned deals
    const dealCount = await prisma.deal.count({
      where: {
        assignedToId: employeeId,
      },
    });

    if (dealCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete employee. ${dealCount} deal(s) are still assigned.`,
      });
    }

    const employeeToDelete = await prisma.user.findUnique({
      where: { id: employeeId },
      select: { name: true, email: true },
    });

    await prisma.user.delete({
      where: {
        id: employeeId,
      },
    });

    await recordAuditLog({
      action: "EMPLOYEE_DELETED",
      entityType: "Employee",
      entityId: employeeId,
      details: employeeToDelete
        ? `${employeeToDelete.name} (${employeeToDelete.email})`
        : null,
      actorId: req.user?.userId,
    });

    return res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};