// const prisma = require("../config/prisma");
// const { generateTemplate } = require("../services/geminiService");
// const { sendTextMessage, sendTemplateMessage, getMessageTemplates } = require("../services/whatsappService");
// const {
//   getOrCreateConversation,
// } = require("../helpers/conversationHelper");
// const { fillTemplatePlaceholders } = require("../utils/templatePlaceholders");

// // Same convention as campaignController's parseTemplateParams: the
// // frontend sends templateParams either as a real array (JSON body, since
// // templates are created via apiClient.post with a plain object, not
// // FormData) or as a JSON-stringified array/newline-separated string if
// // something upstream stringifies it. Normalizes all of that into a
// // clean string[] or undefined ("not touched"). Never throws — a bad or
// // legacy payload just falls back to undefined instead of blocking the
// // create/update.
// const parseTemplateParams = (raw) => {
//   if (raw === undefined || raw === null || raw === "") return undefined;
//   if (Array.isArray(raw)) {
//     return raw.map((v) => String(v ?? "").trim());
//   }
//   if (typeof raw === "string") {
//     try {
//       const parsed = JSON.parse(raw);
//       if (Array.isArray(parsed)) {
//         return parsed.map((v) => String(v ?? "").trim());
//       }
//     } catch (_) {
//       // not JSON — fall through
//     }
//     return raw
//       .split(/\r?\n|,/)
//       .map((v) => v.trim())
//       .filter((v) => v.length > 0);
//   }
//   return undefined;
// };

// // ================= CREATE TEMPLATE =================
// const createTemplate = async (req, res) => {
//   try {
//     const {
//       name,
//       category,
//       messageType,
//       content,
//       metaTemplateName,
//       metaTemplateLanguage,
//       templateParams,
//     } = req.body;

//     if (!name || !content) {
//       return res.status(400).json({
//         success: false,
//         message: "Name and content are required",
//       });
//     }

//     const template = await prisma.template.create({
//       data: {
//         name,
//         category,
//         messageType,
//         content,
//         // Empty string means "use the default generic template" —
//         // store it as null so the send logic's fallback is clean.
//         metaTemplateName: metaTemplateName?.trim() || null,
//         metaTemplateLanguage: metaTemplateLanguage?.trim() || "en_US",
//         templateParams: parseTemplateParams(templateParams) ?? null,
//         createdById: req.user.userId,
//       },
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Template created successfully",
//       data: template,
//     });
//   } catch (error) {
//     console.error("Create Template Error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to create template",
//       error: error.message,
//     });
//   }
// };

// // ================= GET ALL TEMPLATES =================
// const getTemplates = async (req, res) => {
//   try {
//     const { search, category, status } = req.query;

//     const where = {};

//     if (search) {
//       where.name = {
//         contains: search,
//         mode: "insensitive",
//       };
//     }

//     if (category) {
//       where.category = category;
//     }

//     if (status) {
//       where.status = status;
//     }

//     const templates = await prisma.template.findMany({
//       where,
//       include: {
//         createdBy: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//           },
//         },
//         recipients: {
//           select: {
//             customerId: true,
//             status: true,
//             sentAt: true,
//           },
//         },
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//     });

//     return res.status(200).json({
//       success: true,
//       count: templates.length,
//       data: templates,
//     });
//   } catch (error) {
//     console.error("Get Templates Error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch templates",
//       error: error.message,
//     });
//   }
// };

// // ================= GET SINGLE TEMPLATE =================
// const getTemplateById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const template = await prisma.template.findUnique({
//       where: {
//         id,
//       },
//       include: {
//         createdBy: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//           },
//         },
//         recipients: {
//           select: {
//             customerId: true,
//             status: true,
//             sentAt: true,
//           },
//         },
//       },
//     });

//     if (!template) {
//       return res.status(404).json({
//         success: false,
//         message: "Template not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       data: template,
//     });
//   } catch (error) {
//     console.error("Get Template Error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch template",
//       error: error.message,
//     });
//   }
// };

// // ================= UPDATE TEMPLATE =================
// const updateTemplate = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const {
//       name,
//       category,
//       messageType,
//       content,
//       status,
//       metaTemplateName,
//       metaTemplateLanguage,
//       templateParams,
//     } = req.body;

//     const existingTemplate = await prisma.template.findUnique({
//       where: { id },
//     });

//     if (!existingTemplate) {
//       return res.status(404).json({
//         success: false,
//         message: "Template not found",
//       });
//     }

//     const template = await prisma.template.update({
//       where: {
//         id,
//       },
//       data: {
//         name,
//         category,
//         messageType,
//         content,
//         status,
//         ...(metaTemplateName !== undefined && {
//           metaTemplateName: metaTemplateName?.trim() || null,
//         }),
//         ...(metaTemplateLanguage !== undefined && {
//           metaTemplateLanguage: metaTemplateLanguage?.trim() || "en_US",
//         }),
//         ...(parseTemplateParams(templateParams) !== undefined && {
//           templateParams: parseTemplateParams(templateParams),
//         }),
//       },
//     });

//     return res.status(200).json({
//       success: true,
//       message: "Template updated successfully",
//       data: template,
//     });
//   } catch (error) {
//     console.error("Update Template Error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to update template",
//       error: error.message,
//     });
//   }
// };

// // ================= DELETE TEMPLATE =================
// const deleteTemplate = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const existingTemplate = await prisma.template.findUnique({
//       where: { id },
//     });

//     if (!existingTemplate) {
//       return res.status(404).json({
//         success: false,
//         message: "Template not found",
//       });
//     }

//     await prisma.template.delete({
//       where: {
//         id,
//       },
//     });

//     return res.status(200).json({
//       success: true,
//       message: "Template deleted successfully",
//     });
//   } catch (error) {
//     console.error("Delete Template Error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to delete template",
//       error: error.message,
//     });
//   }
// };

// // ================= SEND TEMPLATE =================
// const sendTemplate = async (req, res) => {
//   try {

//     const {
//       templateId,
//       customerIds
//     } = req.body;


//     // Validation
//     if (
//       !templateId ||
//       !customerIds ||
//       !Array.isArray(customerIds) ||
//       customerIds.length === 0
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Template ID and customers are required.",
//       });
//     }



//     // Find Template
//     const template =
//       await prisma.template.findUnique({

//         where: {
//           id: templateId,
//         },

//       });



//     if (!template) {

//       return res.status(404).json({

//         success: false,

//         message: "Template not found.",

//       });

//     }




//     // Send template to each customer

//     for (const customerId of customerIds) {


//       // Find Customer

//       const customer =
//         await prisma.customer.findUnique({

//           where: {
//             id: customerId,
//           },

//         });



//       // If customer not found skip

//       if (!customer) {
//         continue;
//       }




//       // Find or create conversation (by phone — avoids duplicate
//       // conversations / unique constraint crashes when a
//       // Conversation already exists for this phone but isn't
//       // linked to this customerId yet)

//       let conversation = await getOrCreateConversation(customer.phone);

//       if (conversation.customerId !== customerId) {
//         conversation = await prisma.conversation.update({
//           where: { id: conversation.id },
//           data: { customerId },
//         });
//       }

// // =============================
// // Send WhatsApp Template
// // =============================

// let sendStatus = "FAILED";
// let metaMessageId = null;

// // Gemini-generated template copy may still contain literal
// // {{customer_name}} / {{company}} / {{phone}} / {{email}} tokens
// // (see templatePromptBuilder.js) — fill them with real values before
// // sending, otherwise the customer sees the raw tokens on WhatsApp.
// const personalizedContent = fillTemplatePlaceholders(
//     template.content,
//     customer
// );

// try {

//     // Templates without their own dedicated Meta-approved template
//     // fall back to the generic "custom_campaign_message" — which
//     // takes the whole body as a single {{2}} parameter, so WhatsApp
//     // strips any newlines out of it (Meta doesn't allow \n inside
//     // template parameter values). A template with metaTemplateName
//     // set has its own Meta-approved template with the full formatted
//     // body baked in server-side — only the customer's name goes in
//     // as {{1}}, so real line breaks/emojis/numbered lists reach the
//     // customer intact.
//     const usesDedicatedMetaTemplate = Boolean(template.metaTemplateName);

//     // A dedicated template's body parameters are configured once on the
//     // template itself (template.templateParams, same convention as
//     // Campaign.templateParams: an ordered array filling {{1}}, {{2}},
//     // {{3}}... on Meta's side). Values may contain {{customer_name}} etc.
//     // tokens, so run each through the same filler used for content above.
//     // Falls back to [customer.name] only for older dedicated templates
//     // that were created before templateParams existed (single {{1}}).
//     const hasDedicatedParams =
//       Array.isArray(template.templateParams) &&
//       template.templateParams.length > 0;

//     const dedicatedTemplateParams = usesDedicatedMetaTemplate
//       ? (hasDedicatedParams
//           ? template.templateParams.map((p) =>
//               fillTemplatePlaceholders(String(p ?? ""), customer)
//             )
//           : [customer.name])
//       : null;

//     const result = await sendTemplateMessage(
//         customer.phone,
//         usesDedicatedMetaTemplate
//           ? template.metaTemplateName
//           : "custom_campaign_message",
//         usesDedicatedMetaTemplate
//           ? dedicatedTemplateParams
//           : [customer.name, personalizedContent], // fills {{1}} and {{2}}
//         usesDedicatedMetaTemplate
//           ? (template.metaTemplateLanguage || "en_US")
//           : "en_US" // "custom_campaign_message" is approved under "English (US)"
//     );

//     console.log("WhatsApp Result:", result);

//     if (result.success) {
//         sendStatus = "SENT";
//         metaMessageId = result.data?.messages?.[0]?.id || null;
//     }

// } catch (err) {

//     console.error("WhatsApp Send Error:", err);

// }

// // =============================
// // Save Message
// // =============================

// await prisma.message.create({

//     data: {

//         conversationId: conversation.id,

//         sender: "AGENT",

//         content: personalizedContent,

//         messageType: "TEXT",

//         status: sendStatus,

//         metaMessageId,

//     },

// });

//       // Create or update template recipient history

//         await prisma.templateRecipient.upsert({
//           where: {
//             templateId_customerId: {
//               templateId,
//               customerId,
//             },
//           },
//           update: {
//             status: "SENT",
//             sentAt: new Date(),
//           },
//           create: {
//             templateId,
//             customerId,
//             status: "SENT",
//             sentAt: new Date(),
//           },
//         });

//       // Update conversation

//       await prisma.conversation.update({

//         where: {

//           id: conversation.id,

//         },


//         data: {

//           lastMessage: template.content,

//           updatedAt: new Date(),

//         },


//       });



//     }




//     return res.status(200).json({

//       success: true,

//       message: "Template sent successfully.",

//     });



//   } catch (error) {


//     console.error(
//       "Send Template Error:",
//       error
//     );



//     return res.status(500).json({

//       success: false,

//       message: "Failed to send template.",

//       error: error.message,

//     });


//   }
// };

// // ================= GENERATE TEMPLATE WITH AI =================
// const generateTemplateWithAI = async (req, res) => {
//   try {
//     const {
//       topic,
//       tone = "Professional",
//     } = req.body;

//     if (!topic) {
//       return res.status(400).json({
//         success: false,
//         message: "Topic is required.",
//       });
//     }

//     const content =
//       await generateTemplate(
//         topic,
//         tone
//       );

//     return res.status(200).json({
//       success: true,
//       message: "Template generated successfully.",
//       data: {
//         content,
//       },
//     });
//   } catch (error) {
//     console.error(
//       "Generate Template AI Error:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message:
//         "Failed to generate template.",
//       error: error.message,
//     });
//   }
// };

// // ================= GET TEMPLATE RECIPIENTS =================
// const getTemplateRecipients = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const recipients =
//       await prisma.templateRecipient.findMany({
//         where: {
//           templateId: id,
//         },
//         select: {
//           customerId: true,
//         },
//       });

//     return res.status(200).json({
//       success: true,
//       data: recipients.map(
//         (recipient) => recipient.customerId
//       ),
//     });
//   } catch (error) {
//     console.error(
//       "Get Template Recipients Error:",
//       error
//     );

//     return res.status(500).json({
//       success: false,
//       message:
//         "Failed to fetch template recipients.",
//       error: error.message,
//     });
//   }
// };

// // ================= GET META-APPROVED TEMPLATES (for dropdown) =================
// // Powers the "Meta Approved Template" dropdown in both the Campaign and
// // Template modals. Replaces the old free-text "type the exact name and
// // language" fields, which is what caused the earlier 132001 errors
// // (typo'd name, guessed-wrong language). The frontend only ever shows
// // what this returns, so an invalid name/language pair can no longer be
// // submitted.
// const getMetaApprovedTemplates = async (req, res) => {
//   try {
//     const result = await getMessageTemplates();

//     if (!result.success) {
//       return res.status(502).json({
//         success: false,
//         message:
//           "Could not fetch templates from WhatsApp Business Manager. Please try again shortly.",
//         error: result.error,
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       data: result.data,
//     });
//   } catch (error) {
//     console.error("Get Meta Approved Templates Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Something went wrong while fetching approved templates",
//     });
//   }
// };

// module.exports = {
//   createTemplate,
//   getTemplates,
//   getTemplateById,
//   updateTemplate,
//   deleteTemplate,
//   sendTemplate,
//   generateTemplateWithAI,
//   getTemplateRecipients,
//   getMetaApprovedTemplates,
// };

const prisma = require("../config/prisma");
const { generateTemplate } = require("../services/geminiService");
const { sendTextMessage, sendTemplateMessage, getMessageTemplates } = require("../services/whatsappService");
const {
  getOrCreateConversation,
} = require("../helpers/conversationHelper");
const { fillTemplatePlaceholders } = require("../utils/templatePlaceholders");
const { recordAuditLog } = require("../services/auditLogService");

// Same convention as campaignController's parseTemplateParams: the
// frontend sends templateParams either as a real array (JSON body, since
// templates are created via apiClient.post with a plain object, not
// FormData) or as a JSON-stringified array/newline-separated string if
// something upstream stringifies it. Normalizes all of that into a
// clean string[] or undefined ("not touched"). Never throws — a bad or
// legacy payload just falls back to undefined instead of blocking the
// create/update.
const parseTemplateParams = (raw) => {
  if (raw === undefined || raw === null || raw === "") return undefined;
  if (Array.isArray(raw)) {
    return raw.map((v) => String(v ?? "").trim());
  }
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map((v) => String(v ?? "").trim());
      }
    } catch (_) {
      // not JSON — fall through
    }
    return raw
      .split(/\r?\n|,/)
      .map((v) => v.trim())
      .filter((v) => v.length > 0);
  }
  return undefined;
};

// ================= CREATE TEMPLATE =================
const createTemplate = async (req, res) => {
  try {
    const {
      name,
      category,
      messageType,
      content,
      metaTemplateName,
      metaTemplateLanguage,
      templateParams,
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
        // Empty string means "use the default generic template" —
        // store it as null so the send logic's fallback is clean.
        metaTemplateName: metaTemplateName?.trim() || null,
        metaTemplateLanguage: metaTemplateLanguage?.trim() || "en_US",
        templateParams: parseTemplateParams(templateParams) ?? null,
        createdById: req.user.userId,
      },
    });

    // ================= AUDIT LOG =================
    await recordAuditLog({
      action: "TEMPLATE_CREATED",
      entityType: "Template",
      entityId: template.id,
      details: `${template.name} (${template.category})`,
      actorId: req.user?.userId,
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
        recipients: {
          select: {
            customerId: true,
            status: true,
            sentAt: true,
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
        recipients: {
          select: {
            customerId: true,
            status: true,
            sentAt: true,
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
      metaTemplateName,
      metaTemplateLanguage,
      templateParams,
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
        ...(metaTemplateName !== undefined && {
          metaTemplateName: metaTemplateName?.trim() || null,
        }),
        ...(metaTemplateLanguage !== undefined && {
          metaTemplateLanguage: metaTemplateLanguage?.trim() || "en_US",
        }),
        ...(parseTemplateParams(templateParams) !== undefined && {
          templateParams: parseTemplateParams(templateParams),
        }),
      },
    });

    // ================= AUDIT LOG =================
    const templateChanges = [];

    if (name !== undefined && name !== existingTemplate.name) {
      templateChanges.push(`name: ${existingTemplate.name} -> ${name}`);
    }
    if (status !== undefined && status !== existingTemplate.status) {
      templateChanges.push(`status: ${existingTemplate.status} -> ${status}`);
    }
    if (category !== undefined && category !== existingTemplate.category) {
      templateChanges.push(`category: ${existingTemplate.category} -> ${category}`);
    }

    if (templateChanges.length > 0) {
      await recordAuditLog({
        action: "TEMPLATE_UPDATED",
        entityType: "Template",
        entityId: template.id,
        details: `${existingTemplate.name}: ${templateChanges.join(", ")}`,
        actorId: req.user?.userId,
      });
    }

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

    // ================= AUDIT LOG =================
    await recordAuditLog({
      action: "TEMPLATE_DELETED",
      entityType: "Template",
      entityId: existingTemplate.id,
      details: existingTemplate.name,
      actorId: req.user?.userId,
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

    const {
      templateId,
      customerIds
    } = req.body;


    // Validation
    if (
      !templateId ||
      !customerIds ||
      !Array.isArray(customerIds) ||
      customerIds.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Template ID and customers are required.",
      });
    }



    // Find Template
    const template =
      await prisma.template.findUnique({

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




    // Send template to each customer

    for (const customerId of customerIds) {


      // Find Customer

      const customer =
        await prisma.customer.findUnique({

          where: {
            id: customerId,
          },

        });



      // If customer not found skip

      if (!customer) {
        continue;
      }




      // Find or create conversation (by phone — avoids duplicate
      // conversations / unique constraint crashes when a
      // Conversation already exists for this phone but isn't
      // linked to this customerId yet)

      let conversation = await getOrCreateConversation(customer.phone);

      if (conversation.customerId !== customerId) {
        conversation = await prisma.conversation.update({
          where: { id: conversation.id },
          data: { customerId },
        });
      }

// =============================
// Send WhatsApp Template
// =============================

let sendStatus = "FAILED";
let metaMessageId = null;

// Gemini-generated template copy may still contain literal
// {{customer_name}} / {{company}} / {{phone}} / {{email}} tokens
// (see templatePromptBuilder.js) — fill them with real values before
// sending, otherwise the customer sees the raw tokens on WhatsApp.
const personalizedContent = fillTemplatePlaceholders(
    template.content,
    customer
);

try {

    // Templates without their own dedicated Meta-approved template
    // fall back to the generic "custom_campaign_message" — which
    // takes the whole body as a single {{2}} parameter, so WhatsApp
    // strips any newlines out of it (Meta doesn't allow \n inside
    // template parameter values). A template with metaTemplateName
    // set has its own Meta-approved template with the full formatted
    // body baked in server-side — only the customer's name goes in
    // as {{1}}, so real line breaks/emojis/numbered lists reach the
    // customer intact.
    const usesDedicatedMetaTemplate = Boolean(template.metaTemplateName);

    // A dedicated template's body parameters are configured once on the
    // template itself (template.templateParams, same convention as
    // Campaign.templateParams: an ordered array filling {{1}}, {{2}},
    // {{3}}... on Meta's side). Values may contain {{customer_name}} etc.
    // tokens, so run each through the same filler used for content above.
    // Falls back to [customer.name] only for older dedicated templates
    // that were created before templateParams existed (single {{1}}).
    const hasDedicatedParams =
      Array.isArray(template.templateParams) &&
      template.templateParams.length > 0;

    const dedicatedTemplateParams = usesDedicatedMetaTemplate
      ? (hasDedicatedParams
          ? template.templateParams.map((p) =>
              fillTemplatePlaceholders(String(p ?? ""), customer)
            )
          : [customer.name])
      : null;

    const result = await sendTemplateMessage(
        customer.phone,
        usesDedicatedMetaTemplate
          ? template.metaTemplateName
          : "custom_campaign_message",
        usesDedicatedMetaTemplate
          ? dedicatedTemplateParams
          : [customer.name, personalizedContent], // fills {{1}} and {{2}}
        usesDedicatedMetaTemplate
          ? (template.metaTemplateLanguage || "en_US")
          : "en_US" // "custom_campaign_message" is approved under "English (US)"
    );

    console.log("WhatsApp Result:", result);

    if (result.success) {
        sendStatus = "SENT";
        metaMessageId = result.data?.messages?.[0]?.id || null;
    }

} catch (err) {

    console.error("WhatsApp Send Error:", err);

}

// =============================
// Save Message
// =============================

await prisma.message.create({

    data: {

        conversationId: conversation.id,

        sender: "AGENT",

        content: personalizedContent,

        messageType: "TEXT",

        status: sendStatus,

        metaMessageId,

    },

});

      // Create or update template recipient history

        await prisma.templateRecipient.upsert({
          where: {
            templateId_customerId: {
              templateId,
              customerId,
            },
          },
          update: {
            status: "SENT",
            sentAt: new Date(),
          },
          create: {
            templateId,
            customerId,
            status: "SENT",
            sentAt: new Date(),
          },
        });

      // Update conversation

      await prisma.conversation.update({

        where: {

          id: conversation.id,

        },


        data: {

          lastMessage: template.content,

          updatedAt: new Date(),

        },


      });



    }




    return res.status(200).json({

      success: true,

      message: "Template sent successfully.",

    });



  } catch (error) {


    console.error(
      "Send Template Error:",
      error
    );



    return res.status(500).json({

      success: false,

      message: "Failed to send template.",

      error: error.message,

    });


  }
};

// ================= GENERATE TEMPLATE WITH AI =================
const generateTemplateWithAI = async (req, res) => {
  try {
    const {
      topic,
      tone = "Professional",
    } = req.body;

    if (!topic) {
      return res.status(400).json({
        success: false,
        message: "Topic is required.",
      });
    }

    const content =
      await generateTemplate(
        topic,
        tone
      );

    return res.status(200).json({
      success: true,
      message: "Template generated successfully.",
      data: {
        content,
      },
    });
  } catch (error) {
    console.error(
      "Generate Template AI Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to generate template.",
      error: error.message,
    });
  }
};

// ================= GET TEMPLATE RECIPIENTS =================
const getTemplateRecipients = async (req, res) => {
  try {
    const { id } = req.params;

    const recipients =
      await prisma.templateRecipient.findMany({
        where: {
          templateId: id,
        },
        select: {
          customerId: true,
        },
      });

    return res.status(200).json({
      success: true,
      data: recipients.map(
        (recipient) => recipient.customerId
      ),
    });
  } catch (error) {
    console.error(
      "Get Template Recipients Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch template recipients.",
      error: error.message,
    });
  }
};

// ================= GET META-APPROVED TEMPLATES (for dropdown) =================
// Powers the "Meta Approved Template" dropdown in both the Campaign and
// Template modals. Replaces the old free-text "type the exact name and
// language" fields, which is what caused the earlier 132001 errors
// (typo'd name, guessed-wrong language). The frontend only ever shows
// what this returns, so an invalid name/language pair can no longer be
// submitted.
const getMetaApprovedTemplates = async (req, res) => {
  try {
    const result = await getMessageTemplates();

    if (!result.success) {
      return res.status(502).json({
        success: false,
        message:
          "Could not fetch templates from WhatsApp Business Manager. Please try again shortly.",
        error: result.error,
      });
    }

    return res.status(200).json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.error("Get Meta Approved Templates Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching approved templates",
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
  generateTemplateWithAI,
  getTemplateRecipients,
  getMetaApprovedTemplates,
};