const prisma = require("../config/prisma");

// Writes one audit log row. Deliberately swallows its own errors —
// an audit log write failing should never break the actual
// operation it's recording (e.g. an employee being deleted should
// still succeed even if the audit insert somehow fails).
const recordAuditLog = async ({
  action,
  entityType,
  entityId,
  details = null,
  actorId = null,
}) => {
  try {
    await prisma.auditLog.create({
      data: {
        action,
        entityType,
        entityId: String(entityId),
        details,
        actorId,
      },
    });
  } catch (error) {
    console.error("Failed to write audit log:", error);
  }
};

module.exports = { recordAuditLog };