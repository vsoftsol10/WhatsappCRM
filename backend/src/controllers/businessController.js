const prisma = require("../config/prisma");
const { recordAuditLog } = require("../services/auditLogService");

exports.getBusinesses = async (req, res) => {
  try {
    const businesses = await prisma.business.findMany({
      where: req.query.includeInactive === "true" ? {} : { isActive: true },
      orderBy: { name: "asc" },
      // Powers the per-business stat chips on the Businesses page (customers,
      // templates, campaigns) without the frontend needing separate calls.
      include: { _count: { select: { customers: true, templates: true, campaigns: true } } },
    });
    return res.json({ success: true, data: businesses });
  } catch (error) {
    console.error("Get businesses error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch businesses." });
  }
};
exports.createBusiness = async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    if (!name) return res.status(400).json({ success: false, message: "Business name is required." });
    const business = await prisma.business.create({ data: { name } });
    await recordAuditLog({ action: "BUSINESS_CREATED", entityType: "Business", entityId: business.id, details: business.name, actorId: req.user?.userId });
    return res.status(201).json({ success: true, data: business });
  } catch (error) {
    if (error.code === "P2002") return res.status(409).json({ success: false, message: "A business with this name already exists." });
    console.error("Create business error:", error);
    return res.status(500).json({ success: false, message: "Failed to create business." });
  }
};
exports.updateBusiness = async (req, res) => {
  try {
    const name = req.body.name === undefined ? undefined : String(req.body.name).trim();
    if (name === "") return res.status(400).json({ success: false, message: "Business name cannot be empty." });
    const business = await prisma.business.update({ where: { id: req.params.id }, data: { ...(name !== undefined && { name }), ...(typeof req.body.isActive === "boolean" && { isActive: req.body.isActive }) } });
    return res.json({ success: true, data: business });
  } catch (error) {
    if (error.code === "P2025") return res.status(404).json({ success: false, message: "Business not found." });
    if (error.code === "P2002") return res.status(409).json({ success: false, message: "A business with this name already exists." });
    console.error("Update business error:", error);
    return res.status(500).json({ success: false, message: "Failed to update business." });
  }
};