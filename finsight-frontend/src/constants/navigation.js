/*
 * Navigation
 * ------------
 * Navigation model shared by the application layout.
 *
 * The Sidebar and MobileSidebar components own their own visual model, while
 * this file gives pages and routes one place to look up labels and paths.
 */

import { ROUTES } from "./app";

export const NAVIGATION_GROUPS = [
  {
    id: "overview",
    label: "Overview",
    items: [
      { label: "Dashboard", path: ROUTES.DASHBOARD },
      { label: "Expenses", path: ROUTES.EXPENSES },
      { label: "Income", path: ROUTES.INCOME },
      { label: "Budgets", path: ROUTES.BUDGETS },
      { label: "Goals", path: ROUTES.GOALS },
    ],
  },
  {
    id: "intelligence",
    label: "Intelligence",
    items: [
      { label: "Analytics", path: ROUTES.ANALYTICS },
      { label: "Predictions", path: ROUTES.PREDICTIONS },
      { label: "AI Insights", path: ROUTES.AI_INSIGHTS },
    ],
  },
  {
    id: "account",
    label: "Account",
    items: [{ label: "Profile", path: ROUTES.PROFILE }],
  },
];

export const NAVIGATION_ITEMS = NAVIGATION_GROUPS.flatMap(
  (group) => group.items
);

/*
 * Human readable page titles keyed by route.
 * Used by page headers and breadcrumbs.
 */
export const PAGE_META = {
  [ROUTES.DASHBOARD]: {
    title: "Dashboard",
    eyebrow: "Overview",
    description:
      "Your complete financial picture: balance, cash flow, budgets and the insights that matter today.",
    breadcrumbs: [{ label: "Dashboard" }],
  },
  [ROUTES.EXPENSES]: {
    title: "Expenses",
    eyebrow: "Transactions",
    description:
      "Record, filter and review every rupee leaving your account.",
    breadcrumbs: [{ label: "Expenses" }],
  },
  [ROUTES.INCOME]: {
    title: "Income",
    eyebrow: "Transactions",
    description:
      "Track every source of income feeding your financial plan.",
    breadcrumbs: [{ label: "Income" }],
  },
  [ROUTES.BUDGETS]: {
    title: "Budgets",
    eyebrow: "Planning",
    description:
      "Set spending limits per category and stay ahead of the warnings.",
    breadcrumbs: [{ label: "Budgets" }],
  },
  [ROUTES.GOALS]: {
    title: "Goals",
    eyebrow: "Planning",
    description:
      "Turn financial targets into trackable milestones with deadlines.",
    breadcrumbs: [{ label: "Goals" }],
  },
  [ROUTES.ANALYTICS]: {
    title: "Analytics",
    eyebrow: "Intelligence",
    description:
      "Income, expenses, savings and category breakdowns across any period.",
    breadcrumbs: [{ label: "Analytics" }],
  },
  [ROUTES.PREDICTIONS]: {
    title: "Predictions",
    eyebrow: "Intelligence",
    description:
      "Forecast upcoming spending from your own recorded history.",
    breadcrumbs: [{ label: "Predictions" }],
  },
  [ROUTES.AI_INSIGHTS]: {
    title: "AI Insights",
    eyebrow: "Intelligence",
    description:
      "Patterns, anomalies and risk signals detected from your financial activity.",
    breadcrumbs: [{ label: "AI Insights" }],
  },
  [ROUTES.PROFILE]: {
    title: "Profile",
    eyebrow: "Account",
    description:
      "Manage your personal information, preferences and session security.",
    breadcrumbs: [{ label: "Profile" }],
  },
};

/*
 * Quick action shortcuts shown on the dashboard.
 */
export const QUICK_ACTIONS = [
  { label: "Add Expense", path: ROUTES.EXPENSES, state: { openForm: "expense" } },
  { label: "Add Income", path: ROUTES.INCOME, state: { openForm: "income" } },
  { label: "Create Budget", path: ROUTES.BUDGETS, state: { openForm: "budget" } },
  { label: "New Goal", path: ROUTES.GOALS, state: { openForm: "goal" } },
];