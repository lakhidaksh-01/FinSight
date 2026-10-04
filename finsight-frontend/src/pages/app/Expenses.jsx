import { useEffect, useState } from "react";
import { Plus, Receipt, Trash2, Wallet } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Button from "../../components/common/Button";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import ErrorState from "../../components/common/ErrorState";
import MetricCard from "../../components/common/MetricCard";
import Modal from "../../components/common/Modal";
import ExpenseFilters from "../../components/expenses/ExpenseFilters";
import ExpenseForm from "../../components/expenses/ExpenseForm";
import ExpenseTable from "../../components/expenses/ExpenseTable";
import PageHeader from "../../components/layout/PageHeader";
import { useExpenses } from "../../hooks/useExpenses";
import { formatCurrency } from "../../utils/formatCurrency";

export default function Expenses() {
  const location = useLocation();
  const navigate = useNavigate();
  const { expenses, filters, setFilters, resetFilters, loading, saving, error, refresh, createExpense, updateExpense, deleteExpense, deleteAllExpenses, summary } = useExpenses();
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [deleteAllOpen, setDeleteAllOpen] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (location.state?.search) {
      setFilters((previous) => ({ ...previous, search: location.state.search }));
      navigate(location.pathname, { replace: true, state: null });
    }
    if (location.state?.openForm === "expenses") {
      setEditing(false);
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, location.state, navigate, setFilters]);

  const save = async (values) => {
    setFormError("");
    try {
      if (editing) await updateExpense(editing.id || editing._id, values);
      else await createExpense(values);
      setEditing(null);
      toast.success(editing ? "Expense updated" : "Expense added");
    } catch (saveError) {
      setFormError(saveError.message || "Could not save this expense.");
    }
  };

  const remove = async () => {
    try {
      await deleteExpense(deleting.id || deleting._id);
      toast.success("Expense deleted");
      setDeleting(null);
    } catch (deleteError) {
      toast.error(deleteError.message || "Could not delete this expense.");
    }
  };

  const removeAll = async () => {
    try {
      await deleteAllExpenses();
      setDeleteAllOpen(false);
      toast.success("All expenses deleted");
    } catch (deleteError) {
      toast.error(deleteError.message || "Could not delete all expenses.");
    }
  };

  return <div className="space-y-6">
    <PageHeader title="Expenses" eyebrow="Transactions" description="Record and review every rupee leaving your account." action={<div className="flex flex-wrap gap-2"><Button variant="danger" icon={Trash2} disabled={!summary.count} onClick={() => setDeleteAllOpen(true)}>Delete all</Button><Button icon={Plus} onClick={() => setEditing(false)} className="!bg-[#9bd3a9] !text-[#132119] hover:!bg-[#b4e4bf]">Add expense</Button></div>} />
    <div className="grid gap-3 sm:grid-cols-3"><MetricCard label="Filtered spending" value={formatCurrency(summary.total)} detail={`${summary.count} matching transactions`} icon={Receipt} tone="amber" /><MetricCard label="This month" value={formatCurrency(summary.thisMonth)} detail="All expenses recorded this month" icon={Wallet} tone="rose" /><MetricCard label="Average transaction" value={formatCurrency(summary.average)} detail={summary.topCategory ? `Top category: ${summary.topCategory.category}` : "No category data yet"} icon={Receipt} tone="blue" /></div>
    <ExpenseFilters filters={filters} onChange={setFilters} onReset={resetFilters} />
    {error && <ErrorState message={error} onRetry={refresh} />}
    {!error && <ExpenseTable expenses={expenses} loading={loading} onEdit={setEditing} onDelete={setDeleting} />}
    <Modal isOpen={editing !== null} onClose={() => { setEditing(null); setFormError(""); }} title={editing ? "Edit expense" : "Add expense"} description="Changes are saved to your account.">
      {formError && <p role="alert" className="mb-4 rounded-lg border border-red-400/20 bg-red-400/[0.08] px-3 py-2.5 text-sm text-red-300">{formError}</p>}
      <ExpenseForm initialData={editing || null} onSubmit={save} onCancel={() => setEditing(null)} loading={saving} />
    </Modal>
    <ConfirmDialog isOpen={Boolean(deleting)} onClose={() => setDeleting(null)} onConfirm={remove} loading={saving} title="Delete this expense?" message="This transaction will be permanently removed from your account." confirmText="Delete expense" />
    <ConfirmDialog isOpen={deleteAllOpen} onClose={() => setDeleteAllOpen(false)} onConfirm={removeAll} loading={saving} title="Delete all expenses?" message="Every expense in your account will be permanently removed. This cannot be undone." confirmText="Delete all expenses" />
  </div>;
}