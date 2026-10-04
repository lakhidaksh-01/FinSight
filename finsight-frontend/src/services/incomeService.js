/*
 * incomeService
 * -------------
 * Talks to /api/income.
 *
 * The Income document stores the source of money in its `category` field,
 * while every income component (IncomeForm, IncomeFilters, IncomeTable,
 * IncomeCard) calls it `source`. The mapping happens here so components stay
 * untouched and the round trip is lossless.
 *
 * API contract (backend-v1/routes/incomeRoutes.js):
 *   GET    /api/income         (?category=&startDate=&endDate=)
 *   GET    /api/income/:id
 *   POST   /api/income         { amount, category, description, date }
 *   PUT    /api/income/:id
 *   DELETE /api/income/:id
 */

import api, { buildQuery, toApiDate, toRangeParams, unwrap } from "./api";

const RESOURCE = "/income";

const toApiPayload = ({ source, category, amount, date, description }) => {
  const payload = {
    amount: Number(amount) || 0,
    category: source || category,
    date: toApiDate(date),
  };

  const text = String(description ?? "").trim();

  if (text) {
    payload.description = text.slice(0, 500);
  }

  return payload;
};

const fromApiRecord = (record) => {
  if (!record) {
    return null;
  }

  return {
    ...record,
    id: record._id || record.id,
    amount: Number(record.amount) || 0,
    source: record.source || record.category || "Other",
    type: "income",
  };
};

export const incomeService = {
  async getIncomes(filters = {}) {
    const params = buildQuery({
      category:
        filters.source && filters.source !== "all"
          ? filters.source
          : filters.category && filters.category !== "all"
            ? filters.category
            : undefined,
      ...toRangeParams(filters),
    });

    const response = await api.get(RESOURCE, { params });

    return (unwrap(response) || []).map(fromApiRecord);
  },

  async getIncome(id) {
    const response = await api.get(`${RESOURCE}/${id}`);

    return fromApiRecord(unwrap(response));
  },

  async createIncome(payload) {
    const response = await api.post(RESOURCE, toApiPayload(payload));

    return fromApiRecord(unwrap(response));
  },

  async updateIncome(id, payload) {
    const response = await api.put(`${RESOURCE}/${id}`, toApiPayload(payload));

    return fromApiRecord(unwrap(response));
  },

  async deleteIncome(id) {
    const response = await api.delete(`${RESOURCE}/${id}`);

    return unwrap(response) || { deleted: true, id };
  },
};

export default incomeService;