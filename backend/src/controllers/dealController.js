const prisma = require("../config/prisma");

// ======================================================
// COMMON INCLUDES
// ======================================================

const dealInclude = {
  customer: {
    select: {
      id: true,
      name: true,
      phone: true,
      email: true,
    },
  },
  createdBy: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
  assignedTo: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
};

const dealDetailsInclude = {
  ...dealInclude,
  activities: {
    orderBy: {
      createdAt: "desc",
    },
  },
};

// ======================================================
// CREATE DEAL
// ======================================================

const createDeal = async (req, res) => {
  try {
    // Only Admin can create deals
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Only admin can create deals",
      });
    }

    const {
      title,
      description,
      value,
      stage,
      customerId,
      assignedToId,
    } = req.body;

    // Required Fields
    if (!title || !customerId) {
      return res.status(400).json({
        success: false,
        message: "Title and customer are required",
      });
    }

    // Validate Customer
    const customer = await prisma.customer.findUnique({
      where: {
        id: customerId,
      },
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    // Validate Assigned Employee
    if (assignedToId) {
      const employee = await prisma.user.findUnique({
        where: {
          id: assignedToId,
        },
      });

      if (!employee || employee.role !== "USER") {
        return res.status(400).json({
          success: false,
          message: "Invalid employee selected",
        });
      }
    }

    const deal = await prisma.deal.create({
      data: {
        title,
        description,
        value: value ? Number(value) : 0,
        stage,
        customerId,
        createdById: req.user.userId,
        assignedToId: assignedToId || null,
      },
      include: dealInclude,
    });

    return res.status(201).json({
      success: true,
      message: "Deal created successfully",
      data: deal,
    });

  } catch (error) {
    console.error("Create Deal Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create deal",
      error: error.message,
    });
  }
};

// ======================================================
// GET ALL DEALS
// ======================================================

const getDeals = async (req, res) => {
  try {
    let deals;

    if (req.user.role === "ADMIN") {
      // Admin can view all deals
      deals = await prisma.deal.findMany({
        include: dealInclude,
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      // Employees can only view assigned deals
      deals = await prisma.deal.findMany({
        where: {
          assignedToId: req.user.userId,
        },
        include: dealInclude,
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    return res.status(200).json({
      success: true,
      count: deals.length,
      data: deals,
    });

  } catch (error) {
    console.error("Get Deals Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch deals",
      error: error.message,
    });
  }
};

// ======================================================
// GET SINGLE DEAL
// ======================================================

const getDealById = async (req, res) => {
  try {
    const { id } = req.params;

    const deal = await prisma.deal.findUnique({
      where: {
        id,
      },
      include: dealDetailsInclude,
    });

    if (!deal) {
      return res.status(404).json({
        success: false,
        message: "Deal not found",
      });
    }

    // Employee can only view assigned deals
    if (
      req.user.role !== "ADMIN" &&
      deal.assignedToId !== req.user.userId
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    return res.status(200).json({
      success: true,
      data: deal,
    });

  } catch (error) {
    console.error("Get Deal Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch deal",
      error: error.message,
    });
  }
};

// ======================================================
// UPDATE DEAL
// ======================================================

const updateDeal = async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Only admin can update deals",
      });
    }

    const { id } = req.params;

    const {
      title,
      description,
      value,
      stage,
      customerId,
      assignedToId,
    } = req.body;

    // Check Deal Exists
    const existingDeal = await prisma.deal.findUnique({
      where: {
        id,
      },
    });

    if (!existingDeal) {
      return res.status(404).json({
        success: false,
        message: "Deal not found",
      });
    }

    // Validate Customer
    if (customerId) {
      const customer = await prisma.customer.findUnique({
        where: {
          id: customerId,
        },
      });

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: "Customer not found",
        });
      }
    }

    // Validate Assigned Employee
    if (assignedToId) {
      const employee = await prisma.user.findUnique({
        where: {
          id: assignedToId,
        },
      });

      if (!employee || employee.role !== "USER") {
        return res.status(400).json({
          success: false,
          message: "Invalid employee selected",
        });
      }
    }

    const updatedDeal = await prisma.deal.update({
      where: {
        id,
      },
      data: {
        title,
        description,
        value: value !== undefined ? Number(value) : undefined,
        stage,
        customerId,
        assignedToId: assignedToId || null,
      },
      include: dealInclude,
    });

    return res.status(200).json({
      success: true,
      message: "Deal updated successfully",
      data: updatedDeal,
    });

  } catch (error) {
    console.error("Update Deal Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update deal",
      error: error.message,
    });
  }
};

// ======================================================
// DELETE DEAL
// ======================================================

const deleteDeal = async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Only admin can delete deals",
      });
    }

    const { id } = req.params;

    const deal = await prisma.deal.findUnique({
      where: {
        id,
      },
    });

    if (!deal) {
      return res.status(404).json({
        success: false,
        message: "Deal not found",
      });
    }

    await prisma.deal.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Deal deleted successfully",
    });

  } catch (error) {
    console.error("Delete Deal Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete deal",
      error: error.message,
    });
  }
};

// ======================================================
// UPDATE DEAL STAGE
// ======================================================

const updateDealStage = async (req, res) => {
  try {
    const { id } = req.params;
    const { stage } = req.body;

    const deal = await prisma.deal.findUnique({
      where: {
        id,
      },
    });

    if (!deal) {
      return res.status(404).json({
        success: false,
        message: "Deal not found",
      });
    }

    // Admin can update any deal
    // Employee can update only assigned deals
    if (
      req.user.role !== "ADMIN" &&
      deal.assignedToId !== req.user.userId
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not assigned to this deal",
      });
    }

    const updatedDeal = await prisma.deal.update({
      where: {
        id,
      },
      data: {
        stage,
      },
      include: dealInclude,
    });

    return res.status(200).json({
      success: true,
      message: "Deal stage updated successfully",
      data: updatedDeal,
    });

  } catch (error) {
    console.error("Update Deal Stage Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update deal stage",
      error: error.message,
    });
  }
};

// ======================================================
// EXPORTS
// ======================================================

module.exports = {
  createDeal,
  getDeals,
  getDealById,
  updateDeal,
  deleteDeal,
  updateDealStage,
};