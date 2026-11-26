import express from "express";
import {
  addIncome,
  getAllIncome,
  getSingleIncome,
  editIncome,
  removeIncome
} from "../controllers/incomeController.js";
import { protect } from "../middleware/authMiddleware.js";
import { createIncomeValidator, updateIncomeValidator } from "../validators/incomeValidator.js";
import { validate, validateObjectIdParam } from "../middleware/validateMiddleware.js";
import { query } from "express-validator";
import { getTransactionSorts } from "../utils/transactionQuery.js";

const incomeQueryValidator = [
  query("category").optional().trim().isLength({ max: 100 }),
  query("startDate").optional().isISO8601().withMessage("startDate must be valid"),
  query("endDate").optional().isISO8601().withMessage("endDate must be valid"),
  query("search").optional().trim().isLength({ max: 100 }).withMessage("search is too long"),
  query("page").optional().isInt({ min: 1 }).withMessage("page must be positive"),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("limit must be between 1 and 100"),
  query("sort").optional().isIn(getTransactionSorts()).withMessage("sort is not supported")
];

const router = express.Router();

// Add income
router.post("/", protect, createIncomeValidator, validate, addIncome);

// Get all income
router.get("/", protect, incomeQueryValidator, validate, getAllIncome);

// Get one income
router.get("/:id", protect, validateObjectIdParam, validate, getSingleIncome);

// Update income
router.put("/:id", protect, validateObjectIdParam, validate, updateIncomeValidator, validate, editIncome);

// Delete income
router.delete("/:id", protect, validateObjectIdParam, validate, removeIncome);

export default router;