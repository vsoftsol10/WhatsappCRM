// const express = require("express");
// const router = express.Router();

// const {
//   createTask,
//   getTasks,
//   getTaskById,
//   updateTask,
//   deleteTask,
//   updateTaskStatus,
// } = require("../controllers/taskController");

// const authMiddleware = require("../middleware/authMiddleware");

// router.post("/", authMiddleware, createTask);

// router.get("/", authMiddleware, getTasks);

// router.get("/:id", authMiddleware, getTaskById);

// router.put("/:id", authMiddleware, updateTask);

// router.delete("/:id", authMiddleware, deleteTask);

// router.patch("/:id/status", authMiddleware, updateTaskStatus);

// module.exports = router;

const express = require("express");
const router = express.Router();

const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus,
} = require("../controllers/taskController");

const {
  getTaskWorkNotes,
  createTaskWorkNote,
  updateTaskWorkNote,
  deleteTaskWorkNote,
} = require("../controllers/taskWorkNoteController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, createTask);

router.get("/", authMiddleware, getTasks);

router.get("/:id", authMiddleware, getTaskById);

router.put("/:id", authMiddleware, updateTask);

router.delete("/:id", authMiddleware, deleteTask);

router.patch("/:id/status", authMiddleware, updateTaskStatus);

// ================= WORK NOTES =================

router.get("/:id/work-notes", authMiddleware, getTaskWorkNotes);

router.post("/:id/work-notes", authMiddleware, createTaskWorkNote);

router.put("/work-notes/:noteId", authMiddleware, updateTaskWorkNote);

router.delete("/work-notes/:noteId", authMiddleware, deleteTaskWorkNote);

module.exports = router;