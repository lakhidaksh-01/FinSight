/*
 * formatCurrency
 * --------------
 * Money formatting used by every card, table and chart tooltip.
 *
 * Components call it as formatCurrency(amount) so the currency falls back to
 * the preference stored on the user profile, then to INR.
 */

import { CURRENCIES, DEFAULT_CURRENCY } from "../constants/app";
import { getPreferences } from "./storage";

const CURRENCY_MAP = CURRENCIES.reduce((map, item) => {
  map[item.value] = item;

  return map;
}, {});

/*
 * Resolve the currency currently preferred by the user.
 */
export const getActiveCurrency = () => {
  const preferences = getPreferences();
  const currency = preferences?.currency;

  return CURRENCY_MAP[currency] ? currency : DEFAULT_CURRENCY;
};

export const getCurrencySymbol = (currency) =>
  CURRENCY_MAP[currency]?.symbol || CURRENCY_MAP[DEFAULT_CURRENCY].symbol;

const getLocale = (currency) =>
  CURRENCY_MAP[currency]?.locale || "en-IN";

/*
 * formatCurrency(4500)
 *   -> "Rs 4,500"
 *
 * formatCurrency(4500.5, "USD")
 *   -> "$4,500.50"
 *
 * formatCurrency(4500, "INR", { compact: true })
 *   -> "Rs 4.5K"
 */
export const formatCurrency = (
  value,
  currency,
  { compact = false, showSign = false, maxFractions = 2 } = {}
) => {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "\u20B90";
  }

  const resolvedCurrency =
    currency && CURRENCY_MAP[currency] ? currency : getActiveCurrency();

  const isNegative = amount < 0;
  const absolute = Math.abs(amount);

  let formatted;

  try {
    formatted = new Intl.NumberFormat(getLocale(resolvedCurrency), {
      style: "currency",
      currency: resolvedCurrency,
      notation: compact ? "compact" : "standard",
      maximumFractionDigits: compact ? 1 : maxFractions,
      minimumFractionDigits: 0,
    }).format(absolute);
  } catch (error) {
    // Unknown currency code: fall back to a plain symbol prefix.
    formatted = `${getCurrencySymbol(resolvedCurrency)}${absolute.toLocaleString(
      "en-IN"
    )}`;
  }

  const sign = isNegative ? "-" : showSign && absolute > 0 ? "+" : "";

  return `${sign}${formatted}`;
};

/*
 * Compact version used inside charts and tight cards.
 */
export const formatCompactCurrency = (value, currency) =>
  formatCurrency(value, currency, { compact: true });

/*
 * Plain number with grouping (no currency symbol).
 */
export const formatAmount = (value) => {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "0";
  }

  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatPercentage = (value, fractions = 1) => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "0%";
  }

  return `${number.toFixed(fractions)}%`;
};

export const formatSignedPercentage = (value, fractions = 1) => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "0%";
  }

  return `${number >= 0 ? "+" : ""}${number.toFixed(fractions)}%`;
};

export default formatCurrency;