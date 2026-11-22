import { useEffect, useState } from "react";
import { AlertTriangle, Plus, WalletCards } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Button from "../../components/common/Button";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import ErrorState from "../../components/common/ErrorState";
import MetricCard from "../../components/common/MetricCard";
import Modal from "../../components/common/Modal";
import BudgetCard from "../../components/budgets/BudgetCard";
import BudgetForm from "../../components/budgets/BudgetForm";
import BudgetSummary from "../../components/budgets/BudgetSummary";
import PageHeader from "../../components/layout/PageHeader";
import Breadcrumbs from "../../components/layout/Breadcrumbs";
import { useBudgets } from "../../hooks/useBudgets";
import { formatCurrency } from "../../utils/formatCurrency";

const monthValue = (period) =>
  period.month && period.year
    ? `${String(period.year).padStart(4, "0")}-${String(period.month).padStart(2, "0")}`
    : "";

export default function Budgets() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    budgets,
    period,
    setPeriod,
    loading,
    saving,
    error,
    refresh,
    createBudget,
    updateBudget,
    deleteBudget,
    summary,
  } = useBudgets();
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (location.state?.openForm === "budgets") {
      setEditing(false);
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, location.state, navigate]);

  const changeMonth = (event) => {
    const [year, month] = event.target.value.split("-");
    setPeriod("month", month || "");
    setPeriod("year", year || "");
  };

  const save = async (values) => {
    setFormError("");
    try {
      const budgetMonth = period.month && period.year
        ? `${period.year}-${String(period.month).padStart(2, "0")}-01`
        : values.startDate;
      const payload = { ...values, startDate: budgetMonth };
      if (editing) await updateBudget(editing.id || editing._id, payload);
      else await createBudget(payload);
      setEditing(null);
      toast.success(editing ? "Budget updated" : "Budget created");
    } catch (saveError) {
      setFormError(saveError.message || "Could not save this budget.");
    }
  };

  const remove = async () => {
    try {
      await deleteBudget(deleting.id || deleting._id);
      setDeleting(null);
      toast.success("Budget deleted");
    } catch (deleteError) {
      toast.error(deleteError.message || "Could not delete this budget.");
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Budgets" }]} />
      <PageHeader
        title="Budgets"
        eyebrow="Planning"
        description="Set monthly category limits and see how your actual spending compares."
        action={
          <Button
            icon={Plus}
            onClick={() => setEditing(false)}
            className="bg-[var(--accent)] text-[var(--text-inverse)] hover:bg-[var(--accent-strong)]"
          >
            Create budget
          </Button>
        }
      />

      <div className="flex flex-col gap-3 rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] sm:flex-row sm:items-end sm:justify-between sm:p-6">
        <div>
          <label
            htmlFor="budget-month"
            className="mb-2 block text-xs font-medium text-[var(--text-muted)]"
          >
            Budget month
          </label>
          <input
            id="budget-month"
            type="month"
            value={monthValue(period)}
            onChange={changeMonth}
            className="h-10 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
          />
        </div>
        <button
          type="button"
          onClick={() => {
            setPeriod("month", "");
            setPeriod("year", "");
          }}
          className="h-10 self-start rounded-xl border border-[var(--border-subtle)] px-3 text-sm text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-raised)] sm:self-end"
        >
          All months
        </button>
      </div>

      {!error && <BudgetSummary budgets={budgets} />}

      <div className="grid gap-4 sm:grid-cols-2">
        <MetricCard
          label="Budgeted"
          value={formatCurrency(summary.totalBudgeted)}
          detail={`${summary.count} category limits`}
          icon={WalletCards}
          tone="info"
        />
        <MetricCard
          label="Needs attention"
          value={summary.warnings.length + summary.exceeded.length}
          detail={`${summary.exceeded.length} over limit · ${summary.warnings.length} nearing limit`}
          icon={AlertTriangle}
          tone={summary.exceeded.length ? "danger" : "warning"}
        />
      </div>

      {error && <ErrorState message={error} onRetry={refresh} />}
      {!error && loading && (
        <p className="py-8 text-center text-sm text-[var(--text-muted)]">
          Loading budgets…
        </p>
      )}
      {!error &&
        !loading &&
        budgets.length === 0 && (
          <div className="rounded-3xl border border-dashed border-[var(--border-subtle)] bg-[var(--surface-raised)]/50 px-8 py-16 text-center">
            <Plus size={32} className="mx-auto text-[var(--text-muted)]" />
            <h2 className="mt-4 text-sm font-semibold text-[var(--text-primary)]">
              No budgets for this period
            </h2>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Create a category limit to start tracking monthly spending.
            </p>
            <Button
              onClick={() => setEditing(false)}
              className="mt-6 bg-[var(--accent)] text-[var(--text-inverse)] hover:bg-[var(--accent-strong)]"
            >
              Create budget
            </Button>
          </div>
        )}
      {!error &&
        !loading &&
        budgets.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {budgets.map((budget) => (
              <BudgetCard
                key={budget.id || budget._id}
                budget={budget}
                onEdit={setEditing}
                onDelete={setDeleting}
              />
            ))}
          </div>
        )}

      <Modal
        isOpen={editing !== null}
        onClose={() => {
          setEditing(null);
          setFormError("");
        }}
        title={editing ? "Edit budget" : "Create budget"}
        description="Budgets are stored by category and calendar month."
      >
        {formError && (
          <p role="alert" className="mb-4 rounded-lg border border-[var(--danger)]/20 bg-[var(--danger-soft)] px-3 py-2.5 text-sm text-[var(--danger)]">
            {formError}
          </p>
        )}
        <BudgetForm
          initialData={editing || null}
          onSubmit={save}
          onCancel={() => setEditing(null)}
          loading={saving}
        />
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={remove}
        loading={saving}
        title="Delete this budget?"
        message="This category budget will be permanently removed."
        confirmText="Delete budget"
      />
    </div>
  );
}
