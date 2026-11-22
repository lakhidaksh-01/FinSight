import { Inbox } from "lucide-react";
import Button from "./Button";

/*
 * EmptyState
 * ----------
 * Used when a page or section has no data yet.
 */
function EmptyState({
  icon: Icon = Inbox,
  title = "Nothing here yet",
  description,
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-dashed border-[var(--border-subtle)] bg-[var(--surface-raised)]/50 px-8 py-12 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--border-subtle)]/50 bg-[var(--surface)] text-[var(--text-muted)]">
        <Icon size={26} strokeWidth={1.7} />
      </div>

      <h3 className="text-base font-semibold tracking-tight text-[var(--text-primary)]">
        {title}
      </h3>

      {description && (
        <p className="mt-3 max-w-md text-sm leading-6 text-[var(--text-muted)]">
          {description}
        </p>
      )}

      {actionLabel && onAction && (
        <div className="mt-6">
          <Button onClick={onAction}>{actionLabel}</Button>
        </div>
      )}
    </div>
  );
}

export default EmptyState;
