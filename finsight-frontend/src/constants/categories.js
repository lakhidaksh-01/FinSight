/*
 * Categories
 * ----------
 * Single source of truth for the category values that are stored in the
 * backend. The lists mirror backend-v1/constants/categories.js while the
 * label maps mirror the option lists already used by the UI components
 * (ExpenseForm, IncomeForm, BudgetForm and GoalForm), so filters, forms
 * and charts always agree.
 */

/*
 * Expense categories accepted by the API.
 */
export const EXPENSE_CATEGORIES = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Health",
  "Education",
  "Travel",
  "Subscriptions",
  "Personal",
  "Other",
];

/*
 * Friendly labels used by selects, tables and legends.
 */
export const EXPENSE_CATEGORY_LABELS = {
  Food: "Food & Dining",
  Transport: "Transport",
  Shopping: "Shopping",
  Bills: "Bills & Utilities",
  Entertainment: "Entertainment",
  Health: "Health & Medical",
  Education: "Education",
  Travel: "Travel",
  Subscriptions: "Subscriptions",
  Personal: "Personal Care",
  Other: "Other",
};

/*
 * Category options for selects.
 * "all" is only meaningful for filters, so it lives in its own list.
 */
export const EXPENSE_CATEGORY_OPTIONS = EXPENSE_CATEGORIES.map((value) => ({
  value,
  label: EXPENSE_CATEGORY_LABELS[value] || value,
}));

export const EXPENSE_FILTER_CATEGORY_OPTIONS = [
  { value: "all", label: "All Categories" },
  ...EXPENSE_CATEGORY_OPTIONS,
];

/*
 * Income sources stored in the API `category` field of an income record.
 */
export const INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Business",
  "Investment",
  "Bonus",
  "Gift",
  "Other",
];

export const INCOME_CATEGORY_LABELS = {
  Salary: "Salary",
  Freelance: "Freelance",
  Business: "Business",
  Investment: "Investment",
  Bonus: "Bonus",
  Gift: "Gift",
  Other: "Other",
};

export const INCOME_CATEGORY_OPTIONS = INCOME_CATEGORIES.map((value) => ({
  value,
  label: INCOME_CATEGORY_LABELS[value] || value,
}));

export const INCOME_FILTER_CATEGORY_OPTIONS = [
  { value: "all", label: "All Sources" },
  ...INCOME_CATEGORY_OPTIONS,
];

/*
 * Budgets reuse the expense categories.
 */
export const BUDGET_CATEGORIES = EXPENSE_CATEGORIES;

export const BUDGET_CATEGORY_OPTIONS = EXPENSE_CATEGORY_OPTIONS;

/*
 * Goal categories are presentation-only: the Goal document stores
 * name/target/current/date, so the selected goal category is kept in the
 * local record and defaults to "Savings" when it is not returned.
 */
export const GOAL_CATEGORIES = [
  "Savings",
  "Travel",
  "Education",
  "Emergency",
  "Investment",
  "Purchase",
  "Other",
];

export const GOAL_CATEGORY_LABELS = {
  Savings: "Savings",
  Travel: "Travel",
  Education: "Education",
  Emergency: "Emergency Fund",
  Investment: "Investment",
  Purchase: "Major Purchase",
  Other: "Other",
};

export const GOAL_CATEGORY_OPTIONS = GOAL_CATEGORIES.map((value) => ({
  value,
  label: GOAL_CATEGORY_LABELS[value] || value,
}));

export const BUDGET_PERIOD_OPTIONS = [
  { value: "monthly", label: "Monthly" },
  { value: "weekly", label: "Weekly" },
  { value: "yearly", label: "Yearly" },
];

/*
 * Helpers
 */
export const getCategoryLabel = (category) =>
  EXPENSE_CATEGORY_LABELS[category] ||
  INCOME_CATEGORY_LABELS[category] ||
  GOAL_CATEGORY_LABELS[category] ||
  category ||
  "Other";

export const toSelectOptions = (values, labels = {}) =>
  (values || []).map((value) => ({
    value,
    label: labels[value] || value,
  }));