import { useState } from "react";
import Button from "../common/Button";
import Input from "../common/Input";
import Select from "../common/Select";
import { toInputDate } from "../../utils/formatDate";

const CATEGORY_OPTIONS = [
  { value: "Food", label: "Food & Dining" },
  { value: "Transport", label: "Transport" },
  { value: "Shopping", label: "Shopping" },
  { value: "Bills", label: "Bills & Utilities" },
  { value: "Entertainment", label: "Entertainment" },
  { value: "Health", label: "Health & Medical" },
  { value: "Education", label: "Education" },
  { value: "Travel", label: "Travel" },
  { value: "Other", label: "Other" },
];

const PERIOD_OPTIONS = [
  { value: "monthly", label: "Monthly" },
];

const INITIAL_FORM = {
  category: "",
  amount: "",
  period: "monthly",
  startDate: toInputDate(new Date()),
};

function BudgetForm({
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
    startDate: initialData?.startDate ? toInputDate(initialData.startDate) : INITIAL_FORM.startDate,
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

    if (!formData.category) {
      newErrors.category = "Please select a category.";
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      newErrors.amount = "Enter a budget amount greater than 0.";
    }

    if (!formData.period) {
      newErrors.period = "Please select a budget period.";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Please select a start date.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const budgetData = {
      category: formData.category,
      amount: Number(formData.amount),
      period: formData.period,
      startDate: formData.startDate,
    };

    await onSubmit(budgetData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/70 to-purple-50/50 p-4">
        <p className="text-sm font-medium text-slate-800">
          Create a spending limit
        </p>
        <p className="mt-1 text-xs leading-5 text-slate-500">
          Set a monthly category limit. Spending progress is calculated from your expenses.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Select
          label="Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          options={CATEGORY_OPTIONS}
          placeholder="Select category"
          required
          error={errors.category}
        />

        <Input
          label="Budget Amount"
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

        <Select
          label="Budget Period"
          name="period"
          value={formData.period}
          onChange={handleChange}
          options={PERIOD_OPTIONS}
          required
          error={errors.period}
        />

        <Input
          label="Budget Month"
          name="startDate"
          type="date"
          value={formData.startDate}
          onChange={handleChange}
          required
          error={errors.startDate}
        />
      </div>

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
          {submitLabel || (isEditing ? "Update Budget" : "Create Budget")}
        </Button>
      </div>
    </form>
  );
}

export default BudgetForm;
