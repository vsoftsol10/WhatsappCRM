const prisma = require("../config/prisma");

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

    const lead = await prisma.lead.create({
      data: {
        name: name.trim(),
        phone: phone?.trim() || null,
        email: email?.trim() || null,
        company: company?.trim() || null,
        source: source?.trim() || null,
        requirements: requirements?.trim() || null,
        status: leadStatus,
      },
    });

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
    const leads = await prisma.lead.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      count: leads.length,
      data: leads,
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
    } = req.body;

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
        status,
      },
    });

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

    const lead = await prisma.lead.update({
      where: {
        id: Number(id),
      },
      data: {
        status: normalizedStatus,
      },
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

// ================= DELETE LEAD =================
const deleteLead = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.lead.delete({
      where: {
        id: Number(id),
      },
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

module.exports = {
  createLead,
  getLeads,
  updateLead,
  updateLeadStatus,
  convertLeadToCustomer,
  deleteLead,
};