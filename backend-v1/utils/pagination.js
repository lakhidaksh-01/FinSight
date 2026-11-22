export const getPagination = (query = {}) => {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, Number.parseInt(query.limit, 10) || 20));

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
};

export const buildPaginatedResult = (items, total, pagination) => ({
  items,
  pagination: {
    page: pagination.page,
    limit: pagination.limit,
    total,
    pages: Math.ceil(total / pagination.limit),
  },
});
