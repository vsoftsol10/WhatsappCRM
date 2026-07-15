// const prisma = require("../config/prisma");

// const getDashboardStats = async (req, res) => {
//   try {
//     const { id, role } = req.user;

//     // ===========================
//     // General Statistics
//     // ===========================

//     const totalCustomers = await prisma.customer.count();

//     const totalEmployees = await prisma.user.count({
//       where: {
//         role: "USER",
//       },
//     });

//     const totalConversations = await prisma.conversation.count();

//     const unreadConversations = await prisma.conversation.count({
//       where: {
//         unreadCount: {
//           gt: 0,
//         },
//       },
//     });

//     const totalLeads = await prisma.lead.count();

//     const totalCampaigns = await prisma.campaign.count();

//     const totalTemplates = await prisma.template.count();

//     // ===========================
//     // Lead Growth (Last 6 Months)
//     // ===========================

//     const leadGrowthRaw = await prisma.$queryRaw`
//       SELECT
//         TO_CHAR(DATE_TRUNC('month', "createdAt"), 'Mon') AS month,
//         COUNT(*)::int AS leads
//       FROM "Lead"
//       WHERE "createdAt" >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '5 months'
//       GROUP BY DATE_TRUNC('month', "createdAt")
//       ORDER BY DATE_TRUNC('month', "createdAt");
//     `;

//     // ===========================
//     // Fill Missing Months
//     // ===========================

//     const monthNames = [
//       "Jan",
//       "Feb",
//       "Mar",
//       "Apr",
//       "May",
//       "Jun",
//       "Jul",
//       "Aug",
//       "Sep",
//       "Oct",
//       "Nov",
//       "Dec",
//     ];

//     const currentMonth = new Date().getMonth();

//     const lastSixMonths = [];

//     for (let i = 5; i >= 0; i--) {
//       const monthIndex = (currentMonth - i + 12) % 12;

//       lastSixMonths.push({
//         month: monthNames[monthIndex],
//         leads: 0,
//       });
//     }

//     leadGrowthRaw.forEach((item) => {
//       const month = lastSixMonths.find((m) => m.month === item.month);

//       if (month) {
//         month.leads = Number(item.leads);
//       }
//     });

//     // ===========================
//     // Task Statistics
//     // ===========================

//     const taskFilter =
//       role === "ADMIN"
//         ? {}
//         : {
//             assignedToId: id,
//           };

//     const totalTasks = await prisma.task.count({
//       where: taskFilter,
//     });

//     const todoTasks = await prisma.task.count({
//       where: {
//         ...taskFilter,
//         status: "TODO",
//       },
//     });

//     const inProgressTasks = await prisma.task.count({
//       where: {
//         ...taskFilter,
//         status: "IN_PROGRESS",
//       },
//     });

//     const reviewTasks = await prisma.task.count({
//       where: {
//         ...taskFilter,
//         status: "REVIEW",
//       },
//     });

//     const completedTasks = await prisma.task.count({
//       where: {
//         ...taskFilter,
//         status: "COMPLETED",
//       },
//     });

//     // ===========================
//     // Response
//     // ===========================

//     return res.status(200).json({
//       success: true,
//       data: {
//         totalCustomers,
//         totalEmployees,
//         totalConversations,
//         unreadConversations,
//         totalLeads,
//         totalCampaigns,
//         totalTemplates,

//         tasks: {
//           total: totalTasks,
//           todo: todoTasks,
//           inProgress: inProgressTasks,
//           review: reviewTasks,
//           completed: completedTasks,
//         },

//         leadGrowth: lastSixMonths,
//       },
//     });
//   } catch (error) {
//     console.error("Dashboard Stats Error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch dashboard stats",
//     });
//   }
// };

// module.exports = {
//   getDashboardStats,
// };

const prisma = require("../config/prisma");

const getDashboardStats = async (req, res) => {
  try {
    const { id, role } = req.user;

    // ===========================
    // General Statistics (Optimized)
    // ===========================

    const [
      totalCustomers,
      totalEmployees,
      totalConversations,
      unreadConversations,
      totalLeads,
      totalCampaigns,
      totalTemplates,
    ] = await Promise.all([
      prisma.customer.count(),

      prisma.user.count({
        where: {
          role: "USER",
        },
      }),

      prisma.conversation.count(),

      prisma.conversation.count({
        where: {
          unreadCount: {
            gt: 0,
          },
        },
      }),

      prisma.lead.count(),

      prisma.campaign.count(),

      prisma.template.count(),
    ]);

    // ===========================
    // Lead Growth (Last 6 Months)
    // ===========================

    const leadGrowthRaw = await prisma.$queryRaw`
      SELECT
        TO_CHAR(DATE_TRUNC('month', "createdAt"), 'Mon') AS month,
        COUNT(*)::int AS leads
      FROM "Lead"
      WHERE "createdAt" >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '5 months'
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY DATE_TRUNC('month', "createdAt");
    `;

    // ===========================
    // Fill Missing Months
    // ===========================

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const currentMonth = new Date().getMonth();

    const lastSixMonths = [];

    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;

      lastSixMonths.push({
        month: monthNames[monthIndex],
        leads: 0,
      });
    }

    leadGrowthRaw.forEach((item) => {
      const month = lastSixMonths.find(
        (m) => m.month === item.month
      );

      if (month) {
        month.leads = Number(item.leads);
      }
    });

    // ===========================
    // Task Statistics
    // ===========================

    const taskFilter =
      role === "ADMIN"
        ? {}
        : {
            assignedToId: id,
          };

        const [
      totalTasks,
      todoTasks,
      inProgressTasks,
      reviewTasks,
      completedTasks,
    ] = await Promise.all([
      prisma.task.count({
        where: taskFilter,
      }),

      prisma.task.count({
        where: {
          ...taskFilter,
          status: "TODO",
        },
      }),

      prisma.task.count({
        where: {
          ...taskFilter,
          status: "IN_PROGRESS",
        },
      }),

      prisma.task.count({
        where: {
          ...taskFilter,
          status: "REVIEW",
        },
      }),

      prisma.task.count({
        where: {
          ...taskFilter,
          status: "COMPLETED",
        },
      }),
    ]);

    // ===========================
    // Response
    // ===========================

    return res.status(200).json({
      success: true,
      data: {
        totalCustomers,
        totalEmployees,
        totalConversations,
        unreadConversations,
        totalLeads,
        totalCampaigns,
        totalTemplates,

        tasks: {
          total: totalTasks,
          todo: todoTasks,
          inProgress: inProgressTasks,
          review: reviewTasks,
          completed: completedTasks,
        },

        leadGrowth: lastSixMonths,
      },
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats",
    });
  }
};

module.exports = {
  getDashboardStats,
};