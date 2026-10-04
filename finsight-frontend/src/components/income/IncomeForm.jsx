import { useState } from "react";
import Button from "../common/Button";
import Input from "../common/Input";
import Select from "../common/Select";
import { toInputDate } from "../../utils/formatDate";

const SOURCE_OPTIONS = [
  { value: "Salary", label: "Salary" },
  { value: "Freelance", label: "Freelance" },
  { value: "Business", label: "Business" },
  { value: "Investment", label: "Investment" },
  { value: "Bonus", label: "Bonus" },
  { value: "Gift", label: "Gift" },
  { value: "Other", label: "Other" },
];

const INITIAL_FORM = {
  source: "",
  amount: "",
  date: toInputDate(new Date()),
  description: "",
};

function IncomeForm({
  initialData = null,
  onSubmit,
  onCancel,
  loading = false,
  submitLabel,
}) {
  const isEditing = Boolean(initialData);

  const [formData, setFormData] = useState({
    ...INITIAL_FORM,
    ...(initialData || {}),
    date: initialData?.date ? toInputDate(initialData.date) : INITIAL_FORM.date,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((previous) => ({
        ...previous,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.source) {
      newErrors.source = "Please select an income source.";
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      newErrors.amount = "Enter an amount greater than 0.";
    }

    if (!formData.date) {
      newErrors.date = "Please select a date.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const incomeData = {
      source: formData.source,
      amount: Number(formData.amount),
      date: formData.date,
      description: formData.description.trim(),
    };

    await onSubmit(incomeData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Main income information */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Select
          label="Income Source"
          name="source"
          value={formData.source}
          onChange={handleChange}
          options={SOURCE_OPTIONS}
          placeholder="Select source"
          required
          error={errors.source}
        />

        <Input
          label="Amount"
          name="amount"
          type="number"
          value={formData.amount}
          onChange={handleChange}
          placeholder="0.00"
          min="0"
          step="0.01"
          required
          error={errors.amount}
        />

        <Input
          label="Date"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          required
          error={errors.date}
        />

        <Input
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="e.g. Monthly salary"
          helperText="Optional"
        />
      </div>

      {/* Form actions */}
      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
        )}

        <Button type="submit" loading={loading}>
          {submitLabel || (isEditing ? "Update Income" : "Add Income")}
        </Button>
      </div>
    </form>
  );
}

export default IncomeForm;
