import express from "express";
import {
  getMyProfile,
  updateMyProfile
} from "../controllers/profileController.js";
import { protect } from "../middleware/authMiddleware.js";
import { updateProfileValidator } from "../validators/profileValidator.js";
import { validate } from "../middleware/validateMiddleware.js";

const router = express.Router();

// Get current user's profile
router.get("/", protect, getMyProfile);

// Update current user's profile
router.put("/", protect, updateProfileValidator, validate, updateMyProfile);

export default router;