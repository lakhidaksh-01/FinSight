import { AlertTriangle } from "lucide-react";
import Modal from "./Modal";
import Button from "./Button";

/*
 * ConfirmDialog
 * -------------
 * Reusable confirmation dialog for destructive actions.
 */
function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="small">
      <div className="space-y-6">
        <div className="flex gap-4 rounded-2xl border border-[var(--danger)]/20 bg-[var(--danger-soft)] p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--danger)]/10 text-[var(--danger)]">
            <AlertTriangle size={19} strokeWidth={1.8} />
          </div>
          <p className="text-sm leading-6 text-[var(--text-secondary)]">{message}</p>
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="outline" type="button" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button variant="primary" type="button" onClick={onConfirm} loading={loading}>
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmDialog;
