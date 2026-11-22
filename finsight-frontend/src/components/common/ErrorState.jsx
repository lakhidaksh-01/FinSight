import { AlertCircle, RefreshCw } from "lucide-react";
import Button from "./Button";

/*
 * ErrorState
 * ----------
 * Reusable error message for failed API requests
 * or unexpected page errors.
 */
function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this information. Please try again.",
  onRetry,
}) {
  return (
    <div role="alert" className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-[var(--danger)]/20 bg-[var(--danger-soft)] px-8 py-12 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--danger)]/20 bg-[var(--danger)]/10 text-[var(--danger)]">
        <AlertCircle size={26} strokeWidth={1.7} />
      </div>

      <h3 className="text-base font-semibold tracking-tight text-[var(--text-primary)]">
        {title}
      </h3>

      <p className="mt-3 max-w-md text-sm leading-6 text-[var(--text-muted)]">
        {message}
      </p>

      {onRetry && (
        <div className="mt-6">
          <Button variant="outline" icon={RefreshCw} onClick={onRetry}>
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
}

export default ErrorState;
