/*
 * PageHeader
 * ----------
 * Reusable heading section for application pages.
 *
 * Example:
 *
 * <PageHeader
 *   title="Expenses"
 *   description="Track and manage your spending."
 * />
 */

function PageHeader({
  title,
  description,
  action,
  eyebrow,
}) {
  return (
    <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      {/* Heading content */}
      <div className="min-w-0">
        {eyebrow && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            {eyebrow}
          </p>
        )}

        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          {title}
        </h1>

        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:text-[15px]">
            {description}
          </p>
        )}
      </div>

      {/* Optional page action */}
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export default PageHeader;
