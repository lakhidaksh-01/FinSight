/*
 * budgetService
 * -------------
 * Talks to /api/budgets.
 *
 * The Budget document stores a monthly bucket ({ category, amount, month,
 * year }) while BudgetForm/BudgetCard work with a period and a start date.
 * The service converts between the two so the components stay untouched:
 *
 *   UI  { category, amount, period, startDate }  (month input date)
 *   API { category, amount, month, year }
 *
 * Limitation worth knowing: the schema has no weekly or yearly bucket, so a
 * weekly or yearly budget is stored against the month its start date falls in.
 * `period` is returned to the UI as "monthly", which is what the API can
 * actually enforce, and `spent` is derived from the expense records because
 * the Budget document does not store it.
 */

import { parseDate } from "../utils/formatDate";
import api, { buildQuery, unwrap } from "./api";

const RESOURCE = "/budgets";

const pad = (value) => String(value).padStart(2, "0");

const toApiPayload = ({ category, amount, month, year, startDate }) => {
  const reference = parseDate(startDate) || new Date();

  const payload = {
    category,
    amount: Number(amount) || 0,
    month:
      month !== undefined && month !== null && month !== ""
        ? Number(month)
        : reference.getMonth() + 1,
    year:
      year !== undefined && year !== null && year !== ""
        ? Number(year)
        : reference.getFullYear(),
  };

  return payload;
};

const fromApiRecord = (record) => {
  if (!record) {
    return null;
  }

  const month = Number(record.month) || new Date().getMonth() + 1;
  const year = Number(record.year) || new Date().getFullYear();

  return {
    ...record,
    id: record._id || record.id,
    amount: Number(record.amount) || 0,
    spent: Number(record.spent) || 0,
    period: record.period || "monthly",
    month,
    year,
    startDate: `${year}-${pad(month)}-01`,
  };
};

export const budgetService = {
  /*
   * filters: { month, year } - both optional, the API filters when present.
   */
  async getBudgets(filters = {}) {
    const params = buildQuery({
      month: filters.month ? Number(filters.month) : undefined,
      year: filters.year ? Number(filters.year) : undefined,
    });

    const response = await api.get(RESOURCE, { params });

    return (unwrap(response) || []).map(fromApiRecord);
  },

  async getBudget(id) {
    const response = await api.get(`${RESOURCE}/${id}`);

    return fromApiRecord(unwrap(response));
  },

  async createBudget(payload) {
    const response = await api.post(RESOURCE, toApiPayload(payload));

    return fromApiRecord(unwrap(response));
  },

  async updateBudget(id, payload) {
    const response = await api.put(`${RESOURCE}/${id}`, toApiPayload(payload));

    return fromApiRecord(unwrap(response));
  },

  async deleteBudget(id) {
    const response = await api.delete(`${RESOURCE}/${id}`);

    return unwrap(response) || { deleted: true, id };
  },
};

export default budgetService;