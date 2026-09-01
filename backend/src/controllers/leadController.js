const prisma = require("../config/prisma");

const {
  notifyUser,
  NotificationType,
} = require("../services/notificationService");
const { recordAuditLog } = require("../services/auditLogService");
const { sendLeadToErpCrm } = require("../services/erpCrmService");

// ======================================================
// COMMON INCLUDE
// ======================================================

const leadInclude = {
  assignedTo: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
};

// ================= CREATE LEAD =================
const createLead = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      company,
      source,
      requirements,
      status,
      assignedToId,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    const validStatuses = [
      "NEW",
      "CONTACTED",
      "QUALIFIED",
      "WON",
    ];

    const leadStatus = validStatuses.includes(
      status?.toUpperCase()
    )
      ? status.toUpperCase()
      : "NEW";

    // Validate assigned employee (optional)
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

    const lead = await prisma.lead.create({
      data: {
        name: name.trim(),
        phone: phone?.trim() || null,
        email: email?.trim() || null,
        company: company?.trim() || null,
        source: source?.trim() || null,
        requirements: requirements?.trim() || null,
        status: leadStatus,
        assignedToId: assignedToId || null,
      },
      include: leadInclude,
    });

    // ================= AUDIT LOG =================
    await recordAuditLog({
      action: "LEAD_CREATED",
      entityType: "Lead",
      entityId: lead.id,
      details: `${lead.name}${lead.source ? ` (source: ${lead.source})` : ""}`,
      actorId: req.user?.userId,
    });

    // ================= CREATE NOTIFICATION =================
    if (assignedToId) {
      try {
        await notifyUser({
          userId: assignedToId,
          title: "New Lead Assigned",
          message: `You have been assigned a new lead: "${lead.name}".`,
          type: NotificationType.LEAD,
        });
      } catch (notificationError) {
        console.error(
          "Lead notification failed:",
          notificationError
        );
      }
    }

    return res.status(201).json({
      success: true,
      message: "Lead created successfully",
      data: lead,
    });
  } catch (error) {
    console.error("Create Lead Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create lead",
      error: error.message,
    });
  }
};

// ================= GET ALL LEADS =================
const getLeads = async (req, res) => {
  try {
    const { page, limit, includeLost } = req.query;

    const roleWhere =
      req.user.role === "ADMIN"
        ? {}
        : { assignedToId: req.user.userId };

    // By default, soft-deleted (LOST) leads are hidden from the list.
    // Pass ?includeLost=true (e.g. a "Show Lost" toggle in the UI) to see them.
    const baseWhere =
      includeLost === "true"
        ? roleWhere
        : { ...roleWhere, status: { not: "LOST" } };

    // Backward compatible: no `page` param → full list, like before.
    if (!page) {
      const leads = await prisma.lead.findMany({
        where: baseWhere,
        include: leadInclude,
        orderBy: {
          createdAt: "desc",
        },
      });

      return res.status(200).json({
        success: true,
        count: leads.length,
        data: leads,
      });
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where: baseWhere,
        include: leadInclude,
        orderBy: {
          createdAt: "desc",
        },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
      }),
      prisma.lead.count({ where: baseWhere }),
    ]);

    return res.status(200).json({
      success: true,
      count: leads.length,
      data: leads,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.max(1, Math.ceil(total / limitNum)),
      },
    });
  } catch (error) {
    console.error("Get Leads Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch leads",
      error: error.message,
    });
  }
};

// ================= UPDATE LEAD =================
const updateLead = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      phone,
      email,
      company,
      source,
      requirements,
      status,
      assignedToId,
    } = req.body;

    const existingLead = await prisma.lead.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!existingLead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    if (
      req.user.role !== "ADMIN" &&
      existingLead.assignedToId !== req.user.userId
    ) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to update this lead",
      });
    }

    // Validate assigned employee (optional)
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

    const updatedLead = await prisma.lead.update({
      where: {
        id: Number(id),
      },
      data: {
        name,
        phone,
        email,
        company,
        source,
        requirements,
        status: existingLead.isConverted
          ? existingLead.status
          : status,
        assignedToId:
          assignedToId === undefined
            ? existingLead.assignedToId
            : assignedToId || null,
      },
      include: leadInclude,
    });

    // ================= AUDIT LOG =================
    const leadChanges = [];

    if (name !== undefined && name !== existingLead.name) {
      leadChanges.push(`name: ${existingLead.name} -> ${name}`);
    }
    if (phone !== undefined && phone !== existingLead.phone) {
      leadChanges.push(`phone: ${existingLead.phone} -> ${phone}`);
    }
    if (email !== undefined && email !== existingLead.email) {
      leadChanges.push(`email: ${existingLead.email} -> ${email}`);
    }
    if (company !== undefined && company !== existingLead.company) {
      leadChanges.push(`company: ${existingLead.company} -> ${company}`);
    }
    if (
      !existingLead.isConverted &&
      status !== undefined &&
      status !== existingLead.status
    ) {
      leadChanges.push(`status: ${existingLead.status} -> ${status}`);
    }
    if (
      assignedToId !== undefined &&
      assignedToId !== existingLead.assignedToId
    ) {
      leadChanges.push(
        `assignedTo: ${existingLead.assignedToId || "unassigned"} -> ${
          assignedToId || "unassigned"
        }`
      );
    }

    if (leadChanges.length > 0) {
      await recordAuditLog({
        action: "LEAD_UPDATED",
        entityType: "Lead",
        entityId: updatedLead.id,
        details: `${existingLead.name}: ${leadChanges.join(", ")}`,
        actorId: req.user?.userId,
      });
    }

    // ================= REASSIGNMENT NOTIFICATION =================
    if (
      assignedToId &&
      assignedToId !== existingLead.assignedToId
    ) {
      try {
        await notifyUser({
          userId: assignedToId,
          title: "Lead Assigned",
          message: `A lead has been assigned to you: "${updatedLead.name}".`,
          type: NotificationType.LEAD,
        });
      } catch (notificationError) {
        console.error(
          "Lead reassignment notification failed:",
          notificationError
        );
      }
    }

    return res.status(200).json({
      success: true,
      message: "Lead updated successfully",
      data: updatedLead,
    });
  } catch (error) {
    console.error("Update Lead Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update lead",
      error: error.message,
    });
  }
};



// ================= UPDATE LEAD STATUS =================
const updateLeadStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "NEW",
      "CONTACTED",
      "QUALIFIED",
      "WON",
    ];

    const normalizedStatus = status?.trim().toUpperCase();

    if (!validStatuses.includes(normalizedStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const existingLead = await prisma.lead.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!existingLead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    if (
      req.user.role !== "ADMIN" &&
      existingLead.assignedToId !== req.user.userId
    ) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to update this lead",
      });
    }

    // Prevent status changes after conversion
    if (existingLead.isConverted) {
      return res.status(400).json({
        success: false,
        message:
          "Converted leads cannot change status.",
      });
    }

    const lead = await prisma.lead.update({
      where: {
        id: Number(id),
      },
      data: {
        status: normalizedStatus,
      },
      include: leadInclude,
    });

    // ================= AUDIT LOG =================
    await recordAuditLog({
      action: "LEAD_STATUS_CHANGED",
      entityType: "Lead",
      entityId: lead.id,
      details: `${lead.name}: ${existingLead.status} -> ${normalizedStatus}`,
      actorId: req.user?.userId,
    });

    return res.status(200).json({
      success: true,
      message: "Lead status updated successfully",
      data: lead,
    });
  } catch (error) {
    console.error("Update Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update status",
      error: error.message,
    });
  }
};

// ================= CONVERT LEAD TO CUSTOMER =================
const convertLeadToCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const lead = await prisma.lead.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    if (
      req.user.role !== "ADMIN" &&
      lead.assignedToId !== req.user.userId
    ) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to convert this lead",
      });
    }

    if (lead.status !== "WON") {
      return res.status(400).json({
        success: false,
        message: "Only WON leads can be converted",
      });
    }

    if (lead.isConverted) {
      return res.status(400).json({
        success: false,
        message: "Lead already converted",
      });
    }

    console.log("Lead to convert:", lead);

const conditions = [];

if (lead.email) {
  conditions.push({ email: lead.email });
}

if (lead.phone) {
  conditions.push({ phone: lead.phone });
}

console.log("Search Conditions:", conditions);

const existingCustomer =
  conditions.length > 0
    ? await prisma.customer.findFirst({
        where: {
          OR: conditions,
        },
      })
    : null;

console.log("Matched Customer:", existingCustomer);

    if (existingCustomer) {
      return res.status(400).json({
        success: false,
        message: "Customer already exists",
      });
    }

    console.log("req.user:", req.user);

    const customer = await prisma.customer.create({
      data: {
        name: lead.name,
        phone: lead.phone,
        email: lead.email,
        company: lead.company,
        source: lead.source,
        requirements: lead.requirements,
        userId: req.user.userId,
      },
    });

    await prisma.lead.update({
      where: {
        id: Number(id),
      },
      data: {
        isConverted: true,
      },
    });

    // ================= AUDIT LOG =================
    await recordAuditLog({
      action: "LEAD_CONVERTED",
      entityType: "Lead",
      entityId: lead.id,
      details: `${lead.name} converted to customer (customer #${customer.id})`,
      actorId: req.user?.userId,
    });

    return res.status(201).json({
      success: true,
      message: "Lead converted successfully",
      data: customer,
    });
  } catch (error) {
    console.error("Convert Lead Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to convert lead",
      error: error.message,
    });
  }
};

// ================= DELETE LEAD (SOFT DELETE) =================
// We never hard-delete a Lead. Marking it LOST instead:
// - preserves history (work notes, requirements, past conversations context)
// - lets the WhatsApp AI-classification dedup logic (leadHelper.js) correctly
//   ignore LOST leads and create a fresh lead if the same number messages
//   in again, instead of silently reviving/updating an "archived" record.
const deleteLead = async (req, res) => {
  try {
    const { id } = req.params;

    const existingLead = await prisma.lead.findUnique({
      where: { id: Number(id) },
    });

    if (!existingLead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    if (
      req.user.role !== "ADMIN" &&
      existingLead.assignedToId !== req.user.userId
    ) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to delete this lead",
      });
    }

    const deletedLead = await prisma.lead.update({
      where: {
        id: Number(id),
      },
      data: {
        status: "LOST",
      },
    });

    // ================= AUDIT LOG =================
    await recordAuditLog({
      action: "LEAD_MARKED_LOST",
      entityType: "Lead",
      entityId: deletedLead.id,
      details: `${deletedLead.name}${deletedLead.phone ? ` (${deletedLead.phone})` : ""}`,
      actorId: req.user?.userId,
    });

    return res.status(200).json({
      success: true,
      message: "Lead deleted successfully",
    });
  } catch (error) {
    console.error("Delete Lead Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete lead",
      error: error.message,
    });
  }
};

// ================= MANUAL SEND TO ERP-CRM =================
// Exposes the same sendLeadToErpCrm() the automated AI pipeline uses
// after enrichment (see erpCrmService.js), as a manual action for
// when AI classification failed and an employee reviews the
// conversation themselves — reuses the exact same logic/payload
// shape, no duplicated business rules.
const sendLeadToErp = async (req, res) => {
  try {
    const { id } = req.params;

    const lead = await prisma.lead.findUnique({
      where: { id: Number(id) },
    });

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    const result = await sendLeadToErpCrm(lead);

    if (!result.success) {
      return res.status(502).json({
        success: false,
        message: "Failed to reach the ERP-CRM system. Please try again shortly.",
        error: result.error,
      });
    }

    // ================= AUDIT LOG =================
    await recordAuditLog({
      action: "LEAD_MANUALLY_SENT_TO_ERP",
      entityType: "Lead",
      entityId: lead.id,
      details: `${lead.name} manually forwarded to ERP-CRM by an employee`,
      actorId: req.user?.userId,
    });

    return res.status(200).json({
      success: true,
      message: "Lead sent to ERP-CRM successfully",
    });
  } catch (error) {
    console.error("Manual Send To ERP Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while sending this lead to ERP-CRM",
    });
  }
};

module.exports = {
  createLead,
  getLeads,
  updateLead,
  updateLeadStatus,
  convertLeadToCustomer,
  deleteLead,
  sendLeadToErp,
};