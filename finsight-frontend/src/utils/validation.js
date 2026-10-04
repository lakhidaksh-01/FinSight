/*
 * validation
 * ----------
 * Client-side rules that mirror the backend validators
 * (backend-v1/validators/*) so a form never sends a request the API is
 * guaranteed to reject.
 *
 * Each rule returns an error message string, or null when the value is fine.
 */

export const REQUIRED_MESSAGE = "This field is required";

export const validateRequired = (value, label = "This field") => {
  const text = String(value ?? "").trim();

  return text ? null : `${label} is required`;
};

export const validateEmail = (value) => {
  const email = String(value ?? "").trim();

  if (!email) {
    return "Email is required";
  }

  // Same expectation as express-validator isEmail() for everyday addresses.
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  return pattern.test(email) ? null : "Please provide a valid email";
};

/*
 * User.password minlength is 6.
 */
export const validatePassword = (value, { required = true } = {}) => {
  const password = String(value ?? "");

  if (!password) {
    return required ? "Password is required" : null;
  }

  return password.length >= 6
    ? null
    : "Password must be at least 6 characters long";
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) {
    return "Please confirm your password";
  }

  return password === confirmPassword
    ? null
    : "Passwords do not match";
};

/*
 * Password strength meter used by the register screen.
 */
export const getPasswordStrength = (value) => {
  const password = String(value ?? "");

  if (!password) {
    return { score: 0, label: "Empty", percent: 0 };
  }

  let score = 0;

  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  const labels = ["Empty", "Weak", "Fair", "Good", "Strong", "Excellent"];

  return {
    score,
    label: labels[score],
    percent: (score / 5) * 100,
  };
};

/*
 * Amount validators (API expects a float >= 0.01).
 */
export const validateAmount = (value, { label = "Amount", min = 0.01 } = {}) => {
  const raw = String(value ?? "").trim();

  if (!raw) {
    return `${label} is required`;
  }

  const amount = Number(raw);

  if (!Number.isFinite(amount)) {
    return `${label} must be a number`;
  }

  return amount >= min
    ? null
    : `${label} must be greater than ${min}`;
};

export const validateOptionalAmount = (value, { label = "Amount" } = {}) => {
  const raw = String(value ?? "").trim();

  if (!raw) {
    return null;
  }

  const amount = Number(raw);

  if (!Number.isFinite(amount)) {
    return `${label} must be a number`;
  }

  return amount >= 0 ? null : `${label} cannot be negative`;
};

/*
 * OTP: exactly 6 digits (verifyOtpValidator).
 */
export const validateOtp = (value) => {
  const otp = String(value ?? "").trim();

  if (!otp) {
    return "OTP is required";
  }

  return /^\d{6}$/.test(otp)
    ? null
    : "OTP must be a 6-digit number";
};

/*
 * Free text length (description/notes are capped at 500 characters).
 */
export const validateMaxLength = (value, max, label = "This field") => {
  const text = String(value ?? "").trim();

  return text.length > max
    ? `${label} cannot exceed ${max} characters`
    : null;
};

export const validateDate = (value, { label = "Date", required = true } = {}) => {
  if (!value) {
    return required ? `${label} is required` : null;
  }

  return Number.isNaN(new Date(value).getTime())
    ? `${label} must be valid`
    : null;
};

export const validatePhone = (value) => {
  const phone = String(value ?? "").trim();

  if (!phone) {
    return null;
  }

  return /^[+\d][\d\s()-]{6,19}$/.test(phone)
    ? null
    : "Please provide a valid phone number";
};

/*
 * runValidations({ field: [rule, rule] }, values)
 *
 * Runs every rule and returns only the fields that failed, which maps
 * directly onto the `error` prop of the Input and Select components.
 */
export const runValidations = (schema, values) => {
  const errors = {};

  Object.entries(schema).forEach(([field, rules]) => {
    const ruleList = Array.isArray(rules) ? rules : [rules];

    for (const rule of ruleList) {
      const message = rule(values?.[field], values);

      if (message) {
        errors[field] = message;
        break;
      }
    }
  });

  return errors;
};

export const hasErrors = (errors) =>
  Object.values(errors || {}).some(Boolean);

/*
 * Turns the `errors` array produced by express-validator
 * ({ field, message }) into the shape Input/Select expect.
 */
export const fromApiValidationErrors = (errors = []) =>
  errors.reduce((acc, error) => {
    const field = error?.field || error?.param;

    if (field && !acc[field]) {
      acc[field] = error?.msg || error?.message || "Invalid value";
    }

    return acc;
  }, {});

/*
 * Shared schemas for the authentication screens.
 */
export const loginSchema = {
  email: [validateEmail],
  password: [(value) => validatePassword(value, { required: true })],
};

export const registerSchema = {
  name: [(value) => validateRequired(value, "Name")],
  email: [validateEmail],
  password: [(value) => validatePassword(value, { required: true })],
  confirmPassword: [
    (value, values) => validateConfirmPassword(values?.password, value),
  ],
};

export const forgotPasswordSchema = {
  email: [validateEmail],
};

export const verifyOtpSchema = {
  email: [validateEmail],
  otp: [validateOtp],
};

export const resetPasswordSchema = {
  password: [(value) => validatePassword(value, { required: true })],
  confirmPassword: [
    (value, values) => validateConfirmPassword(values?.password, value),
  ],
};

export const profileSchema = {
  name: [
    (value) => validateRequired(value, "Name"),
    (value) => validateMaxLength(value, 100, "Name"),
  ],
  email: [validateEmail],
  phone: [validatePhone],
};