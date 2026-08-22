const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const {
  sendTextMessage,
  sendImageMessage,
  sendTemplateMessage,
  sendCampaignImageTemplate,
} = require("../services/whatsappService");
const { generateCampaign } = require("../services/geminiService");
const { notifyAdmins } = require("../services/notificationService");
const {
  uploadCampaignImage,
} = require("../services/cloudinaryService");
const {
  getOrCreateConversation,
} = require("../helpers/conversationHelper");
const { getIO } = require("../config/socket");
const { fillTemplatePlaceholders } = require("../utils/templatePlaceholders");

// The frontend sends templateParams either as a real JSON-stringified
// array (multipart form fields are always strings) or, if a field is
// left blank, as undefined. Normalizes all of that into either a clean
// string[] or null. Never throws — a bad/legacy payload just falls
// back to null instead of blocking campaign creation.
const parseTemplateParams = (raw) => {
  if (raw === undefined || raw === null || raw === "") return undefined; // not touched
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
    // Fallback: newline or comma separated plain string
    return raw
      .split(/\r?\n|,/)
      .map((v) => v.trim())
      .filter((v) => v.length > 0);
  }
  return null;
};

// =====================================================
// CREATE CAMPAIGN
// =====================================================
exports.createCampaign = async (req, res) => {
  try {
    let {
  name,
  type,
  messageContent,
  scheduledAt,
  customerIds,
  metaTemplateName,
  metaTemplateLanguage,
  templateParams,
} = req.body;

// =============================
// Convert customerIds to array
// =============================
if (!customerIds) {
  customerIds = [];
} else if (!Array.isArray(customerIds)) {
  customerIds = [customerIds];
}

// Convert all ids to Number
customerIds = customerIds.map((id) => String(id));

console.log("Customer IDs:", customerIds);

console.log("Customer IDs:", customerIds);
console.log("Is Array:", Array.isArray(customerIds));
    if (!name || !messageContent) {
      return res.status(400).json({
        success: false,
        message: "Campaign name and message are required.",
      });
    }

   // ============================
// Upload Image to Cloudinary
// ============================
let imageUrl = null;

if (req.file) {
  const uploadResult = await uploadCampaignImage(req.file);

  imageUrl = uploadResult?.imageUrl || null;
}

    const campaign = await prisma.campaign.create({
      data: {
        name,
        type,
        messageContent,

        // NEW FIELD
        imageUrl,

        metaTemplateName: metaTemplateName?.trim() || null,
        metaTemplateLanguage: metaTemplateLanguage?.trim() || "en_US",
        templateParams: parseTemplateParams(templateParams) ?? null,

        scheduledAt: scheduledAt
          ? new Date(scheduledAt)
          : null,

        audienceCount: customerIds.length,

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

    notifyAdmins({
  title: "New Campaign",
  message: `${campaign.name} has been created.`,
  type: "CAMPAIGN",
}).catch(console.error);

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

// =====================================================
// GET ALL CAMPAIGNS
// =====================================================
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

// =====================================================
// GET CAMPAIGN BY ID
// =====================================================
exports.getCampaignById = async (req, res) => {
  try {

    const { id } = req.params;

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
// =====================================================
// UPDATE CAMPAIGN
// =====================================================
exports.updateCampaign = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      type,
      messageContent,
      status,
      scheduledAt,
      metaTemplateName,
      metaTemplateLanguage,
      templateParams,
    } = req.body;

    // Find campaign
    const existingCampaign = await prisma.campaign.findUnique({
      where: { id },
    });

    if (!existingCampaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found.",
      });
    }

    // Keep old image
// Keep old image
let imageUrl = existingCampaign.imageUrl;

// Upload new image if selected
if (req.file) {
  const uploadResult = await uploadCampaignImage(req.file);

  imageUrl = uploadResult?.imageUrl || existingCampaign.imageUrl;
}

    const campaign = await prisma.campaign.update({
      where: {
        id,
      },

      data: {
        ...(name && { name }),
        ...(type && { type }),
        ...(messageContent && { messageContent }),
        ...(status && { status }),
        ...(metaTemplateName !== undefined && {
          metaTemplateName: metaTemplateName?.trim() || null,
        }),
        ...(metaTemplateLanguage !== undefined && {
          metaTemplateLanguage: metaTemplateLanguage?.trim() || "en_US",
        }),
        ...(parseTemplateParams(templateParams) !== undefined && {
          templateParams: parseTemplateParams(templateParams),
        }),

        imageUrl,

        scheduledAt:
          scheduledAt !== undefined
            ? scheduledAt
              ? new Date(scheduledAt)
              : null
            : undefined,
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

// =====================================================
// DELETE CAMPAIGN
// =====================================================
exports.deleteCampaign = async (req, res) => {
  try {

    const { id } = req.params;

    const campaign = await prisma.campaign.findUnique({
      where: { id },
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found.",
      });
    }

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

// =====================================================
// GENERATE AI CAMPAIGN
// =====================================================
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
// =====================================================
// SEND CAMPAIGN TO CUSTOMERS
// =====================================================
// Previously this whole loop ran inside the request/response cycle —
// fine for a handful of customers, but a request that has to send
// WhatsApp messages to hundreds of customers one at a time can
// easily exceed a platform's request timeout (e.g. Render), leaving
// the campaign half-sent with no record of where it stopped. Now the
// route validates, flips the campaign to SENDING, and responds
// immediately; the actual sending happens in the background via
// processCampaignSend, and the campaign is moved to COMPLETED (with
// the real audienceCount/successCount) once every customer has been
// processed. The frontend picks up the SENDING status right away and
// can refetch/listen on the socket "campaign:update" event this
// emits when it finishes.
exports.sendCampaign = async (req, res) => {
  try {
    console.log("========== SEND CAMPAIGN ==========");
    console.log("Request Body:", req.body);
    const { campaignId, customerIds } = req.body;

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

    await prisma.campaign.update({
      where: { id: campaignId },
      data: { status: "SENDING" },
    });

    // Not awaited on purpose — this runs after the response is sent.
    // Errors inside are caught and logged there so they can't crash
    // the process or leave an unhandled rejection.
    processCampaignSend(campaign, customerIds);

    return res.status(202).json({
      success: true,
      message: `Campaign is being sent to ${customerIds.length} customer(s).`,
      status: "SENDING",
    });
  } catch (error) {
    console.error("Send Campaign Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to start campaign send.",
      error: error.message,
    });
  }
};

// Does the actual per-customer sending. Split out from sendCampaign
// so it can run in the background after the HTTP response has
// already gone out.
const processCampaignSend = async (campaign, customerIds) => {
  const campaignId = campaign.id;

  try {
    let successCount = 0;

    for (const customerId of customerIds) {

      // =============================
      // Find Customer
      // =============================
      const customer = await prisma.customer.findUnique({
        where: {
          id: customerId,
        },
      });

      if (!customer) continue;

      // =============================
      // Save Campaign Recipient
      // =============================
      const existingRecipient =
        await prisma.campaignRecipient.findUnique({
          where: {
            campaignId_customerId: {
              campaignId,
              customerId,
            },
          },
        });

      if (!existingRecipient) {
        await prisma.campaignRecipient.create({
          data: {
            campaignId,
            customerId,
          },
        });
      }

      // =============================
      // Find or Create Conversation (by phone — avoids duplicate
      // conversations / unique constraint crashes when a
      // Conversation already exists for this phone but isn't
      // linked to this customerId yet, e.g. inbound webhook
      // messages that arrived before the Customer record existed)
      // =============================
      let conversation = await getOrCreateConversation(customer.phone);

      if (conversation.customerId !== customerId) {
        conversation = await prisma.conversation.update({
          where: { id: conversation.id },
          data: { customerId },
        });
      }

// =============================
// Send WhatsApp Message
// =============================

let sendStatus = "FAILED";
let metaMessageId = null;

// Gemini-generated campaign copy may still contain literal
// {{customer_name}} / {{company}} / {{phone}} / {{email}} tokens
// (see templatePromptBuilder.js) — fill them with real values
// before this text goes into the template's {{2}} body variable,
// otherwise the customer sees the raw tokens on WhatsApp. Declared
// outside the try block since it's also used when saving the message
// below (including on failure, so the saved log still reads correctly).
const personalizedMessage = fillTemplatePlaceholders(
  campaign.messageContent,
  customer
);

try {

  let result;

  // Campaigns are business-initiated, so they must always go
  // through an approved template (never plain sendTextMessage).
  // A campaign with its own dedicated Meta-approved template
  // (metaTemplateName set) has its own body variables baked in on
  // Meta's side — those variables' actual values live in
  // campaign.templateParams (set once when the campaign is created,
  // e.g. [eventName, date, time, location, contact]), NOT in
  // messageContent. Falls back to the generic templates only when
  // no dedicated template is set at all.
  const usesDedicatedMetaTemplate = Boolean(campaign.metaTemplateName);

  // Bug history: this used to silently send `[]` as the body params
  // for any dedicated template, which only worked for templates with
  // zero body variables. Against a template with real {{1}}..{{n}}
  // placeholders (e.g. vedaconnect_campaign, which has 5), Meta either
  // rejects the send or — worse — WhatsApp clients have shown stale/
  // mismatched cached content in that failure mode. Rather than
  // guessing the param count, we require templateParams to be set
  // whenever metaTemplateName is set, and fail this recipient loudly
  // (not fall back to the wrong generic template) if it's missing.
  if (usesDedicatedMetaTemplate) {
    const hasParams =
      Array.isArray(campaign.templateParams) &&
      campaign.templateParams.length > 0;

    if (!hasParams) {
      throw new Error(
        `Campaign "${campaign.name}" has metaTemplateName="${campaign.metaTemplateName}" set but no templateParams. ` +
        `Edit the campaign and fill in the body parameter values for this template before sending.`
      );
    }
  }

  // Per-recipient personalization: templateParams may itself contain
  // {{customer_name}} etc. tokens (same convention as messageContent),
  // so run each value through the same filler before sending.
  const dedicatedTemplateParams = usesDedicatedMetaTemplate
    ? campaign.templateParams.map((p) =>
        fillTemplatePlaceholders(String(p ?? ""), customer)
      )
    : null;

  if (campaign.imageUrl) {

    result = await sendCampaignImageTemplate(
      customer.phone,
      usesDedicatedMetaTemplate
        ? campaign.metaTemplateName
        : "campaign", // approved IMAGE-header template name (Meta template: "campaign")
       campaign.imageUrl,
      usesDedicatedMetaTemplate
        ? dedicatedTemplateParams // fills {{1}}..{{n}} on the dedicated template's body
        : [customer.name, personalizedMessage], // fills {{1}} and {{2}} on "campaign"
      "en" // Meta approved this template under "English", not "English (US)"
    );

  } else {

    result = await sendTemplateMessage(
      customer.phone,
      usesDedicatedMetaTemplate
        ? campaign.metaTemplateName
        : "custom_campaign_message", // approved text-only template name
      usesDedicatedMetaTemplate
        ? dedicatedTemplateParams
        : [customer.name, personalizedMessage], // fills {{1}} and {{2}}
      usesDedicatedMetaTemplate
        ? (campaign.metaTemplateLanguage || "en_US")
        : "en" // "custom_campaign_message" is approved under "English", not "English (US)"
    );

  }

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
    content: personalizedMessage,
    imageUrl: campaign.imageUrl,
    messageType: campaign.imageUrl ? "IMAGE" : "TEXT",
    status: sendStatus,
    metaMessageId,
  },
});

      // =============================
      // Update Conversation
      // =============================
      await prisma.conversation.update({
        where: {
          id: conversation.id,
        },
        data: {
          lastMessage: campaign.messageContent,
        },
      });

      if (sendStatus === "SENT") {
  successCount++;
}
    }

    // =============================
    // Audience Count
    // =============================
    const audienceCount =
      await prisma.campaignRecipient.count({
        where: {
          campaignId,
        },
      });

    // =============================
    // Update Campaign
    // =============================
    const updatedCampaign = await prisma.campaign.update({
      where: {
        id: campaignId,
      },
      data: {
        status: "COMPLETED",
        audienceCount,
      },
    });

    console.log(
      `Campaign ${campaignId} finished: ${successCount}/${customerIds.length} sent.`
    );

    try {
      getIO().to("agents").emit("campaign:update", updatedCampaign);
    } catch (socketError) {
      console.error("Socket broadcast failed:", socketError.message);
    }
  } catch (error) {
    console.error("Campaign background send failed:", error);

    // Best-effort: mark the campaign FAILED so it doesn't sit stuck
    // on SENDING forever if something threw mid-loop.
    try {
      await prisma.campaign.update({
        where: { id: campaignId },
        data: { status: "FAILED" },
      });
    } catch (updateError) {
      console.error(
        "Failed to mark campaign as FAILED after error:",
        updateError
      );
    }
  }
};

// =====================================================
// GET CAMPAIGN RECIPIENTS
// =====================================================
exports.getCampaignRecipients = async (req, res) => {
  try {

    const { id } = req.params;

    const recipients =
      await prisma.campaignRecipient.findMany({

        where: {
          campaignId: id,
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
      "Get Campaign Recipients Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch campaign recipients.",
      error: error.message,
    });

  }
};