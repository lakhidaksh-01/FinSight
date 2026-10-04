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

const INITIAL_FORM = {
  description: "",
  amount: "",
  category: "",
  date: toInputDate(new Date()),
  notes: "",
};

function ExpenseForm({
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

    if (!formData.description.trim()) {
      newErrors.description = "Please enter a description.";
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      newErrors.amount = "Enter an amount greater than 0.";
    }

    if (!formData.category) {
      newErrors.category = "Please select a category.";
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

    const expenseData = {
      description: formData.description.trim(),
      amount: Number(formData.amount),
      category: formData.category,
      date: formData.date,
      notes: formData.notes.trim(),
    };

    await onSubmit(expenseData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Main expense information */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Input
          label="Expense Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="e.g. Grocery shopping"
          required
          error={errors.description}
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
          label="Date"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          required
          error={errors.date}
        />
      </div>

      {/* Optional notes */}
      <Input
        label="Notes"
        name="notes"
        value={formData.notes}
        onChange={handleChange}
        placeholder="Add any additional details..."
        textarea
        rows={4}
        helperText="Optional"
      />

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
          {submitLabel || (isEditing ? "Update Expense" : "Add Expense")}
        </Button>
      </div>
    </form>
  );
}

export default ExpenseForm;
