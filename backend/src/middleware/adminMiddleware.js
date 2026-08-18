// Run this AFTER authMiddleware. authMiddleware attaches the decoded
// JWT payload (userId, role) to req.user — this just checks that role.
const adminMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "No token provided" });
  }

  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      message: "Access denied. Admin privileges required.",
    });
  }

  next();
};

module.exports = adminMiddleware;