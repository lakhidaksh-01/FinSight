export const getStartOfDay = (date = new Date()) => {
  const result = new Date(date);

  result.setHours(0, 0, 0, 0);

  return result;
};

export const getEndOfDay = (date = new Date()) => {
  const result = new Date(date);

  result.setHours(23, 59, 59, 999);

  return result;
};

export const getStartOfMonth = (
  date = new Date()
) => {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    1
  );
};

export const getEndOfMonth = (
  date = new Date()
) => {
  return new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  );
};

export const getMonthRange = (
  year,
  month
) => {
  const startDate = new Date(
    year,
    month - 1,
    1
  );

  const endDate = new Date(
    year,
    month,
    0,
    23,
    59,
    59,
    999
  );

  return {
    startDate,
    endDate
  };
};