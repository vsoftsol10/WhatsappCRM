// const prisma = require("../config/prisma");
// const { validateCustomer } = require("../validations/customerValidation");
// const { normalizeIndianPhone } = require("../utils/phoneUtils");

// const createCustomer = async (req, res) => {
//   try {
//     const validation = validateCustomer(req.body);

//     if (!validation.isValid) {
//       return res.status(400).json({
//         success: false,
//         message: validation.message,
//       });
//     }

//     const { name, phone, email, company, source, requirements, status } = req.body;

//     //console.log("req.user:", req.user);

//     const normalizedPhone = normalizeIndianPhone(phone);

//     if (!normalizedPhone) {
//       return res.status(400).json({
//         success: false,
//         message: "Please enter a valid Indian mobile number.",
//       });
//     }

//     const { userId } = req.user;

//     const customer = await prisma.customer.create({
//       data: {
//         name,
//         phone: normalizedPhone,
//         email,
//         company,
//         source,
//         requirements,
//         status,
//         userId,
//       },
//     });
 
//     res.status(201).json({
//       success: true,
//       message: "Customer created successfully",
//       customer,
//     });
//   } catch (error) {
//     console.error(error);

//     return res.status(500).json({
//       success: false,
//       message: error.message,
//       error,
//     });
//   }
// };

// const getCustomers = async (req, res) => {
//   try {
//     const { status, search } = req.query;

//     const where = {}

//     // Filter by status
//     if (status) {
//       where.status = status;
//     }

//     // Search by name, phone, or email
//     if (search) {
//       where.OR = [
//         {
//           name: {
//             contains: search,
//             mode: "insensitive",
//           },
//         },
//         {
//           phone: {
//             contains: search,
//           },
//         },
//         {
//           email: {
//             contains: search,
//             mode: "insensitive",
//           },
//         },
//       ];
//     }

//     const customers = await prisma.customer.findMany({
//       where,
//       orderBy: {
//         createdAt: "desc",
//       },
//     });

//     return res.status(200).json({
//       success: true,
//       customers,
//     });
//   } catch (error) {
//     console.error(error);

//     return res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//     });
//   }
// };

// const getCustomerById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const customer = await prisma.customer.findFirst({
//       where: {
//         id,
//       },
//     });

//     if (!customer) {
//       return res.status(404).json({
//         success: false,
//         message: "Customer not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       customer,
//     });
//   } catch (error) {
//     console.error(error);

//     return res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//     });
//   }
// };

// const updateCustomer = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const validation = validateCustomer(req.body);

//     if (!validation.isValid) {
//       return res.status(400).json({
//         success: false,
//         message: validation.message,
//       });
//     }

//     const existingCustomer = await prisma.customer.findFirst({
//       where: {
//         id,
//       },
//     });

//     if (!existingCustomer) {
//       return res.status(404).json({
//         success: false,
//         message: "Customer not found",
//       });
//     }

//     const { name, phone, email, company, source, requirements, status } = req.body;

//     const updatedCustomer = await prisma.customer.update({
//       where: {
//         id,
//       },
//       data: {
//         name,
//         phone,
//         email,
//         company,
//         source,
//         requirements,
//         status,
//       },
//     });

//     return res.status(200).json({
//       success: true,
//       message: "Customer updated successfully",
//       customer: updatedCustomer,
//     });
//   } catch (error) {
//     console.error(error);

//     return res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//     });
//   }
// };

// const deleteCustomer = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Check customer exists
//     const existingCustomer = await prisma.customer.findUnique({
//       where: {
//         id,
//       },
//     });

//     if (!existingCustomer) {
//       return res.status(404).json({
//         success: false,
//         message: "Customer not found",
//       });
//     }

//     // Check if customer has any tickets
//     const ticket = await prisma.ticket.findFirst({
//       where: {
//         customerId: id,
//       },
//     });

//     if (ticket) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "Cannot delete customer. Delete associated tickets first.",
//       });
//     }

//     // Find customer's conversation
//     const conversation = await prisma.conversation.findUnique({
//       where: {
//         customerId: id,
//       },
//     });

//     // Delete messages first, then conversation
//     if (conversation) {
//       await prisma.message.deleteMany({
//         where: {
//           conversationId: conversation.id,
//         },
//       });

//       await prisma.conversation.delete({
//         where: {
//           id: conversation.id,
//         },
//       });
//     }

//     // Delete customer
//     await prisma.customer.delete({
//       where: {
//         id,
//       },
//     });

//     return res.status(200).json({
//       success: true,
//       message: "Customer deleted successfully",
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
//   createCustomer,
//   getCustomers,
//   getCustomerById,
//   updateCustomer,
//   deleteCustomer,
// };

const prisma = require("../config/prisma");
const { validateCustomer } = require("../validations/customerValidation");
const { normalizeIndianPhone } = require("../utils/phoneUtils");
const { recordAuditLog } = require("../services/auditLogService");

const createCustomer = async (req, res) => {
  try {
    const validation = validateCustomer(req.body);

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const { name, phone, email, company, source, requirements, status } = req.body;

    //console.log("req.user:", req.user);

    const normalizedPhone = normalizeIndianPhone(phone);

    if (!normalizedPhone) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid Indian mobile number.",
      });
    }

    const { userId } = req.user;

    const customer = await prisma.customer.create({
      data: {
        name,
        phone: normalizedPhone,
        email,
        company,
        source,
        requirements,
        status,
        userId,
      },
    });

    await recordAuditLog({
      action: "CUSTOMER_CREATED",
      entityType: "Customer",
      entityId: customer.id,
      details: `${customer.name} (${customer.phone})`,
      actorId: req.user?.userId,
    });

    res.status(201).json({
      success: true,
      message: "Customer created successfully",
      customer,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
      error,
    });
  }
};

const getCustomers = async (req, res) => {
  try {
    const { status, search, page, limit } = req.query;

    const where = {}

    // Filter by status
    if (status) {
      where.status = status;
    }

    // Search by name, phone, or email
    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          phone: {
            contains: search,
          },
        },
        {
          email: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    // Backward compatible: no `page` param → return every matching
    // row like before (used by the dashboard KPI cards, which need
    // the full set to compute counts). Passing `page` switches to
    // real server-side pagination instead of fetching everything and
    // slicing it client-side.
    if (!page) {
      const customers = await prisma.customer.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
      });

      return res.status(200).json({
        success: true,
        customers,
      });
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
      }),
      prisma.customer.count({ where }),
    ]);

    return res.status(200).json({
      success: true,
      customers,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.max(1, Math.ceil(total / limitNum)),
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await prisma.customer.findFirst({
      where: {
        id,
      },
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    return res.status(200).json({
      success: true,
      customer,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const validation = validateCustomer(req.body);

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const existingCustomer = await prisma.customer.findFirst({
      where: {
        id,
      },
    });

    if (!existingCustomer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const { name, phone, email, company, source, requirements, status } = req.body;

    // Track what actually changed for a readable audit entry (same
    // pattern as EMPLOYEE_UPDATED in employeeController.js).
    const changes = [];
    if (name !== undefined && name !== existingCustomer.name) {
      changes.push(`name: ${existingCustomer.name} -> ${name}`);
    }
    if (phone !== undefined && phone !== existingCustomer.phone) {
      changes.push(`phone: ${existingCustomer.phone} -> ${phone}`);
    }
    if (email !== undefined && email !== existingCustomer.email) {
      changes.push(`email: ${existingCustomer.email} -> ${email}`);
    }
    if (company !== undefined && company !== existingCustomer.company) {
      changes.push(`company: ${existingCustomer.company} -> ${company}`);
    }
    if (status !== undefined && status !== existingCustomer.status) {
      changes.push(`status: ${existingCustomer.status} -> ${status}`);
    }

    const updatedCustomer = await prisma.customer.update({
      where: {
        id,
      },
      data: {
        name,
        phone,
        email,
        company,
        source,
        requirements,
        status,
      },
    });

    if (changes.length > 0) {
      await recordAuditLog({
        action: "CUSTOMER_UPDATED",
        entityType: "Customer",
        entityId: updatedCustomer.id,
        details: `${existingCustomer.name}: ${changes.join(", ")}`,
        actorId: req.user?.userId,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Customer updated successfully",
      customer: updatedCustomer,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    // Check customer exists
    const existingCustomer = await prisma.customer.findUnique({
      where: {
        id,
      },
    });

    if (!existingCustomer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    // Check if customer has any tickets
    const ticket = await prisma.ticket.findFirst({
      where: {
        customerId: id,
      },
    });

    if (ticket) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot delete customer. Delete associated tickets first.",
      });
    }

    // Check if customer has any deals (Deal.customer has no cascade
    // delete, so without this check the prisma.customer.delete below
    // would throw a raw foreign-key error instead of a clean message)
    const deal = await prisma.deal.findFirst({
      where: {
        customerId: id,
      },
    });

    if (deal) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot delete customer. Delete associated deals first.",
      });
    }

    // Find customer's conversation
    const conversation = await prisma.conversation.findUnique({
      where: {
        customerId: id,
      },
    });

    // Delete messages first, then conversation
    if (conversation) {
      await prisma.message.deleteMany({
        where: {
          conversationId: conversation.id,
        },
      });

      await prisma.conversation.delete({
        where: {
          id: conversation.id,
        },
      });
    }

    // Delete customer
    await prisma.customer.delete({
      where: {
        id,
      },
    });

    await recordAuditLog({
      action: "CUSTOMER_DELETED",
      entityType: "Customer",
      entityId: id,
      details: `${existingCustomer.name} (${existingCustomer.phone})`,
      actorId: req.user?.userId,
    });

    return res.status(200).json({
      success: true,
      message: "Customer deleted successfully",
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
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};