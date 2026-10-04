/*
 * formatDate
 * ----------
 * Date helpers shared by tables, cards and charts.
 *
 * Every API document stores dates as ISO strings while the forms submit
 * "YYYY-MM-DD" values, so parsing is centralised here.
 */

const EMPTY = "-";

/*
 * Parse anything the API or a date input produced into a Date.
 * "YYYY-MM-DD" is treated as a local calendar day (not UTC) so a date never
 * shifts by a day when the browser sits behind Greenwich.
 */
export const parseDate = (value) => {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === "string") {
    const dateOnly = value.match(/^(\d{4})-(\d{2})-(\d{2})/);

    if (dateOnly) {
      const [, year, month, day] = dateOnly;
      const local = new Date(
        Number(year),
        Number(month) - 1,
        Number(day)
      );

      return Number.isNaN(local.getTime()) ? null : local;
    }
  }

  const parsed = new Date(value);

  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const formatDate = (value, options = {}) => {
  const date = parseDate(value);

  if (!date) {
    return EMPTY;
  }

  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      ...options,
    }).format(date);
  } catch (error) {
    return date.toDateString();
  }
};

/*
 * "12 Mar" - used by dense lists and chart tooltips.
 */
export const formatDateShort = (value) =>
  formatDate(value, { day: "2-digit", month: "short", year: undefined });

/*
 * "March 2026" - used by period selectors and monthly buckets.
 */
export const formatMonthYear = (value) => {
  const date = parseDate(value);

  if (!date) {
    return EMPTY;
  }

  return new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
  }).format(date);
};

/*
 * "Mar 26" - compact axis labels.
 */
export const formatMonthShort = (value) => {
  const date = parseDate(value);

  if (!date) {
    return EMPTY;
  }

  return new Intl.DateTimeFormat("en-GB", {
    month: "short",
    year: "2-digit",
  }).format(date);
};

export const formatDateTime = (value) => {
  const date = parseDate(value);

  if (!date) {
    return EMPTY;
  }

  return `${formatDate(date)} \u00B7 ${new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)}`;
};

/*
 * "YYYY-MM-DD" for <input type="date">.
 */
export const toInputDate = (value) => {
  const date = parseDate(value) || new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

/*
 * "YYYY-MM" bucket key used to group records into months.
 */
export const toMonthKey = (value) => {
  const date = parseDate(value);

  if (!date) {
    return "";
  }

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
};

/*
 * ISO string for a date-only value, ready for the API's ISO 8601 validator.
 */
export const toIsoDate = (value) => {
  const date = parseDate(value);

  return date ? date.toISOString() : new Date().toISOString();
};

export const isSameMonth = (value, reference = new Date()) => {
  const date = parseDate(value);
  const base = parseDate(reference);

  if (!date || !base) {
    return false;
  }

  return (
    date.getFullYear() === base.getFullYear() &&
    date.getMonth() === base.getMonth()
  );
};

export const isToday = (value) => {
  const date = parseDate(value);
  const today = new Date();

  if (!date) {
    return false;
  }

  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
};

/*
 * Positive number of days left until a deadline (0 when overdue).
 */
export const daysUntil = (value) => {
  const date = parseDate(value);

  if (!date) {
    return null;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(date);
  target.setHours(0, 0, 0, 0);

  return Math.round((target - today) / 86400000);
};

export const getRelativeLabel = (value) => {
  const days = daysUntil(value);

  if (days === null) {
    return EMPTY;
  }

  if (days === 0) {
    return "Due today";
  }

  if (days > 0) {
    return `Due in ${days} day${days === 1 ? "" : "s"}`;
  }

  const overdue = Math.abs(days);

  return `${overdue} day${overdue === 1 ? "" : "s"} overdue`;
};

export default formatDate;