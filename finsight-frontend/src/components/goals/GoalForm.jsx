import { useState } from "react";
import Button from "../common/Button";
import Input from "../common/Input";
import Select from "../common/Select";
import { toInputDate } from "../../utils/formatDate";

const CATEGORY_OPTIONS = [
  { value: "Savings", label: "Savings" },
  { value: "Travel", label: "Travel" },
  { value: "Education", label: "Education" },
  { value: "Emergency", label: "Emergency Fund" },
  { value: "Investment", label: "Investment" },
  { value: "Purchase", label: "Major Purchase" },
  { value: "Other", label: "Other" },
];

const INITIAL_FORM = {
  name: "",
  targetAmount: "",
  currentAmount: "",
  deadline: "",
  category: "Savings",
  description: "",
};

function GoalForm({
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
    deadline: initialData?.deadline ? toInputDate(initialData.deadline) : "",
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

    if (!formData.name.trim()) {
      newErrors.name = "Please enter a goal name.";
    }

    if (
      !formData.targetAmount ||
      Number(formData.targetAmount) <= 0
    ) {
      newErrors.targetAmount =
        "Enter a target amount greater than 0.";
    }

    if (
      formData.currentAmount !== "" &&
      Number(formData.currentAmount) < 0
    ) {
      newErrors.currentAmount =
        "Current amount cannot be negative.";
    }

    if (formData.deadline) {
      const deadline = new Date(formData.deadline);
      if (Number.isNaN(deadline.getTime())) {
        newErrors.deadline = "Please enter a valid deadline.";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const goalData = {
      name: formData.name.trim(),
      targetAmount: Number(formData.targetAmount),
      currentAmount: Number(formData.currentAmount || 0),
      deadline: formData.deadline || null,
      category: formData.category,
      description: formData.description.trim(),
    };

    await onSubmit(goalData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-2xl border border-purple-100 bg-gradient-to-br from-blue-50/70 to-purple-50/50 p-4">
        <p className="text-sm font-medium text-slate-800">
          Turn a financial target into a trackable goal.
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          Add a target amount and optionally a deadline to monitor your
          progress over time.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Input
          label="Goal Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. Emergency Fund"
          required
          error={errors.name}
        />

        <Select
          label="Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          options={CATEGORY_OPTIONS}
          required
        />

        <Input
          label="Target Amount"
          name="targetAmount"
          type="number"
          value={formData.targetAmount}
          onChange={handleChange}
          placeholder="0.00"
          min="0"
          step="0.01"
          required
          error={errors.targetAmount}
        />

        <Input
          label="Current Amount"
          name="currentAmount"
          type="number"
          value={formData.currentAmount}
          onChange={handleChange}
          placeholder="0.00"
          min="0"
          step="0.01"
          error={errors.currentAmount}
        />

        <Input
          label="Deadline"
          name="deadline"
          type="date"
          value={formData.deadline || ""}
          onChange={handleChange}
          error={errors.deadline}
        />

        <Input
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="What are you saving for?"
          helperText="Optional"
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
          {submitLabel || (isEditing ? "Update Goal" : "Create Goal")}
        </Button>
      </div>
    </form>
  );
}

export default GoalForm;
