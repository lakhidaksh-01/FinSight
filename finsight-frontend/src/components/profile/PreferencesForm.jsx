import { useEffect, useState } from "react";
import Button from "../common/Button";
import Select from "../common/Select";

const CURRENCY_OPTIONS = [
  { value: "INR", label: "Indian Rupee (₹)" },
  { value: "USD", label: "US Dollar ($)" },
  { value: "CAD", label: "Canadian Dollar (C$)" },
  { value: "EUR", label: "Euro (€)" },
  { value: "GBP", label: "British Pound (£)" },
];

const THEME_OPTIONS = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System Default" },
];

function PreferencesForm({
  preferences = {},
  onSubmit,
  loading = false,
}) {
  const [formData, setFormData] = useState({
    currency: "INR",
    theme: "light",
  });

  useEffect(() => {
    setFormData({
      currency: preferences.currency || "INR",
      theme: preferences.theme || "light",
    });
  }, [preferences]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    await onSubmit?.(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="mb-6">
        <h3 className="font-semibold text-slate-900">
          Preferences
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Customize how FinSight displays your financial information.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Select
          label="Currency"
          name="currency"
          value={formData.currency}
          onChange={handleChange}
          options={CURRENCY_OPTIONS}
        />

        <Select
          label="Theme"
          name="theme"
          value={formData.theme}
          onChange={handleChange}
          options={THEME_OPTIONS}
        />
      </div>

      <div className="mt-6 flex justify-end border-t border-slate-200 pt-5">
        <Button type="submit" loading={loading}>
          Save Preferences
        </Button>
      </div>
    </form>
  );
}

export default PreferencesForm;
