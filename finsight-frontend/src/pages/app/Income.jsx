import { useEffect, useState } from "react";
import { ArrowUpRight, Plus, Wallet } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Button from "../../components/common/Button";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import ErrorState from "../../components/common/ErrorState";
import MetricCard from "../../components/common/MetricCard";
import Modal from "../../components/common/Modal";
import IncomeFilters from "../../components/income/IncomeFilters";
import IncomeForm from "../../components/income/IncomeForm";
import IncomeTable from "../../components/income/IncomeTable";
import IncomeSummary from "../../components/income/IncomeSummary";
import PageHeader from "../../components/layout/PageHeader";
import Breadcrumbs from "../../components/layout/Breadcrumbs";
import { useIncome } from "../../hooks/useIncome";
import { formatCurrency } from "../../utils/formatCurrency";
import Pagination from "../../components/common/Pagination";

export default function Income() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    incomes,
    filters,
    setFilters,
    resetFilters,
    pagination,
    setPage,
    loading,
    saving,
    error,
    refresh,
    createIncome,
    updateIncome,
    deleteIncome,
    summary,
  } = useIncome();
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (location.state?.openForm === "income") {
      setEditing(false);
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, location.state, navigate]);

  const save = async (values) => {
    setFormError("");
    try {
      if (editing) await updateIncome(editing.id || editing._id, values);
      else await createIncome(values);
      setEditing(null);
      toast.success(editing ? "Income updated" : "Income added");
    } catch (saveError) {
      setFormError(saveError.message || "Could not save this income record.");
    }
  };

  const remove = async () => {
    try {
      await deleteIncome(deleting.id || deleting._id);
      toast.success("Income deleted");
      setDeleting(null);
    } catch (deleteError) {
      toast.error(deleteError.message || "Could not delete this income record.");
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Income" }]} />
      <PageHeader
        title="Income"
        eyebrow="Transactions"
        description="Track every source of income feeding your financial plan."
        action={
          <Button
            icon={Plus}
            onClick={() => setEditing(false)}
            className="bg-[var(--accent)] text-[var(--text-inverse)] hover:bg-[var(--accent-strong)]"
          >
            Add income
          </Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard
          label="Filtered income"
          value={formatCurrency(summary.total)}
          detail={`${summary.count} matching records`}
          icon={Wallet}
          tone="success"
        />
        <MetricCard
          label="This month"
          value={formatCurrency(summary.thisMonth)}
          detail="All income recorded this month"
          icon={ArrowUpRight}
          tone="info"
        />
        <MetricCard
          label="Average record"
          value={formatCurrency(summary.average)}
          detail={
            summary.topSource ? `Top source: ${summary.topSource.category}` : "No source data yet"
          }
          icon={Wallet}
          tone="warning"
        />
      </div>

      <IncomeSummary incomes={incomes} previousTotal={0} />
      <IncomeFilters filters={filters} onChange={setFilters} onReset={resetFilters} />

      {error && <ErrorState message={error} onRetry={refresh} />}
      {!error && <IncomeTable incomes={incomes} loading={loading} onEdit={setEditing} onDelete={setDeleting} />}
      {!loading && !error && <Pagination pagination={pagination} onPageChange={setPage} />}

      <Modal
        isOpen={editing !== null}
        onClose={() => {
          setEditing(null);
          setFormError("");
        }}
        title={editing ? "Edit income" : "Add income"}
        description="Changes are saved to your account."
      >
        {formError && (
          <p role="alert" className="mb-4 rounded-lg border border-[var(--danger)]/20 bg-[var(--danger-soft)] px-3 py-2.5 text-sm text-[var(--danger)]">
            {formError}
          </p>
        )}
        <IncomeForm
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
        title="Delete this income record?"
        message="This record will be permanently removed from your account."
        confirmText="Delete income"
      />
    </div>
  );
}
