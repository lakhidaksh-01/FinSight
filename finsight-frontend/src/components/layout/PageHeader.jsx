/*
 * PageHeader
 * ----------
 * Reusable heading section for application pages.
 */
function PageHeader({ title, description, action, eyebrow }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && (
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">{eyebrow}</p>
        )}

        <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl">{title}</h1>

        {description && (
          <p className="mt-1.5 max-w-2xl text-sm leading-5 text-[var(--text-muted)]">{description}</p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export default PageHeader;
