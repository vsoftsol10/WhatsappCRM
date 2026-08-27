// const prisma = require("../config/prisma");

// // GET /api/audit-logs?page=1&limit=20&entityType=Employee
// const getAuditLogs = async (req, res) => {
//   try {
//     const { page, limit, entityType } = req.query;

//     const pageNum = Math.max(1, parseInt(page, 10) || 1);
//     const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));

//     const where = entityType ? { entityType } : {};

//     const [logs, total] = await Promise.all([
//       prisma.auditLog.findMany({
//         where,
//         include: {
//           actor: {
//             select: { id: true, name: true, email: true },
//           },
//         },
//         orderBy: { createdAt: "desc" },
//         skip: (pageNum - 1) * limitNum,
//         take: limitNum,
//       }),
//       prisma.auditLog.count({ where }),
//     ]);

//     return res.status(200).json({
//       success: true,
//       logs,
//       pagination: {
//         page: pageNum,
//         limit: limitNum,
//         total,
//         totalPages: Math.max(1, Math.ceil(total / limitNum)),
//       },
//     });
//   } catch (error) {
//     console.error("Get Audit Logs Error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch audit logs",
//     });
//   }
// };

// module.exports = { getAuditLogs };


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

// GET /api/audit-logs/stats
// Returns total activity, activity today, activity this week, and a
// per-entityType breakdown — all in a small, fixed number of queries
// regardless of how many entity types exist (Lead/Task/Ticket/
// Campaign/Template/User were all added after Employee/Customer, so
// this can't stay hardcoded to 2 types the way the old frontend-side
// stat cards were).
const getAuditLogStats = async (req, res) => {
  try {
    const now = new Date();

    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    const [total, today, thisWeek, byEntityType] = await Promise.all([
      prisma.auditLog.count(),
      prisma.auditLog.count({
        where: { createdAt: { gte: startOfToday } },
      }),
      prisma.auditLog.count({
        where: { createdAt: { gte: startOfWeek } },
      }),
      prisma.auditLog.groupBy({
        by: ["entityType"],
        _count: { _all: true },
      }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        total,
        today,
        thisWeek,
        byEntityType: byEntityType.map((row) => ({
          entityType: row.entityType,
          count: row._count._all,
        })),
      },
    });
  } catch (error) {
    console.error("Get Audit Log Stats Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch audit log stats",
    });
  }
};

module.exports = { getAuditLogs, getAuditLogStats };