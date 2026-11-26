/*
 * expenseService
 * --------------
 * Talks to /api/expenses and translates between the shape the ExpenseForm
 * component submits and the shape the Expense document stores.
 *
 * API contract (backend-v1/routes/expenseRoutes.js):
 *   GET    /api/expenses        (?category=&startDate=&endDate=)
 *   GET    /api/expenses/:id
 *   POST   /api/expenses        { amount, category, description, date }
 *   PUT    /api/expenses/:id
 *   DELETE /api/expenses/:id
 *   DELETE /api/expenses
 *
 * Notes:
 * - expense notes are persisted by the Expense schema
 * - filtered summaries, search and sorting are handled by the API before
 *   pagination so the list and its KPIs share the same result set
 */

import api, { buildQuery, toApiDate, toRangeParams, unwrap } from "./api";

const RESOURCE = "/expenses";

const toApiPayload = ({ description, amount, category, date, notes }) => {
  const payload = {
    amount: Number(amount) || 0,
    category,
    date: toApiDate(date),
  };

  const text = String(description ?? "").trim();

  if (text) {
    payload.description = text.slice(0, 500);
  }

  const note = String(notes ?? "").trim();

  if (note) {
    payload.notes = note;
  }

  return payload;
};

const fromApiRecord = (record) => {
  if (!record) {
    return null;
  }

  const id = record._id || record.id;

  return {
    ...record,
    id,
    amount: Number(record.amount) || 0,
    notes: record.notes ?? "",
    type: "expense",
  };
};

export const expenseService = {
  /*
   * filters: { search, category, sort, dateFrom, dateTo }
   */
  async getExpenses(filters = {}) {
    const params = buildQuery({
      category:
        filters.category && filters.category !== "all"
          ? filters.category
          : undefined,
      ...toRangeParams(filters),
      search: filters.search,
    });

    const response = await api.get(RESOURCE, { params });

    const data = unwrap(response);
    return (Array.isArray(data) ? data : data?.items || []).map(fromApiRecord);
  },

  async getPaginatedExpenses(filters = {}) {
    const params = buildQuery({
      category:
        filters.category && filters.category !== "all"
          ? filters.category
          : undefined,
      ...toRangeParams(filters),
      search: filters.search,
      sort: filters.sort,
      page: filters.page,
      limit: filters.limit,
    });

    const response = await api.get(RESOURCE, { params });
    const data = unwrap(response);

    return {
      items: (Array.isArray(data) ? data : data?.items || []).map(fromApiRecord),
      pagination: data?.pagination || null,
      summary: data?.summary
        ? {
            ...data.summary,
            total: Number(data.summary.total) || 0,
            count: Number(data.summary.count) || 0,
            average: Number(data.summary.average) || 0,
            thisMonth: Number(data.summary.thisMonth) || 0,
            largest: fromApiRecord(data.summary.largest),
            categories: data.summary.categories || [],
            topCategory: data.summary.categories?.[0] || null,
          }
        : null,
    };
  },

  async getExpense(id) {
    const response = await api.get(`${RESOURCE}/${id}`);

    return fromApiRecord(unwrap(response));
  },

  async createExpense(payload) {
    const response = await api.post(RESOURCE, toApiPayload(payload));
    const record = unwrap(response);

    return fromApiRecord(record);
  },

  async updateExpense(id, payload) {
    const response = await api.put(`${RESOURCE}/${id}`, toApiPayload(payload));
    const record = unwrap(response);

    return fromApiRecord(record);
  },

  async deleteExpense(id) {
    const response = await api.delete(`${RESOURCE}/${id}`);

    return unwrap(response) || { deleted: true, id };
  },

  async deleteAllExpenses() {
    const response = await api.delete(RESOURCE);

    return unwrap(response) || { deleted: true };
  },
};

export default expenseService;