const prisma = require("../config/prisma");

// ================= CREATE TEMPLATE =================
const createTemplate = async (req, res) => {
  try {
    const {
      name,
      category,
      messageType,
      content,
    } = req.body;

    if (!name || !content) {
      return res.status(400).json({
        success: false,
        message: "Name and content are required",
      });
    }

    const template = await prisma.template.create({
      data: {
        name,
        category,
        messageType,
        content,
        createdById: req.user.userId,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Template created successfully",
      data: template,
    });
  } catch (error) {
    console.error("Create Template Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create template",
      error: error.message,
    });
  }
};

// ================= GET ALL TEMPLATES =================
const getTemplates = async (req, res) => {
  try {
    const { search, category, status } = req.query;

    const where = {};

    if (search) {
      where.name = {
        contains: search,
        mode: "insensitive",
      };
    }

    if (category) {
      where.category = category;
    }

    if (status) {
      where.status = status;
    }

    const templates = await prisma.template.findMany({
      where,
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      count: templates.length,
      data: templates,
    });
  } catch (error) {
    console.error("Get Templates Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch templates",
      error: error.message,
    });
  }
};

// ================= GET SINGLE TEMPLATE =================
const getTemplateById = async (req, res) => {
  try {
    const { id } = req.params;

    const template = await prisma.template.findUnique({
      where: {
        id,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!template) {
      return res.status(404).json({
        success: false,
        message: "Template not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: template,
    });
  } catch (error) {
    console.error("Get Template Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch template",
      error: error.message,
    });
  }
};

// ================= UPDATE TEMPLATE =================
const updateTemplate = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      category,
      messageType,
      content,
      status,
    } = req.body;

    const existingTemplate = await prisma.template.findUnique({
      where: { id },
    });

    if (!existingTemplate) {
      return res.status(404).json({
        success: false,
        message: "Template not found",
      });
    }

    const template = await prisma.template.update({
      where: {
        id,
      },
      data: {
        name,
        category,
        messageType,
        content,
        status,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Template updated successfully",
      data: template,
    });
  } catch (error) {
    console.error("Update Template Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update template",
      error: error.message,
    });
  }
};

// ================= DELETE TEMPLATE =================
const deleteTemplate = async (req, res) => {
  try {
    const { id } = req.params;

    const existingTemplate = await prisma.template.findUnique({
      where: { id },
    });

    if (!existingTemplate) {
      return res.status(404).json({
        success: false,
        message: "Template not found",
      });
    }

    await prisma.template.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Template deleted successfully",
    });
  } catch (error) {
    console.error("Delete Template Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete template",
      error: error.message,
    });
  }
};

// ================= SEND TEMPLATE =================
const sendTemplate = async (req, res) => {
  try {
    const { templateId, customerId } = req.body;

    if (!templateId || !customerId) {
      return res.status(400).json({
        success: false,
        message: "Template ID and Customer ID are required.",
      });
    }

    // Find Template
    const template = await prisma.template.findUnique({
      where: {
        id: templateId,
      },
    });

    if (!template) {
      return res.status(404).json({
        success: false,
        message: "Template not found.",
      });
    }

    // Find Customer
    const customer = await prisma.customer.findUnique({
      where: {
        id: customerId,
      },
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }

    // Find Conversation
    let conversation =
      await prisma.conversation.findFirst({
        where: {
          customerId,
        },
      });

    // Create Conversation if not exists
    if (!conversation) {
      conversation =
        await prisma.conversation.create({
          data: {
            customerId,
            status: "OPEN",
            lastMessage: "",
            unreadCount: 0,
          },
        });
    }

    // Create Message
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        sender: "ADMIN",
        content: template.content,
      },
    });

    // Update Conversation
    await prisma.conversation.update({
      where: {
        id: conversation.id,
      },
      data: {
        lastMessage: template.content,
        updatedAt: new Date(),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Template sent successfully.",
    });

  } catch (error) {
    console.error("Send Template Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send template.",
      error: error.message,
    });
  }
};

module.exports = {
  createTemplate,
  getTemplates,
  getTemplateById,
  updateTemplate,
  deleteTemplate,
  sendTemplate,
};