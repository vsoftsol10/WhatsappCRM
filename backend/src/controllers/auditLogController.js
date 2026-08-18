const prisma = require("../config/prisma");

// GET /api/audit-logs?page=1&limit=20&entityType=Employee
const getAuditLogs = async (req, res) => {
  try {
    const { page, limit, entityType } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));

    const where = entityType ? { entityType } : {};

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        include: {
          actor: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
      }),
      prisma.auditLog.count({ where }),
    ]);

    return res.status(200).json({
      success: true,
      logs,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.max(1, Math.ceil(total / limitNum)),
      },
    });
  } catch (error) {
    console.error("Get Audit Logs Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch audit logs",
    });
  }
};

module.exports = { getAuditLogs };
