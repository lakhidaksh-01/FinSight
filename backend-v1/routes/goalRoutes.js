import express from "express";
import {
  addGoal,
  getAllGoals,
  getSingleGoal,
  editGoal,
  removeGoal
} from "../controllers/goalController.js";
import { protect } from "../middleware/authMiddleware.js";
import { createGoalValidator, updateGoalValidator } from "../validators/goalValidator.js";
import { validate, validateObjectIdParam } from "../middleware/validateMiddleware.js";
import { query } from "express-validator";

const goalQueryValidator = [
  query("search").optional().trim().isLength({ max: 100 }),
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 100 })
];

const router = express.Router();

// Create goal
router.post("/", protect, createGoalValidator, validate, addGoal);

// Get all goals
router.get("/", protect, goalQueryValidator, validate, getAllGoals);

// Get one goal
router.get("/:id", protect, validateObjectIdParam, validate, getSingleGoal);

// Update goal
router.put("/:id", protect, validateObjectIdParam, validate, updateGoalValidator, validate, editGoal);

// Delete goal
router.delete("/:id", protect, validateObjectIdParam, validate, removeGoal);

export default router;