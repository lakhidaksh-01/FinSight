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
  "Other"
];

export const INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Business",
  "Investment",
  "Bonus",
  "Gift",
  "Other"
];

export const ALL_CATEGORIES = [
  ...new Set([
    ...EXPENSE_CATEGORIES,
    ...INCOME_CATEGORIES
  ])
];