const dns = require("dns");
// Render's network doesn't have a working IPv6 route, but Node 17+
// resolves hostnames IPv6-first by default. This breaks outbound
// connections like Gmail SMTP (nodemailer) with ENETUNREACH.
// Forcing IPv4-first resolution for the whole process fixes it.
dns.setDefaultResultOrder("ipv4first");

const express = require("express");
const cors = require("cors");
const http = require("http");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const { initSocket } = require("./config/socket");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const customerRoutes = require("./routes/customerRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const conversationRoutes = require("./routes/conversationRoutes");
const messageRoutes = require("./routes/messageRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const leadRoutes = require("./routes/leadRoutes");
const campaignRoutes = require("./routes/campaignRoutes");
const templateRoutes = require("./routes/templateRoutes");
const taskRoutes = require("./routes/taskRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const dealRoutes = require("./routes/dealRoutes");
const dealActivityRoutes = require("./routes/dealActivityRoutes");
const webhookRoutes = require("./routes/webhook");
const notificationRoutes = require("./routes/notificationRoutes");
const auditLogRoutes = require("./routes/auditLogRoutes");

const {
  releaseStalePendingLeads,
} = require("./helpers/leadEnrichmentHelper");

const {
  releaseStalePendingTickets,
} = require("./helpers/ticketEnrichmentHelper");

const app = express();

// Render (like most hosts) sits behind a reverse proxy, which sets
// the X-Forwarded-For header with the real client IP. Without this,
// Express ignores that header, so express-rate-limit can't tell
// requests apart by IP (and throws a warning about it). `1` means
// trust exactly one hop of proxy — matches Render's setup.
app.set("trust proxy", 1);

// Middleware
app.use(helmet());

// Only our own frontend (Hostinger-hosted) is allowed to call this
// API from a browser. Previously cors() had no origin restriction,
// so any website could make requests against this backend.
const allowedOrigin =
  process.env.FRONTEND_URL || "http://localhost:5173";

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);

// Login/register/forgot-password are the routes an attacker would
// brute-force (guessing passwords, spamming reset emails). This caps
// each IP to 20 attempts per 15 minutes on just those routes — the
// rest of the API is unaffected.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many attempts. Please try again later.",
  },
});
// The `verify` hook stashes the raw request body on req.rawBody
// before it's parsed, so webhook.js can verify Meta's
// X-Hub-Signature-256 header against the exact bytes that were sent.
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);

// Routes
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/templates", templateRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/deals", dealRoutes);
app.use("/api/deals", dealActivityRoutes);
app.use("/api/webhook", webhookRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/audit-logs", auditLogRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running...");
});

const PORT = process.env.PORT || 5000;

// Wrap Express in a plain HTTP server so socket.io can attach to the
// same port instead of needing a second server/port.
const httpServer = http.createServer(app);
initSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  // TEMP DEBUG: confirm the deployed Prisma Client actually knows
  // about metaTemplateLanguage. Remove this block once the template
  // creation bug is confirmed fixed.
  try {
    const { Prisma } = require("@prisma/client");
    const templateModel = Prisma.dmmf.datamodel.models.find(
      (m) => m.name === "Template"
    );
    console.log(
      "DEBUG Template model fields:",
      templateModel ? templateModel.fields.map((f) => f.name) : "NOT FOUND"
    );
  } catch (e) {
    console.log("DEBUG Prisma field check failed:", e.message);
  }
});

// Step 6: every 5 minutes, release any WhatsApp conversation that's
// been waiting more than 15 minutes for a company/email reply (leads)
// or a name reply (tickets), so it doesn't get stuck waiting forever
// and just falls back to a human agent picking it up from the
// Conversations tab.
setInterval(() => {
  releaseStalePendingLeads().catch((err) =>
    console.error("Error releasing stale pending leads:", err)
  );
  releaseStalePendingTickets().catch((err) =>
    console.error("Error releasing stale pending tickets:", err)
  );
}, 5 * 60 * 1000);

