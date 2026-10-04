import express from "express";
import {
  addGoal,
  getAllGoals,
  getSingleGoal,
  editGoal,
  removeGoal
} from "../controllers/goalController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create goal
router.post("/", protect, addGoal);

// Get all goals
router.get("/", protect, getAllGoals);

// Get one goal
router.get("/:id", protect, getSingleGoal);

// Update goal
router.put("/:id", protect, editGoal);

// Delete goal
router.delete("/:id", protect, removeGoal);

export default router;