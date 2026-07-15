const prisma = require("../config/prisma");

// ======================================================
// COMMON INCLUDES
// ======================================================

const activityInclude = {
  createdBy: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
};

// ======================================================
// GET DEAL ACTIVITIES
// ======================================================

const getDealActivities = async (req, res) => {
  try {
    const { dealId } = req.params;
    console.log("GET DEAL ACTIVITIES HIT");

    // Check Deal Exists
    const deal = await prisma.deal.findUnique({
      where: {
        id: dealId,
      },
    });

    if (!deal) {
      return res.status(404).json({
        success: false,
        message: "Deal not found",
      });
    }

    // Authorization
    if (
      req.user.role !== "ADMIN" &&
      deal.assignedToId !== req.user.userId
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // Fetch Activities
    const activities = await prisma.dealActivity.findMany({
      where: {
        dealId,
      },
      include: activityInclude,
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      count: activities.length,
      data: activities,
    });

  } catch (error) {
    console.error("Get Deal Activities Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch deal activities",
      error: error.message,
    });
  }
};

// ======================================================
// CREATE DEAL ACTIVITY
// ======================================================

const createDealActivity = async (req, res) => {
  try {
    const { dealId } = req.params;
    const { type, note } = req.body;

    // Required Fields
    if (!type || !note) {
      return res.status(400).json({
        success: false,
        message: "Type and note are required",
      });
    }

    // Check Deal Exists
    const deal = await prisma.deal.findUnique({
      where: {
        id: dealId,
      },
    });

    if (!deal) {
      return res.status(404).json({
        success: false,
        message: "Deal not found",
      });
    }

    // Authorization
    // Admin -> Can add activity to any deal
    // Employee -> Only assigned deal
    if (
      req.user.role !== "ADMIN" &&
      deal.assignedToId !== req.user.userId
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not assigned to this deal",
      });
    }

    // Create Activity
    const activity = await prisma.dealActivity.create({
      data: {
        dealId,
        type,
        note,
        createdById: req.user.userId,
      },
      include: activityInclude,
    });

    return res.status(201).json({
      success: true,
      message: "Activity added successfully",
      data: activity,
    });

  } catch (error) {
    console.error("Create Deal Activity Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create deal activity",
      error: error.message,
    });
  }
};

// ======================================================
// EXPORTS
// ======================================================

module.exports = {
  getDealActivities,
  createDealActivity,
};