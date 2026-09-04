// const { Server } = require("socket.io");
// const jwt = require("jsonwebtoken");

// let io = null;

// // Initialize socket.io on top of the existing HTTP server. Called once
// // from server.js after the Express app is wrapped in http.createServer.
// function initSocket(httpServer) {
//   io = new Server(httpServer, {
//     cors: {
//       origin: "*",
//       methods: ["GET", "POST"],
//     },
//   });

//   // Auth handshake: the frontend passes the same JWT it already sends
//   // as a Bearer header on REST calls, via socket.handshake.auth.token.
//   io.use((socket, next) => {
//     try {
//       const token =
//         socket.handshake.auth?.token ||
//         socket.handshake.headers?.authorization?.split(" ")[1];

//       if (!token) {
//         return next(new Error("No token provided"));
//       }

//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       socket.user = decoded;
//       next();
//     } catch (error) {
//       next(new Error("Invalid or expired token"));
//     }
//   });

//   io.on("connection", (socket) => {
//     console.log("Socket connected:", socket.id, "user:", socket.user?.userId);

//     // Single-tenant deployment — every authenticated agent joins one
//     // shared room so any conversation/message update reaches every
//     // connected agent's dashboard in real time.
//     socket.join("agents");

//     // Per-user room — lets us target notifications at the specific
//     // user they belong to instead of broadcasting to everyone.
//     if (socket.user?.userId) {
//       socket.join(`user:${socket.user.userId}`);
//     }

//     // Per-conversation room, joined when an agent opens that chat.
//     // Lets us later add typing indicators without broadcasting them
//     // to agents who aren't even looking at that conversation.
//     socket.on("conversation:join", (conversationId) => {
//       if (conversationId) {
//         socket.join(`conversation:${conversationId}`);
//       }
//     });

//     socket.on("conversation:leave", (conversationId) => {
//       if (conversationId) {
//         socket.leave(`conversation:${conversationId}`);
//       }
//     });

//     socket.on("disconnect", () => {
//       console.log("Socket disconnected:", socket.id);
//     });
//   });

//   return io;
// }

// // Emit helper used by controllers/webhook — throws loudly in dev if
// // someone calls this before initSocket() ran, instead of silently
// // no-op-ing and leaving a confusing "why doesn't realtime work" bug.
// function getIO() {
//   if (!io) {
//     throw new Error("Socket.io not initialized. Call initSocket(server) first.");
//   }
//   return io;
// }

// module.exports = { initSocket, getIO };

const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

let io = null;

// Initialize socket.io on top of the existing HTTP server. Called once
// from server.js after the Express app is wrapped in http.createServer.
// Same allow-list the REST API uses (server.js) — previously this was
// "*", so any website could open a socket connection to our server.
// The JWT handshake check below still blocks unauthenticated
// connections, but there's no reason to also leave the transport-level
// CORS wide open when only our own frontend needs it.
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Auth handshake: the frontend passes the same JWT it already sends
  // as a Bearer header on REST calls, via socket.handshake.auth.token.
  io.use((socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.split(" ")[1];

      if (!token) {
        return next(new Error("No token provided"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (error) {
      next(new Error("Invalid or expired token"));
    }
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id, "user:", socket.user?.userId);

    // Single-tenant deployment — every authenticated agent joins one
    // shared room so any conversation/message update reaches every
    // connected agent's dashboard in real time.
    socket.join("agents");

    // Per-user room — lets us target notifications at the specific
    // user they belong to instead of broadcasting to everyone.
    if (socket.user?.userId) {
      socket.join(`user:${socket.user.userId}`);
    }

    // Per-conversation room, joined when an agent opens that chat.
    // Lets us later add typing indicators without broadcasting them
    // to agents who aren't even looking at that conversation.
    socket.on("conversation:join", (conversationId) => {
      if (conversationId) {
        socket.join(`conversation:${conversationId}`);
      }
    });

    socket.on("conversation:leave", (conversationId) => {
      if (conversationId) {
        socket.leave(`conversation:${conversationId}`);
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  return io;
}

// Emit helper used by controllers/webhook — throws loudly in dev if
// someone calls this before initSocket() ran, instead of silently
// no-op-ing and leaving a confusing "why doesn't realtime work" bug.
function getIO() {
  if (!io) {
    throw new Error("Socket.io not initialized. Call initSocket(server) first.");
  }
  return io;
}

module.exports = { initSocket, getIO };