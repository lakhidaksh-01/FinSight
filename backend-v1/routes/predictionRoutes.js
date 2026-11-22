import express from "express";
import {
  predictSpending,
  getPredictionHistory,
  getLatest
} from "../controllers/predictionController.js";
import { protect } from "../middleware/authMiddleware.js";
import { body } from "express-validator";
import { validate } from "../middleware/validateMiddleware.js";
import { query } from "express-validator";

const generatePredictionValidator = [
  body("historyMonths").optional().isIn([3, 6, 12]).withMessage("historyMonths must be 3, 6, or 12"),
  body("horizon").optional().isInt({ min: 1, max: 12 }).withMessage("horizon must be between 1 and 12")
];

const predictionHistoryValidator = [
  query("predictionType").optional().trim().isLength({ max: 100 }),
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 100 })
];

const router = express.Router();

// Create spending prediction
router.post("/", protect, generatePredictionValidator, validate, predictSpending);

// Get prediction history
router.get("/", protect, predictionHistoryValidator, validate, getPredictionHistory);

// Get latest prediction
router.get("/latest", protect, getLatest);

export default router;