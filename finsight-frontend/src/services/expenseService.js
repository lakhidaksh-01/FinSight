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
 * - the Expense schema has no `notes` field, so notes travel with the request
 *   (harmless, Mongoose ignores unknown paths) and are kept locally for the
 *   current session so the UI keeps showing what the user typed
 * - search and sorting are applied by the hook because the API only filters
 *   on category and date range
 */

import api, { buildQuery, toApiDate, toRangeParams, unwrap } from "./api";

const RESOURCE = "/expenses";

/*
 * Expense documents keep their own notes in this WeakMap-free cache so the
 * table can render them until the backend persists the field.
 */
const localNotes = new Map();

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
    notes: record.notes ?? localNotes.get(id) ?? "",
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
    });

    const response = await api.get(RESOURCE, { params });

    return (unwrap(response) || []).map(fromApiRecord);
  },

  async getExpense(id) {
    const response = await api.get(`${RESOURCE}/${id}`);

    return fromApiRecord(unwrap(response));
  },

  async createExpense(payload) {
    const response = await api.post(RESOURCE, toApiPayload(payload));
    const record = unwrap(response);

    if (record?._id && payload.notes) {
      localNotes.set(record._id, String(payload.notes).trim());
    }

    return fromApiRecord(record);
  },

  async updateExpense(id, payload) {
    const response = await api.put(`${RESOURCE}/${id}`, toApiPayload(payload));
    const record = unwrap(response);

    if (payload.notes !== undefined) {
      localNotes.set(id, String(payload.notes).trim());
    }

    return fromApiRecord(record);
  },

  async deleteExpense(id) {
    localNotes.delete(id);

    const response = await api.delete(`${RESOURCE}/${id}`);

    return unwrap(response) || { deleted: true, id };
  },

  async deleteAllExpenses() {
    localNotes.clear();

    const response = await api.delete(RESOURCE);

    return unwrap(response) || { deleted: true };
  },
};

export default expenseService;