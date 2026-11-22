import { useEffect, useState } from "react";
import { CheckCircle2, Plus, Target, TriangleAlert } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Button from "../../components/common/Button";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import ErrorState from "../../components/common/ErrorState";
import MetricCard from "../../components/common/MetricCard";
import Modal from "../../components/common/Modal";
import GoalCard from "../../components/goals/GoalCard";
import GoalForm from "../../components/goals/GoalForm";
import PageHeader from "../../components/layout/PageHeader";
import Breadcrumbs from "../../components/layout/Breadcrumbs";
import { useGoals } from "../../hooks/useGoals";
import { formatCurrency } from "../../utils/formatCurrency";

export default function Goals() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    goals,
    loading,
    saving,
    error,
    refresh,
    createGoal,
    updateGoal,
    deleteGoal,
    summary,
  } = useGoals();
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (location.state?.openForm === "goals") {
      setEditing(false);
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, location.state, navigate]);

  const save = async (values) => {
    setFormError("");
    try {
      if (editing) await updateGoal(editing.id || editing._id, values);
      else await createGoal(values);
      setEditing(null);
      toast.success(editing ? "Goal updated" : "Goal created");
    } catch (saveError) {
      setFormError(saveError.message || "Could not save this goal.");
    }
  };

  const remove = async () => {
    try {
      await deleteGoal(deleting.id || deleting._id);
      setDeleting(null);
      toast.success("Goal deleted");
    } catch (deleteError) {
      toast.error(deleteError.message || "Could not delete this goal.");
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Goals" }]} />
      <PageHeader
        title="Savings goals"
        eyebrow="Planning"
        description="Give your savings a target, a timeline and visible progress."
        action={
          <Button
            icon={Plus}
            onClick={() => setEditing(false)}
            className="bg-[var(--accent)] text-[var(--text-inverse)] hover:bg-[var(--accent-strong)]"
          >
            Create goal
          </Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total target"
          value={formatCurrency(summary.totalTarget)}
          detail={`${summary.count} goals`}
          icon={Target}
          tone="info"
        />
        <MetricCard
          label="Saved so far"
          value={formatCurrency(summary.totalSaved)}
          detail={`${summary.progress}% of all targets`}
          icon={CheckCircle2}
          tone="success"
        />
        <MetricCard
          label="Still needed"
          value={formatCurrency(summary.totalRemaining)}
          detail="Across active goals"
          icon={Target}
          tone="warning"
        />
        <MetricCard
          label="Needs attention"
          value={summary.atRisk.length}
          detail="Overdue or approaching deadline"
          icon={TriangleAlert}
          tone={summary.atRisk.length ? "danger" : "success"}
        />
      </div>

      {error && <ErrorState message={error} onRetry={refresh} />}
      {!error && loading && (
        <p className="py-8 text-center text-sm text-[var(--text-muted)]">
          Loading goals…
        </p>
      )}
      {!error &&
        !loading &&
        goals.length === 0 && (
          <div className="rounded-3xl border border-dashed border-[var(--border-subtle)] bg-[var(--surface-raised)]/50 px-8 py-16 text-center">
            <Target size={32} className="mx-auto text-[var(--text-muted)]" />
            <h2 className="mt-4 text-sm font-semibold text-[var(--text-primary)]">
              Nothing on your goal list yet
            </h2>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Add a savings target and track progress over time.
            </p>
            <Button
              onClick={() => setEditing(false)}
              className="mt-6 bg-[var(--accent)] text-[var(--text-inverse)] hover:bg-[var(--accent-strong)]"
            >
              Create goal
            </Button>
          </div>
        )}
      {!error &&
        !loading &&
        goals.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {goals.map((goal) => (
              <GoalCard
                key={goal.id || goal._id}
                goal={goal}
                onEdit={setEditing}
                onDelete={setDeleting}
                onSelect={setEditing}
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
        title={editing ? "Edit savings goal" : "Create savings goal"}
        description="Update the target, saved amount or target date."
      >
        {formError && (
          <p role="alert" className="mb-4 rounded-lg border border-[var(--danger)]/20 bg-[var(--danger-soft)] px-3 py-2.5 text-sm text-[var(--danger)]">
            {formError}
          </p>
        )}
        <GoalForm
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
        title="Delete this goal?"
        message="This savings goal and its progress will be permanently removed."
        confirmText="Delete goal"
      />
    </div>
  );
}
