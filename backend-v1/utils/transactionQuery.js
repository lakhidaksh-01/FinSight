import { buildPaginatedResult } from "./pagination.js";

const SORTS = {
  newest: { date: -1, _id: -1 },
  oldest: { date: 1, _id: 1 },
  highest: { amount: -1, date: -1, _id: -1 },
  lowest: { amount: 1, date: -1, _id: -1 },
};

const escapeRegex = (value) =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const parseQueryDate = (value, { endOfDay = false } = {}) => {
  const dateOnly = String(value).match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (!dateOnly) {
    return new Date(value);
  }

  return new Date(
    Number(dateOnly[1]),
    Number(dateOnly[2]) - 1,
    Number(dateOnly[3]),
    ...(endOfDay ? [23, 59, 59, 999] : [])
  );
};

export const buildTransactionFilter = (userId, query = {}, { includeNotes = false } = {}) => {
  const filter = { user: userId };

  if (query.category) {
    filter.category = query.category;
  }

  if (query.startDate || query.endDate) {
    filter.date = {};

    if (query.startDate) {
      filter.date.$gte = parseQueryDate(query.startDate);
    }

    if (query.endDate) {
      filter.date.$lte = parseQueryDate(query.endDate, { endOfDay: true });
    }
  }

  if (query.search) {
    const escaped = escapeRegex(query.search.trim());
    const searchableFields = [
      { description: { $regex: escaped, $options: "i" } },
      { category: { $regex: escaped, $options: "i" } },
    ];

    if (includeNotes) {
      searchableFields.push({ notes: { $regex: escaped, $options: "i" } });
    }

    searchableFields.push({
      $expr: {
        $regexMatch: {
          input: { $toString: "$amount" },
          regex: escaped,
          options: "i",
        },
      },
    });

    filter.$or = searchableFields;
  }

  return filter;
};

export const getTransactionSort = (sort) => SORTS[sort] || SORTS.newest;

export const buildTransactionSummary = (facets = {}) => {
  const totals = facets.summary?.[0] || { total: 0, count: 0 };
  const categories = (facets.categories || []).map((item) => ({
    category: item._id || "Other",
    amount: Number(item.amount) || 0,
    count: Number(item.count) || 0,
  }));
  const total = Number(totals.total) || 0;
  const count = Number(totals.count) || 0;

  return {
    total,
    count,
    average: count ? total / count : 0,
    largest: facets.largest?.[0] || null,
    thisMonth: Number(facets.thisMonth?.[0]?.total) || 0,
    categories,
  };
};

export const getTransactionMonthRange = (reference = new Date()) => ({
  start: new Date(reference.getFullYear(), reference.getMonth(), 1),
  end: new Date(reference.getFullYear(), reference.getMonth() + 1, 1),
});

export const getPaginatedTransactions = async (
  Model,
  filter,
  pagination,
  sort
) => {
  const { start, end } = getTransactionMonthRange();
  const [facets] = await Model.aggregate([
    { $match: filter },
    {
      $facet: {
        items: [
          { $sort: sort },
          { $skip: pagination.skip },
          { $limit: pagination.limit },
        ],
        summary: [
          { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
        ],
        largest: [{ $sort: { amount: -1, date: -1, _id: -1 } }, { $limit: 1 }],
        categories: [
          { $group: { _id: "$category", amount: { $sum: "$amount" }, count: { $sum: 1 } } },
          { $sort: { amount: -1, _id: 1 } },
        ],
        thisMonth: [
          { $match: { date: { $gte: start, $lt: end } } },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ],
      },
    },
  ]);
  const summary = buildTransactionSummary(facets);

  return buildPaginatedResult(facets.items, summary.count, pagination, summary);
};

export const getTransactionSorts = () => Object.keys(SORTS);
