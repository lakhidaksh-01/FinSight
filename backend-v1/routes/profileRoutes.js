import express from "express";
import {
  getMyProfile,
  updateMyProfile
} from "../controllers/profileController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get current user's profile
router.get("/", protect, getMyProfile);

// Update current user's profile
router.put("/", protect, updateMyProfile);

export default router;