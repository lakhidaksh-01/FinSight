import { AlertTriangle } from "lucide-react";
import Modal from "./Modal";
import Button from "./Button";

/*
 * ConfirmDialog
 * -------------
 * Reusable confirmation dialog for destructive actions.
 *
 * Example:
 *
 * <ConfirmDialog
 *   isOpen={showDelete}
 *   onClose={() => setShowDelete(false)}
 *   onConfirm={handleDelete}
 *   title="Delete expense?"
 *   message="This action cannot be undone."
 * />
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="small"
    >
      <div className="space-y-6">
        {/* Warning */}
        <div className="flex gap-4 rounded-xl border border-red-500/15 bg-red-500/[0.06] p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
            <AlertTriangle size={19} strokeWidth={1.8} />
          </div>

          <p className="text-sm leading-6 text-slate-400">{message}</p>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>

          <Button
            variant="danger"
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmDialog;
