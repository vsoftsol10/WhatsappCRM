// const prisma = require("../config/prisma");

// // ================= CREATE CAMPAIGN =================
// const createCampaign = async (req, res) => {
//   try {
//     const {
//       name,
//       type,
//       messageContent,
//       scheduledAt,
//       customerIds = [],
//     } = req.body;

//     if (!name || !messageContent) {
//       return res.status(400).json({
//         success: false,
//         message: "Name and message content are required",
//       });
//     }

//     // const campaign = await prisma.campaign.create({
//     //   data: {
//     //     name,
//     //     type,
//     //     messageContent,
//     //     scheduledAt: scheduledAt
//     //       ? new Date(scheduledAt)
//     //       : null,
//     //     audienceCount: customerIds.length,

//     //     createdById: req.user.userId,

//     //     recipients: {
//     //       create: customerIds.map((customerId) => ({
//     //         customerId,
//     //       })),
//     //     },
//     //   },
//     //   include: {
//     //     recipients: true,
//     //   },
//     // });


// // const campaign = await prisma.campaign.update({
// //   where: {
// //     id,
// //   },
// //   data: {
// //     name,
// //     type,
// //     messageContent,
// //     status,
// //     scheduledAt: scheduledAt
// //       ? new Date(scheduledAt)
// //       : null,
// //   },
// // });

//   const campaign = await prisma.campaign.create({
//     data: {
//       name,
//       type,
//       messageContent,
//       scheduledAt: scheduledAt
//         ? new Date(scheduledAt)
//         : null,
//       audienceCount: customerIds.length,

//       createdById: req.user.userId,

//       recipients: {
//         create: customerIds.map((customerId) => ({
//           customerId,
//         })),
//       },
//     },
// });

//     return res.status(201).json({
//       success: true,
//       message: "Campaign created successfully",
//       data: campaign,
//     });
//   } catch (error) {
//     console.error("Create Campaign Error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to create campaign",
//       error: error.message,
//     });
//   }
// };

// // ================= GET ALL CAMPAIGNS =================
// const getCampaigns = async (req, res) => {
//   try {
//     const campaigns = await prisma.campaign.findMany({
//       include: {
//         recipients: true,
//         createdBy: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//           },
//         },
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//     });

//     return res.status(200).json({
//       success: true,
//       count: campaigns.length,
//       data: campaigns,
//     });
//   } catch (error) {
//     console.error("Get Campaigns Error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch campaigns",
//       error: error.message,
//     });
//   }
// };

// // ================= GET SINGLE CAMPAIGN =================
// const getCampaignById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const campaign = await prisma.campaign.findUnique({
//       where: {
//         id,
//       },
//       include: {
//         createdBy: true,
//         recipients: {
//           include: {
//             customer: true,
//           },
//         },
//       },
//     });

//     if (!campaign) {
//       return res.status(404).json({
//         success: false,
//         message: "Campaign not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       data: campaign,
//     });
//   } catch (error) {
//     console.error("Get Campaign Error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch campaign",
//       error: error.message,
//     });
//   }
// };

// // ================= UPDATE CAMPAIGN =================
// const updateCampaign = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const {
//       name,
//       type,
//       messageContent,
//       status,
//       scheduledAt,
//     } = req.body;

//     const campaign = await prisma.campaign.update({
//       where: {
//         id,
//       },
//       data: {
//         name,
//         type,
//         messageContent,
//         status,
//         scheduledAt: scheduledAt
//           ? new Date(scheduledAt)
//           : null,
//       },
//     });

//     return res.status(200).json({
//       success: true,
//       message: "Campaign updated successfully",
//       data: campaign,
//     });
//   } catch (error) {
//     console.error("Update Campaign Error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to update campaign",
//       error: error.message,
//     });
//   }
// };

// // ================= DELETE CAMPAIGN =================
// const deleteCampaign = async (req, res) => {
//   try {
//     const { id } = req.params;

//     await prisma.campaign.delete({
//       where: {
//         id,
//       },
//     });

//     return res.status(200).json({
//       success: true,
//       message: "Campaign deleted successfully",
//     });
//   } catch (error) {
//     console.error("Delete Campaign Error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to delete campaign",
//       error: error.message,
//     });
//   }
// };

// module.exports = {
//   createCampaign,
//   getCampaigns,
//   getCampaignById,
//   updateCampaign,
//   deleteCampaign,
// };

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const { generateCampaign } = require("../services/geminiService");

// =========================
// CREATE CAMPAIGN
// =========================
exports.createCampaign = async (req, res) => {
  try {
    const {
      name,
      type,
      messageContent,
      scheduledAt,
      customerIds = [],
    } = req.body;

    if (!name || !messageContent) {
      return res.status(400).json({
        success: false,
        message: "Campaign name and message are required.",
      });
    }

    console.log("req.user =", req.user);

    const campaign = await prisma.campaign.create({
      data: {
        name,
        type,
        messageContent,

        scheduledAt: scheduledAt
          ? new Date(scheduledAt)
          : null,

        audienceCount: customerIds.length,

        // Change this if your auth middleware uses req.user.id
        createdById: req.user.userId,

        recipients: {
          create: customerIds.map((customerId) => ({
            customerId,
          })),
        },
      },

      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },

        recipients: {
          include: {
            customer: true,
          },
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: "Campaign created successfully.",
      data: campaign,
    });
  } catch (error) {
    console.error("Create Campaign Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create campaign.",
      error: error.message,
    });
  }
};

// =========================
// GET ALL CAMPAIGNS
// =========================
exports.getCampaigns = async (req, res) => {
  try {
    const campaigns = await prisma.campaign.findMany({
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },

        recipients: {
          include: {
            customer: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      count: campaigns.length,
      data: campaigns,
    });
  } catch (error) {
    console.error("Get Campaigns Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch campaigns.",
      error: error.message,
    });
  }
};

// =========================
// GET CAMPAIGN BY ID
// =========================
exports.getCampaignById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const campaign = await prisma.campaign.findUnique({
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

        recipients: {
          include: {
            customer: true,
          },
        },
      },
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: campaign,
    });
  } catch (error) {
    console.error("Get Campaign Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch campaign.",
      error: error.message,
    });
  }
};

// =========================
// UPDATE CAMPAIGN
// =========================
exports.updateCampaign = async (req, res) => {
  try {
    const {id} = req.params;

    const {
      name,
      type,
      messageContent,
      status,
      scheduledAt,
    } = req.body;

    const campaign = await prisma.campaign.update({
      where: {
        id,
      },

      data: {
        ...(name && { name }),
        ...(type && { type }),
        ...(messageContent && { messageContent }),
        ...(status && { status }),

        scheduledAt:
          scheduledAt !== undefined
            ? scheduledAt
              ? new Date(scheduledAt)
              : null
            : undefined,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Campaign updated successfully.",
      data: campaign,
    });
  } catch (error) {
    console.error("Update Campaign Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update campaign.",
      error: error.message,
    });
  }
};

// =========================
// DELETE CAMPAIGN
// =========================
exports.deleteCampaign = async (req, res) => {
  try {
    const {id} = req.params;

    await prisma.campaign.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Campaign deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Campaign Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete campaign.",
      error: error.message,
    });
  }
};

// =========================
// GENERATE AI CAMPAIGN
// =========================
exports.generateAICampaign = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || prompt.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Prompt is required.",
      });
    }

    const campaign = await generateCampaign(prompt);

    return res.status(200).json({
      success: true,
      message: "AI campaign generated successfully.",
      data: campaign,
    });

  } catch (error) {
    console.error("Generate AI Campaign Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate AI campaign.",
      error: error.message,
    });
  }
};

// =========================
// SEND CAMPAIGN TO CUSTOMERS
// =========================
exports.sendCampaign = async (req, res) => {
  try {
    const { campaignId, customerIds } = req.body;

    // =========================
    // Validation
    // =========================
    if (!campaignId) {
      return res.status(400).json({
        success: false,
        message: "Campaign ID is required.",
      });
    }

    if (!customerIds || customerIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please select at least one customer.",
      });
    }

    // =========================
    // Find Campaign
    // =========================
    const campaign = await prisma.campaign.findUnique({
      where: {
        id: campaignId,
      },
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found.",
      });
    }

    let successCount = 0;

    // =========================
    // Send to each customer
    // =========================
    for (const customerId of customerIds) {

      // Find customer
      const customer = await prisma.customer.findUnique({
        where: {
          id: customerId,
        },
      });

      if (!customer) {
        continue;
      }

      // =========================
      // Find Conversation
      // =========================
      let conversation =
        await prisma.conversation.findFirst({
          where: {
            customerId: customer.id,
          },
        });

      // =========================
      // Create Conversation
      // =========================
      if (!conversation) {

        conversation =
          await prisma.conversation.create({
            data: {
              customerId: customer.id,
              status: "OPEN",
              lastMessage: "",
              unreadCount: 0,
            },
          });

      }

      // =========================
      // Create Message
      // =========================
      await prisma.message.create({
        data: {
          conversationId: conversation.id,
          sender: "ADMIN",
          content: campaign.messageContent,
        },
      });

      // =========================
      // Update Conversation
      // =========================
      await prisma.conversation.update({
        where: {
          id: conversation.id,
        },
        data: {
          lastMessage: campaign.messageContent,
          updatedAt: new Date(),
        },
      });

      successCount++;
    }

    // =========================
    // Update Campaign Status
    // =========================
    await prisma.campaign.update({
  where: {
    id: campaignId,
  },
  data: {
    status: "COMPLETED",
  },
});

    // =========================
    // Success
    // =========================
    return res.status(200).json({
      success: true,
      totalSent: successCount,
      message: `${successCount} customer(s) received the campaign.`,
    });

  } catch (error) {

    console.error("Send Campaign Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send campaign.",
      error: error.message,
    });

  }
};