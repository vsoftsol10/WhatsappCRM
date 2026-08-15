const dns = require("dns");
// Render's network doesn't have a working IPv6 route, but Node 17+
// resolves hostnames IPv6-first by default. This breaks outbound
// connections like Gmail SMTP (nodemailer) with ENETUNREACH.
// Forcing IPv4-first resolution for the whole process fixes it.
dns.setDefaultResultOrder("ipv4first");

const express = require("express");
const cors = require("cors");
require("dotenv").config();

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

const {
  releaseStalePendingLeads,
} = require("./helpers/leadEnrichmentHelper");

const {
  releaseStalePendingTickets,
} = require("./helpers/ticketEnrichmentHelper");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
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

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
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