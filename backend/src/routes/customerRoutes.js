const express = require("express");
const router = express.Router();
const multer = require("multer");

const { 
  createCustomer, 
  getCustomers, 
  getCustomerById, 
  updateCustomer,
  deleteCustomer,
  previewBulkImport,
  confirmBulkImport,
 } = require("../controllers/customerController");

const authMiddleware = require("../middleware/authMiddleware");

// Separate multer instance from the image-upload one in
// uploadMiddleware.js — that one's fileFilter only allows
// jpeg/png/webp (for Cloudinary), which would reject every CSV/XLSX
// import file. Bulk import needs its own filter and a larger size
// limit, since a 5,000-row spreadsheet is bigger than a photo.
const bulkImportUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (
      allowedTypes.includes(file.mimetype) ||
      /\.(csv|xlsx|xls)$/i.test(file.originalname)
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only CSV and Excel (.xlsx/.xls) files are allowed."), false);
    }
  },
});

// Wraps bulkImportUpload.single(...) so a multer error (wrong file
// type, file too large) returns a clean JSON response instead of
// falling through to Express's default HTML error page — this app
// doesn't have a global error-handling middleware, so without this
// wrapper a rejected file type would crash the request instead of
// giving the frontend something to show the user.
const handleBulkImportFile = (req, res, next) => {
  bulkImportUpload.single("file")(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message:
          err.code === "LIMIT_FILE_SIZE"
            ? "File is too large (10 MB max)."
            : err.message || "Could not process the uploaded file.",
      });
    }

    next();
  });
};

router.post("/", authMiddleware, createCustomer);

// Must come before "/:id" — otherwise Express matches "bulk-import" as
// an :id param and these routes are never reached.
router.post(
  "/bulk-import/preview",
  authMiddleware,
  handleBulkImportFile,
  previewBulkImport
);

router.post("/bulk-import/confirm", authMiddleware, confirmBulkImport);

router.get("/", authMiddleware, getCustomers);

router.get("/:id", authMiddleware, getCustomerById);

router.put("/:id", authMiddleware, updateCustomer);

router.delete("/:id", authMiddleware, deleteCustomer);

module.exports = router;