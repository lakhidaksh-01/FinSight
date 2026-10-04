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
    <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-red-500/10 bg-red-500/[0.03] px-6 py-10 text-center">
      {/* Error icon */}
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/15 bg-red-500/[0.08] text-red-400">
        <AlertCircle size={25} strokeWidth={1.7} />
      </div>

      <h3 className="text-base font-semibold text-white">
        {title}
      </h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        {message}
      </p>

      {/* Retry button */}
      {onRetry && (
        <div className="mt-5">
          <Button
            variant="outline"
            icon={RefreshCw}
            onClick={onRetry}
          >
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
}

export default ErrorState;
