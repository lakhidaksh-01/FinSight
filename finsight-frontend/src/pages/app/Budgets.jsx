import { useEffect, useState } from "react";
import { AlertTriangle, CalendarRange, Plus, WalletCards } from "lucide-react";
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
import { useBudgets } from "../../hooks/useBudgets";
import { formatCurrency } from "../../utils/formatCurrency";

const monthValue = (period) => period.month && period.year ? `${String(period.year).padStart(4, "0")}-${String(period.month).padStart(2, "0")}` : "";

export default function Budgets() {
  const location = useLocation();
  const navigate = useNavigate();
  const { budgets, period, setPeriod, loading, saving, error, refresh, createBudget, updateBudget, deleteBudget, summary } = useBudgets();
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

  return <div className="space-y-6">
    <PageHeader title="Budgets" eyebrow="Planning" description="Set monthly category limits and see how your actual spending compares." action={<Button icon={Plus} onClick={() => setEditing(false)} className="!bg-[#9bd3a9] !text-[#132119] hover:!bg-[#b4e4bf]">Create budget</Button>} />
    <div className="flex flex-col gap-3 rounded-xl border border-white/[0.08] bg-[#121a16] p-4 sm:flex-row sm:items-end sm:justify-between">
      <div><label htmlFor="budget-month" className="mb-2 block text-xs font-medium text-[#91a097]">Budget month</label><input id="budget-month" type="month" value={monthValue(period)} onChange={changeMonth} className="h-10 rounded-lg border border-white/10 bg-[#0d1410] px-3 text-sm text-white" /></div>
      <button type="button" onClick={() => { setPeriod("month", ""); setPeriod("year", ""); }} className="h-10 self-start rounded-lg border border-white/10 px-3 text-sm text-[#b4c0b7] hover:bg-white/[0.05] sm:self-end">All months</button>
    </div>
    {!error && <BudgetSummary budgets={budgets} />}
    <div className="grid gap-3 sm:grid-cols-2"><MetricCard label="Budgeted" value={formatCurrency(summary.totalBudgeted)} detail={`${summary.count} category limits`} icon={WalletCards} tone="blue" /><MetricCard label="Needs attention" value={summary.warnings.length + summary.exceeded.length} detail={`${summary.exceeded.length} over limit · ${summary.warnings.length} nearing limit`} icon={AlertTriangle} tone={summary.exceeded.length ? "rose" : "amber"} /></div>
    {error && <ErrorState message={error} onRetry={refresh} />}
    {!error && loading && <p className="py-8 text-center text-sm text-[#91a097]">Loading budgets…</p>}
    {!error && !loading && budgets.length === 0 && <div className="rounded-xl border border-dashed border-white/10 px-6 py-12 text-center"><CalendarRange className="mx-auto text-[#829087]" size={24} /><h2 className="mt-3 text-sm font-semibold">No budgets for this period</h2><p className="mt-1 text-sm text-[#91a097]">Create a category limit to start tracking monthly spending.</p><Button onClick={() => setEditing(false)} className="mt-5 !bg-[#9bd3a9] !text-[#132119]">Create budget</Button></div>}
    {!error && !loading && budgets.length > 0 && <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{budgets.map((budget) => <BudgetCard key={budget.id || budget._id} budget={budget} onEdit={setEditing} onDelete={setDeleting} />)}</div>}
    <Modal isOpen={editing !== null} onClose={() => { setEditing(null); setFormError(""); }} title={editing ? "Edit budget" : "Create budget"} description="Budgets are stored by category and calendar month.">
      {formError && <p role="alert" className="mb-4 rounded-lg border border-red-400/20 bg-red-400/[0.08] px-3 py-2.5 text-sm text-red-300">{formError}</p>}
      <BudgetForm initialData={editing || null} onSubmit={save} onCancel={() => setEditing(null)} loading={saving} />
    </Modal>
    <ConfirmDialog isOpen={Boolean(deleting)} onClose={() => setDeleting(null)} onConfirm={remove} loading={saving} title="Delete this budget?" message="This category budget will be permanently removed." confirmText="Delete budget" />
  </div>;
}