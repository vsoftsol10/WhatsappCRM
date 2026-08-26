// const { PrismaClient, NotificationType } = require("@prisma/client");

// const prisma = new PrismaClient();

// // ==========================================
// // CREATE NOTIFICATION FOR A SINGLE USER
// // ==========================================
// const notifyUser = async ({
//   userId,
//   title,
//   message,
//   type,
// }) => {
//   try {
//     return await prisma.notification.create({
//       data: {
//         userId,
//         title,
//         message,
//         type,
//       },
//     });
//   } catch (error) {
//     console.error("Notify User Error:", error);
//     throw error;
//   }
// };

// // ==========================================
// // CREATE NOTIFICATIONS FOR MULTIPLE USERS
// // ==========================================
// const notifyUsers = async ({
//   userIds,
//   title,
//   message,
//   type,
// }) => {
//   try {
//     if (!userIds || userIds.length === 0) {
//       return;
//     }

//     return await prisma.notification.createMany({
//       data: userIds.map((userId) => ({
//         userId,
//         title,
//         message,
//         type,
//       })),
//     });
//   } catch (error) {
//     console.error("Notify Users Error:", error);
//     throw error;
//   }
// };

// // ==========================================
// // CREATE NOTIFICATION FOR ALL ADMINS
// // ==========================================
// const notifyAdmins = async ({
//   title,
//   message,
//   type,
// }) => {
//   try {
//     const admins = await prisma.user.findMany({
//       where: {
//         role: "ADMIN",
//       },
//       select: {
//         id: true,
//       },
//     });

//     if (admins.length === 0) {
//       return;
//     }

//     return await prisma.notification.createMany({
//       data: admins.map((admin) => ({
//         userId: admin.id,
//         title,
//         message,
//         type,
//       })),
//     });
//   } catch (error) {
//     console.error("Notify Admins Error:", error);
//     throw error;
//   }
// };

// module.exports = {
//   notifyUser,
//   notifyUsers,
//   notifyAdmins,
//   NotificationType,
// };

const { PrismaClient, NotificationType } = require("@prisma/client");
const { getIO } = require("../config/socket");

const prisma = new PrismaClient();

// ==========================================
// EMIT HELPER
// ==========================================
// Pushes a freshly-created notification down the recipient's personal
// socket room ("user:<id>", joined in config/socket.js on connect).
// This is what the frontend's NotificationButton.jsx has been
// listening for all along (notification:new) — previously nothing
// ever emitted it, so notifications only ever showed up after a full
// page refresh. Wrapped in try/catch so that if socket.io hasn't been
// initialized yet (e.g. a script/seed run outside the normal server
// boot) or a user simply isn't connected, the DB write above this
// still succeeds — real-time push is a nice-to-have on top of it, not
// a requirement for the notification to exist.
const emitToUser = (userId, notification) => {
  try {
    getIO().to(`user:${userId}`).emit("notification:new", notification);
  } catch (error) {
    console.error("Notification socket emit failed:", error.message);
  }
};

// ==========================================
// CREATE NOTIFICATION FOR A SINGLE USER
// ==========================================
const notifyUser = async ({
  userId,
  title,
  message,
  type,
}) => {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
      },
    });

    emitToUser(userId, notification);

    return notification;
  } catch (error) {
    console.error("Notify User Error:", error);
    throw error;
  }
};

// ==========================================
// CREATE NOTIFICATIONS FOR MULTIPLE USERS
// ==========================================
const notifyUsers = async ({
  userIds,
  title,
  message,
  type,
}) => {
  try {
    if (!userIds || userIds.length === 0) {
      return;
    }

    // createMany() only returns a { count }, not the created rows, so
    // there'd be nothing to emit over the socket (no id/createdAt for
    // the frontend to render or later mark-as-read). Creating them
    // individually costs one query per recipient instead of one query
    // total, but this only ever runs for a handful of recipients at a
    // time (a lead/task/ticket's watchers), so that's a fine trade for
    // getting real-time push working.
    const notifications = await Promise.all(
      userIds.map((userId) =>
        prisma.notification.create({
          data: { userId, title, message, type },
        })
      )
    );

    notifications.forEach((notification) => {
      emitToUser(notification.userId, notification);
    });

    return notifications;
  } catch (error) {
    console.error("Notify Users Error:", error);
    throw error;
  }
};

// ==========================================
// CREATE NOTIFICATION FOR ALL ADMINS
// ==========================================
const notifyAdmins = async ({
  title,
  message,
  type,
}) => {
  try {
    const admins = await prisma.user.findMany({
      where: {
        role: "ADMIN",
      },
      select: {
        id: true,
      },
    });

    if (admins.length === 0) {
      return;
    }

    // Same reasoning as notifyUsers above — individual creates so we
    // have full rows to emit in real time.
    const notifications = await Promise.all(
      admins.map((admin) =>
        prisma.notification.create({
          data: { userId: admin.id, title, message, type },
        })
      )
    );

    notifications.forEach((notification) => {
      emitToUser(notification.userId, notification);
    });

    return notifications;
  } catch (error) {
    console.error("Notify Admins Error:", error);
    throw error;
  }
};

module.exports = {
  notifyUser,
  notifyUsers,
  notifyAdmins,
  NotificationType,
};