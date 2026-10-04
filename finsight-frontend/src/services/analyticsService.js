/*
 * analyticsService
 * ----------------
 * Talks to /api/analytics.
 *
 * Endpoints (backend-v1/services/analyticsService.js):
 *   GET /analytics/dashboard  -> { totalIncome, totalExpenses, savings, savingsRate }
 *   GET /analytics/spending   -> { totalExpenses, categoryTotals: { Food: 1200, ... } }
 *   GET /analytics/savings    -> { income, expenses, savings, savingsRate }
 *
 * All three accept ?startDate= and ?endDate=.
 *
 * Charts need per-month series, category breakdowns and previous-period
 * comparisons that these endpoints do not provide, so the analytics hook
 * requests the raw records and uses utils/calculations.js for those shapes.
 * This service stays a thin, honest wrapper over what the API offers.
 */

import api, { buildQuery, toRangeParams, unwrap } from "./api";

const RESOURCE = "/analytics";

const toParams = ({ dateFrom, dateTo, startDate, endDate } = {}) =>
  buildQuery(toRangeParams({ dateFrom, dateTo, startDate, endDate }));

export const analyticsService = {
  async getDashboard(filters = {}) {
    const response = await api.get(`${RESOURCE}/dashboard`, {
      params: toParams(filters),
    });

    const data = unwrap(response) || {};

    return {
      totalIncome: Number(data.totalIncome) || 0,
      totalExpenses: Number(data.totalExpenses) || 0,
      savings: Number(data.savings) || 0,
      savingsRate: Number(data.savingsRate) || 0,
    };
  },

  /*
   * Returns the raw { totalExpenses, categoryTotals } shape; the hook turns
   * categoryTotals into the [{ category, amount, percentage }] rows the
   * CategoryChart and SpendingChart components render.
   */
  async getSpending(filters = {}) {
    const response = await api.get(`${RESOURCE}/spending`, {
      params: toParams(filters),
    });

    const data = unwrap(response) || {};

    return {
      totalExpenses: Number(data.totalExpenses) || 0,
      categoryTotals: data.categoryTotals || {},
    };
  },

  async getSavings(filters = {}) {
    const response = await api.get(`${RESOURCE}/savings`, {
      params: toParams(filters),
    });

    const data = unwrap(response) || {};

    return {
      income: Number(data.income) || 0,
      expenses: Number(data.expenses) || 0,
      savings: Number(data.savings) || 0,
      savingsRate: Number(data.savingsRate) || 0,
    };
  },

  /*
   * Dashboard needs one call per period to compare months, which is cheaper
   * and more consistent than three separate round trips.
   */
  async getDashboardBundle({ startDate, endDate, previousStartDate, previousEndDate } = {}) {
    const requests = [
      toParams({ startDate, endDate }),
      previousStartDate || previousEndDate
        ? toParams({ startDate: previousStartDate, endDate: previousEndDate })
        : {},
    ];

    const [current, previous] = await Promise.all([
      analyticsService.getDashboard(requests[0]),
      requests[1]
        ? analyticsService.getDashboard(requests[1])
        : Promise.resolve(null),
    ]);

    return { current, previous };
  },
};

export default analyticsService;