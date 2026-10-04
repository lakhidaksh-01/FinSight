import express from "express";
import {
  predictSpending,
  getPredictionHistory,
  getLatest
} from "../controllers/predictionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create spending prediction
router.post("/", protect, predictSpending);

// Get prediction history
router.get("/", protect, getPredictionHistory);

// Get latest prediction
router.get("/latest", protect, getLatest);

export default router;